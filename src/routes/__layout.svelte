<script>
	import "uno.css";
	import Header from "$lib/header/Header.svelte";
	import "../app.css";

	import { onMount } from "svelte";
	export let chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍKSM".split("");
	export let width = null;
	export let height = null;
	export const noInitialDrop = true;
	export const fontSize = 20;
	export const color = "#ce206e";
	export const interval = 40;
	let canvas;
	let windowWidth = 300;
	let windowHeight = 150;
	$: cols = Math.round((width ? width : windowWidth) / fontSize);
	$: drops = Array(cols).fill(
		noInitialDrop ? (height ? height : windowHeight) : 0
	);
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	onMount(async () => {
		// Sync canvas dimensions with window
		[windowWidth, windowHeight] = await [
			window.innerWidth,
			window.innerHeight,
		];
		const ctx = canvas.getContext("2d");
		while (true) {
			// Black bg for the canvas, translucent to show trail
			ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// brand text
			ctx.fillStyle = color;
			ctx.font = `${fontSize}px arial`;
			// Looping
			for (let i = 0; i < drops.length; i++) {
				// Displays a random character from chars
				const randomChar = Math.floor(Math.random() * chars.length);
				const text = chars[randomChar];
				ctx.fillText(text, i * fontSize, drops[i] * fontSize);
				const reachedEndOfScreen =
					drops[i] * fontSize > canvas.height &&
					Math.random() > 0.975;
				if (reachedEndOfScreen) drops[i] = 0;
				drops[i]++;
			}
			await sleep(interval);
		}
	});
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<body class="">
	<canvas
		class="fixed"
		bind:this={canvas}
		width={width ? width : windowWidth}
		height={height ? height : windowHeight}
	/>
	<div class="z-5">
		<Header class="bg-white opacity-40" />

		<main>
			<slot />
		</main>

		<footer>
			<p>
				visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn
				SvelteKit
			</p>
		</footer>
	</div>
</body>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
