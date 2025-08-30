<script lang="ts">
  import { onMount } from 'svelte';

  export let tweetId: string;
  export let comment: string = '';
  export let theme: 'light' | 'dark' = 'light';
  export let conversation: 'none' | 'all' = 'none';
  export let cards: 'hidden' | 'visible' = 'visible';
//  export let width: number | 'auto' = 'auto';
  export let align: 'left' | 'center' | 'right' = 'center';
  export let lang: string = 'en';

  let tweetContainer: HTMLDivElement;
  let loaded = false;
  let error = false;

  onMount(async () => {
    try {
      // Load Twitter widgets script if not already loaded
      if (!window.twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // Wait for twttr to be available
      while (!window.twttr?.widgets) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create tweet embed - let Twitter handle responsive sizing
      await window.twttr.widgets.createTweet(tweetId, tweetContainer, {
        theme,
        conversation,
        cards,
        align,
        lang,
        // Don't set width - let it be responsive
      });

      loaded = true;
    } catch (err) {
      console.error(`Failed to load tweet${comment ? ` (${comment})` : ''}:`, err);
      error = true;
    }
  });
</script>

<!-- Tweet: {comment || tweetId} -->
<div class="twitter-embed-wrapper" data-comment={comment}>
  {#if error}
    <div class="twitter-embed-error">
      <p class="text-zinc-600 font-serif text-center p-4 border-2 border-rose-200 bg-rose-50 rounded max-w-md mx-auto">
        Failed to load tweet{comment ? ` (${comment})` : ''}. 
        <a href="https://twitter.com/i/web/status/{tweetId}" target="_blank" rel="noopener noreferrer" class="text-rose-600 underline">View on Twitter</a>
      </p>
    </div>
  {:else if !loaded}
    <div class="twitter-embed-loading">
      <div class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-rose-600 border-t-transparent"></div>
        {#if comment}
          <span class="ml-2 text-sm text-gray-500">Loading {comment}...</span>
        {/if}
      </div>
    </div>
  {/if}

  <div bind:this={tweetContainer} class="twitter-embed-container"></div>
</div>

<style>
  .twitter-embed-wrapper {
    margin: 2rem auto;
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
  }

  .twitter-embed-container {
    width: 100%;
    max-width: 100%;
  }

  /* Force Twitter iframe to be responsive */
  :global(.twitter-embed-container iframe) {
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
  }

  /* Target the actual tweet container */
  :global(.twitter-embed-container .twitter-tweet) {
    margin: 0 auto !important;
    width: 100% !important;
    max-width: 600px !important;
  }

  /* Mobile responsive */
  @media (max-width: 650px) {
    :global(.twitter-embed-container iframe),
    :global(.twitter-embed-container .twitter-tweet) {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
    }
  }

  /* For larger screens, ensure good readability width */
  @media (min-width: 768px) {
    :global(.twitter-embed-container iframe),
    :global(.twitter-embed-container .twitter-tweet) {
      width: 100% !important;
      max-width: 550px !important;
    }
  }
</style>
