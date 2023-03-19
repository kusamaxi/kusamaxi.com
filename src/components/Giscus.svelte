<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const commentOptions = {
      src: 'https://giscus.app/client.js',
      dataRepo: 'kusamaxi/kusamaxi.com',
      dataRepoId: 'MDEwOlJlcG9zaXRvcnkzNDY4NjU0MDQ=',
      'data-category': 'General',
      'data-category-id': 'DIC_kwDOFKy-_M4CU8ZH',
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-lang': 'en',
      crossorigin: 'anonymous',
      async: true,
    };

    const scriptElement = document.createElement('script');
    Object.entries(commentOptions).forEach(([key, value]) => {
      scriptElement.setAttribute(key, value);
    });
    document.getElementById('giscus-comments').appendChild(scriptElement);
  });
</script>

<div id="giscus-comments"></div>
