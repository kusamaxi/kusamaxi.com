<script lang="ts">
  import { onMount } from 'svelte';

  export let slug: string = '';

  let audioEl: HTMLAudioElement;
  let waveformEl: HTMLDivElement;
  let currentTime = 0;
  let duration = 0;
  let isPlaying = false;
  let isDragging = false;
  let hoverPct: number | null = null;
  let playbackRate = 1;
  let hasError = false;
  let rafId: number | null = null;

  const speeds = [1, 1.25, 1.5, 1.75, 2, 0.75];
  const audioUrl = `https://www.rotko.net/audio/${slug}.opus`;

  // deterministic waveform bars
  const bars = Array.from({ length: 50 }, (_, i) =>
    25 + Math.sin(i * 0.4) * 20 + Math.sin(i * 0.27 + 1.3) * 15 + Math.sin(i * 0.13 + 0.7) * 10
  );

  $: progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  function formatTime(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function togglePlay() {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().catch(() => { hasError = true; });
    } else {
      audioEl.pause();
    }
  }

  function seek(delta: number) {
    if (!audioEl) return;
    audioEl.currentTime = Math.max(0, Math.min(duration, audioEl.currentTime + delta));
    currentTime = audioEl.currentTime;
  }

  function seekToPercent(pct: number) {
    if (!audioEl) return;
    audioEl.currentTime = (pct / 100) * duration;
    currentTime = audioEl.currentTime;
  }

  function cycleSpeed() {
    const idx = speeds.indexOf(playbackRate);
    playbackRate = speeds[(idx + 1) % speeds.length];
    if (audioEl) audioEl.playbackRate = playbackRate;
  }

  function getPct(e: MouseEvent | TouchEvent): number {
    if (!waveformEl) return 0;
    const rect = waveformEl.getBoundingClientRect();
    const clientX = 'touches' in e
      ? (e.touches[0]?.clientX ?? (e as TouchEvent).changedTouches[0]?.clientX)
      : (e as MouseEvent).clientX;
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    isDragging = true;
    const pct = getPct(e);
    seekToPercent(pct);

    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      seekToPercent(getPct(e));
    };
    const onUp = () => {
      isDragging = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function startRaf() {
    const tick = () => {
      if (audioEl && !audioEl.paused) {
        currentTime = audioEl.currentTime;
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
  }

  function stopRaf() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  onMount(() => {
    const handleKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
      if (e.key === ' ' && document.activeElement?.closest('.audio-player')) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      stopRaf();
      window.removeEventListener('keydown', handleKey);
      if (audioEl) { audioEl.pause(); }
    };
  });
</script>

<div class="audio-player my-6 border-2 border-rose-900 bg-white rounded shadow-sharp overflow-hidden" style="position: relative;">
  <audio
    bind:this={audioEl}
    src={audioUrl}
    preload="metadata"
    on:loadedmetadata={() => { duration = audioEl?.duration || 0; }}
    on:play={() => { isPlaying = true; startRaf(); }}
    on:pause={() => { isPlaying = false; stopRaf(); }}
    on:ended={() => { isPlaying = false; currentTime = 0; stopRaf(); }}
    on:error={() => { hasError = true; }}
  />

  {#if hasError}
    <div class="px-4 py-3 text-sm text-zinc-500 font-serif text-center">
      audio not available for this article
    </div>
  {:else}
    <div class="px-3 py-3 flex items-center gap-2">
      <!-- play/pause -->
      <button
        class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-rose-900 bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
        on:click={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {#if isPlaying}
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        {:else}
          <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
        {/if}
      </button>

      <!-- skip back 10s -->
      <button
        class="p-1 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer flex-shrink-0"
        on:click={() => seek(-10)}
        aria-label="Back 10 seconds"
        title="-10s"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 3C17.15 3 21.08 6.03 22.45 10.22L20.08 11C19.01 7.62 15.94 5 12.5 5C10.54 5 8.77 5.74 7.44 6.96L10 9.5H3V2.5L5.72 5.22C7.42 3.83 9.87 3 12.5 3ZM7.59 12.59L6.5 13.68L6.5 11H8.5V13.68L7.59 12.59Z"/><text x="7" y="18" font-size="8" font-weight="bold">10</text></svg>
      </button>

      <!-- skip forward 30s -->
      <button
        class="p-1 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer flex-shrink-0"
        on:click={() => seek(30)}
        aria-label="Forward 30 seconds"
        title="+30s"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.5 3C6.85 3 2.92 6.03 1.55 10.22L3.92 11C4.99 7.62 8.06 5 11.5 5C13.46 5 15.23 5.74 16.56 6.96L14 9.5H21V2.5L18.28 5.22C16.58 3.83 14.13 3 11.5 3Z"/><text x="8" y="18" font-size="8" font-weight="bold">30</text></svg>
      </button>

      <!-- waveform -->
      <div class="flex-1 flex flex-col gap-0.5">
        <div
          bind:this={waveformEl}
          class="h-8 relative select-none rounded cursor-pointer bg-rose-50"
          on:mousedown={handleMouseDown}
          on:mousemove={(e) => { if (!isDragging) hoverPct = getPct(e); }}
          on:mouseleave={() => { if (!isDragging) hoverPct = null; }}
          role="slider"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-label="Seek audio"
          tabindex={0}
        >
          <!-- background bars -->
          <div class="absolute inset-0 flex items-end justify-around px-0.5" style="opacity: 0.25;">
            {#each bars as h}
              <div class="w-0.5 sm:w-1 bg-rose-300 rounded-t" style="height: {h}%;"></div>
            {/each}
          </div>

          <!-- played bars (clipped) -->
          <div
            class="absolute inset-y-0 left-0 overflow-hidden rounded-l"
            style="width: {progressPct}%;"
          >
            <div
              class="absolute inset-0 flex items-end justify-around px-0.5"
              style="width: {progressPct > 0 ? (100 / (progressPct / 100)) : 100}%;"
            >
              {#each bars as h}
                <div class="w-0.5 sm:w-1 bg-rose-600 rounded-t" style="height: {h}%;"></div>
              {/each}
            </div>
          </div>

          <!-- playhead -->
          {#if duration > 0}
            <div
              class="absolute inset-y-0 w-0.5 bg-rose-900"
              style="left: {progressPct}%; box-shadow: 0 0 3px rgba(190,24,93,0.5);"
            ></div>
          {/if}

          <!-- hover line -->
          {#if hoverPct !== null && !isDragging}
            <div
              class="absolute inset-y-0 w-px bg-zinc-400/50"
              style="left: {hoverPct}%;"
            ></div>
          {/if}

          <!-- hover tooltip -->
          {#if (hoverPct !== null || isDragging) && duration > 0}
            <div
              class="absolute -top-7 px-1.5 py-0.5 bg-zinc-800 text-white rounded text-xs font-mono"
              style="left: {hoverPct ?? progressPct}%; transform: translateX(-50%);"
            >
              {formatTime(((hoverPct ?? progressPct) / 100) * duration)}
            </div>
          {/if}
        </div>

        <!-- time row -->
        <div class="flex justify-between text-[10px] text-zinc-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <!-- speed -->
      <button
        class="px-1.5 py-0.5 text-[10px] sm:text-xs font-mono rounded transition-colors cursor-pointer flex-shrink-0 {playbackRate !== 1 ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'text-zinc-400 hover:text-zinc-600 border border-transparent'}"
        on:click={cycleSpeed}
        title="Playback speed"
      >
        {playbackRate}x
      </button>
      <!-- sonotxt link -->
      <a
        href="https://sonotxt.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-[9px] font-heading text-zinc-300 hover:text-rose-600 no-underline transition-colors flex-shrink-0 self-end leading-none"
      >
        <span class="font-semibold">sonotxt</span>
      </a>
    </div>
  {/if}
</div>
