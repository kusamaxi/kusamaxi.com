<script context="module">
	export const prerender = true;
</script>

<script>
	import Image from "svimg";
</script>

<svelte:head>
	<title>Kusama XI - Trusted validator</title>
</svelte:head>

<section>
	<h1 class="text-red-300">
		<div class="welcome">
			<picture>
				<Image
					class="absolute w-full h-full top-0 block"
					src="svelte-welcome.webp"
					alt="Welcome"
				/>
			</picture>
		</div>

		to<br />Kusama XI
	</h1>

	<h2 class="text-red-200">
		stake our node <a class="font-bold px-4 py-2 border-light-700 bg-white drop-shadow-2xl"
				href="https://www.cryptolab.network/benchmark?refKey=3XtR3G6WX18D4stQuo7rdP9CRYCQysdRGcLftiHT1SZsuyQPKdoSa6CXaMLL3UGeppp5ix6gqBqFCVfnxQ3g15zPbtRqWXd9K9WUA2F9AG7dQEw7vuvCmpgedY&signature=0x6497b6284e2a1051a700e2a729baffd84f8d256486ec56f9b57aeef653fa8e45598df9ab805e5205f962b5ae20d5dfe975bb1f0ce2e5d88b2e209c666ab1508d&switchNetwork=Kusama"
			>here!</a>
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}
</style>
