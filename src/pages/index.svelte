<script>
	import { onMount } from 'svelte'
	export let chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍKSM'.split('')
	export let width = null
	export let height = null
	export const noInitialDrop = false
	export const fontSize = 12	
	export const color = '#ce206e'
	export const interval = 50
	let canvas
	let windowWidth = 300
	let windowHeight = 150
	$: cols = Math.round((width ? width : windowWidth) / fontSize)
	$: drops = Array(cols).fill(noInitialDrop ? (height ? height : windowHeight) : 0)
	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
	onMount(async () => {
		// Sync canvas dimensions with window
		[windowWidth, windowHeight] = await [window.innerWidth, window.innerHeight]
		const ctx = canvas.getContext('2d')
		while (true) {
			// Black bg for the canvas, translucent to show trail
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			
			// brand text
			ctx.fillStyle = color
			ctx.font = `${fontSize}px arial`
			// Looping
			for (let i = 0; i < drops.length; i++) {
				// Displays a random character from chars
				const randomChar = Math.floor(Math.random() * chars.length)
				const text = chars[randomChar]
				ctx.fillText(text, i * fontSize, drops[i] * fontSize)
				const reachedEndOfScreen = drops[i] * fontSize > canvas.height && Math.random() > 0.975
				if (reachedEndOfScreen) drops[i] = 0
				drops[i]++
			}
			await sleep(interval)
		}
	})
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}/> 

<canvas class="fixed" bind:this={canvas} width={width ? width : windowWidth} height={height ? height : windowHeight}></canvas>
<main class="mx-auto">
	<section class="text-brand-500 absolute top-0 right-0 left-0 mx-auto">
	  <div class="container px-5 py-24 mx-auto flex flex-col">
	    <div class="lg:w-4/6 mx-auto bg-black opacity-80">
	      <div class="rounded-lg h-64 overflow-hidden">
	        <img alt="content" class="object-cover object-center h-full w-full" src="assets/images/reveal-meme.jpg">
	      </div>
	      <div class="flex flex-col sm:flex-row mt-10">
	        <div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
	          <div class="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
	            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
	              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	              <circle cx="12" cy="7" r="4"></circle>
	            </svg>
	          </div>
	          <div class="flex flex-col items-center text-center justify-center">
	            <h1 class="mt-4">Kusama XI</h1>
	            <div class="w-12 h-1 bg-brand-500 rounded mt-2 mb-4"></div>
	            <p class="text-base">11 steps to take on the road to Kusama Maximalism.</p>
	          </div>
	        </div>
	        <div class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
	 
	          <h2>Why is $KSM likely to become more valuable than $DOT?</h2>
	          <p>First mover advantage in cryptocurrencies is always huge. 
	          People are more than likely to dump their other tokens as well as DOTs to participate 
	          in upcoming parachain auction to obtain layer 1 tokens. Parachain Lease Offerings will mean that
	          a lot of $KSM will get unbonded.</p>
	          <p>
	          $KSM has much stronger fundamentals	as a network of community and has shown much more 
	          decentralized decision making compared to Polkadot at Polkassembly.
	          </p>
	          <p>
	          	DOT is designed to be extremely expensive to be participated to avoid chain size growth. 
	          	Like come on, all accounts with less than 1 DOT are considered dust and staking minimum on-chain is 200 DOTs...
	          </p>
	           <a href={null} class="text-brand-500 hover:text-brand-300 inline-flex items-center">Learn More
	            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	              <path d="M5 12h14M12 5l7 7-7 7"></path>
	            </svg>
	          </a>
	        </div>
	      </div>
	    </div>
	  </div>
	</section>
</main>


<style>
  p {
    @apply my-4;
  }

  a {
    @apply text-brand-400 font-bold;
  }

</style>
