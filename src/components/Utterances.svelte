<script>
  import { onMount } from 'svelte';
  
  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'kusamaxi/kusamaxi.com');
    script.setAttribute('issue-term', 'title');
    script.setAttribute('theme', 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    const comments = document.getElementById('utterances-comments');
    if (comments) {
      comments.appendChild(script);
    }
  });
</script>

<div id="utterances-comments"></div>
