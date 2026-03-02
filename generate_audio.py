#!/usr/bin/env python3
"""
batch generate tts audio for all kusamaxi blog posts using local vibevoice service.
outputs wav files to public/audio/<slug>.wav
"""
import base64
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error

VIBEVOICE_URL = "http://localhost:8200/synthesize"
VOICE = "en-Mike_man"
POSTS_DIR = os.path.join(os.path.dirname(__file__), "src", "pages", "post")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")
CHUNK_SIZE = 8000  # chars per chunk (vibevoice limit is 10k, leave margin)


def strip_frontmatter(text: str) -> str:
    """remove yaml frontmatter between --- delimiters"""
    if text.startswith("---"):
        end = text.find("---", 3)
        if end != -1:
            text = text[end + 3:]
    return text.strip()


def strip_markdown(text: str) -> str:
    """convert markdown/mdx to plain text for tts"""
    # remove import/export statements (mdx)
    text = re.sub(r'^(import|export)\s+.*$', '', text, flags=re.MULTILINE)
    # remove jsx components like <Component ... />
    text = re.sub(r'<[A-Z][^>]*/?>', '', text)
    text = re.sub(r'</[A-Z][^>]*>', '', text)
    # remove html tags
    text = re.sub(r'<[^>]+>', '', text)
    # remove images ![alt](url)
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)
    # convert links [text](url) to just text
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)
    # remove code blocks
    text = re.sub(r'```[\s\S]*?```', '', text)
    # remove inline code
    text = re.sub(r'`[^`]+`', '', text)
    # remove blockquote markers
    text = re.sub(r'^>\s*', '', text, flags=re.MULTILINE)
    # remove headers markers but keep text
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # remove bold/italic markers
    text = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', text)
    text = re.sub(r'_{1,3}([^_]+)_{1,3}', r'\1', text)
    # remove horizontal rules
    text = re.sub(r'^[-*_]{3,}\s*$', '', text, flags=re.MULTILINE)
    # remove list markers
    text = re.sub(r'^\s*[-*+]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
    # collapse multiple newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    # collapse multiple spaces
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()


def chunk_text(text: str, max_chars: int = CHUNK_SIZE) -> list[str]:
    """split text into chunks at paragraph boundaries"""
    paragraphs = text.split('\n\n')
    chunks = []
    current = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        if len(current) + len(para) + 2 > max_chars:
            if current:
                chunks.append(current.strip())
            # if single paragraph exceeds limit, split on sentences
            if len(para) > max_chars:
                sentences = re.split(r'(?<=[.!?])\s+', para)
                current = ""
                for sent in sentences:
                    if len(current) + len(sent) + 1 > max_chars:
                        if current:
                            chunks.append(current.strip())
                        current = sent
                    else:
                        current = current + " " + sent if current else sent
            else:
                current = para
        else:
            current = current + "\n\n" + para if current else para

    if current.strip():
        chunks.append(current.strip())

    return chunks


def synthesize(text: str, voice: str = VOICE) -> bytes:
    """call vibevoice service and return raw wav bytes"""
    payload = json.dumps({
        "text": text,
        "voice": voice,
        "output_format": "wav",
        "max_length": 10800,
    }).encode()

    req = urllib.request.Request(
        VIBEVOICE_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
    )

    resp = urllib.request.urlopen(req, timeout=600)
    data = json.loads(resp.read())

    # server returns hex-encoded raw wav bytes
    return bytes.fromhex(data["audio_base64"])


def concatenate_wavs(wav_chunks: list[bytes]) -> bytes:
    """concatenate multiple wav files into one"""
    if len(wav_chunks) == 1:
        return wav_chunks[0]

    import struct
    import wave
    import io

    # read all chunks to get params and raw pcm data
    all_pcm = []
    params = None

    for chunk_bytes in wav_chunks:
        with wave.open(io.BytesIO(chunk_bytes), 'rb') as wf:
            if params is None:
                params = wf.getparams()
            all_pcm.append(wf.readframes(wf.getnframes()))

    # write combined wav
    out = io.BytesIO()
    with wave.open(out, 'wb') as wf:
        wf.setparams(params)
        for pcm in all_pcm:
            wf.writeframes(pcm)

    return out.getvalue()


def process_post(filepath: str, output_path: str) -> bool:
    """generate audio for a single blog post"""
    slug = os.path.basename(filepath).replace('.mdx', '')

    with open(filepath, 'r') as f:
        raw = f.read()

    text = strip_frontmatter(raw)
    text = strip_markdown(text)

    if len(text) < 50:
        print(f"  skip {slug}: too short ({len(text)} chars)")
        return False

    chunks = chunk_text(text)
    print(f"  {slug}: {len(text)} chars -> {len(chunks)} chunk(s)")

    wav_parts = []
    for i, chunk in enumerate(chunks):
        t0 = time.time()
        print(f"    chunk {i+1}/{len(chunks)} ({len(chunk)} chars)...", end=" ", flush=True)
        try:
            wav_data = synthesize(chunk)
            elapsed = time.time() - t0
            print(f"ok ({elapsed:.1f}s, {len(wav_data)} bytes)")
            wav_parts.append(wav_data)
        except Exception as e:
            print(f"FAILED: {e}")
            return False

    combined = concatenate_wavs(wav_parts)
    with open(output_path, 'wb') as f:
        f.write(combined)

    print(f"  -> {output_path} ({len(combined)} bytes)")
    return True


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # check service is up
    try:
        resp = urllib.request.urlopen("http://localhost:8200/health", timeout=5)
        health = json.loads(resp.read())
        if not health.get("model_loaded"):
            print("vibevoice model not loaded yet, wait for startup")
            sys.exit(1)
        print(f"vibevoice service ok: {health['device']}, {len(health['voices'])} voices")
    except Exception as e:
        print(f"vibevoice service not reachable: {e}")
        sys.exit(1)

    posts = sorted(f for f in os.listdir(POSTS_DIR) if f.endswith('.mdx'))
    print(f"\n{len(posts)} posts to process\n")

    # skip already generated unless --force
    force = "--force" in sys.argv

    done = 0
    failed = 0
    skipped = 0

    for post_file in posts:
        slug = post_file.replace('.mdx', '')
        output_path = os.path.join(OUTPUT_DIR, f"{slug}.wav")

        if os.path.exists(output_path) and not force:
            size = os.path.getsize(output_path)
            if size > 1000:
                print(f"  skip {slug}: already exists ({size} bytes)")
                skipped += 1
                continue

        filepath = os.path.join(POSTS_DIR, post_file)
        if process_post(filepath, output_path):
            done += 1
        else:
            failed += 1

    print(f"\ndone: {done} generated, {skipped} skipped, {failed} failed")


if __name__ == "__main__":
    main()
