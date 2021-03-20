<script>
	let ksmusd=null;
</script>

<main class="mx-auto">
	<section class="text-brand-500 absolute top-0 right-0 left-0 mx-auto z-2">
		<div class="container px-5 py-10 mx-auto flex flex-col">
			<div class="lg:w-9/12 mx-auto bg-black opacity-85">
				<div class="rounded-lg overflow-hidden">
					<img
						alt="content"
						width="1200px"
						height="450px"
						class="object-cover lg:object-fill object-center h-full w-full"
						src="assets/images/reveal-meme.webp"
					/>
				</div>
				<div class="flex border-b-1 border-brand-200 p-2">
					<div class="w-1/3 ">pricefeeds implemented here</div>
					<div class=" w-2/3">
						$KSM: /USD /BTC /ETH /DOT staked bonded
					</div>
				</div>
				<div class="flex flex-col sm:flex-row">
					<div class="sm:w-1/3 text-center sm:pr-8 py-8 px-8 mx-auto">
						<div
							class="w-36 h-36 rounded-full inline-flex items-center justify-center bg-brand-600 text-brand-100"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 2000 1225.75"
								class="w-28 h-28"
							>
								>
								<path
									d="M1887,67.73c-37.49-33.32-79.15-58.32-129.14-66.65-62.48-8.33-125,33.33-166.62,62.48s-125,104.14-158.29,133.3S1316.32,242.68,1178.85,326,508.2,750.88,508.2,750.88H645.66L25,1071.63H87.48L0,1138.28c50,12.49,100,4.16,145.79-20.83v20.83S883.1,846.69,1024.73,921.67l-87.48,25c8.33,0,145.79,8.33,145.79,8.33,8.34,58.32,41.66,112.47,91.65,141.63,83.31,54.15,87.47,87.48,87.47,87.48s-41.65,16.66-41.65,41.65c79.14-25,162.45-25,237.43,0,0,0-4.16-25-62.48-41.65-58.32-25-108.3-62.48-145.79-116.64-33.33-45.82-45.82-104.14-25-158.29s91.65-83.31,237.44-158.29c170.79-87.48,212.44-154.12,233.27-208.28s62.49-154.12,79.15-204.11c16.66-45.82,45.82-83.31,83.31-116.63,45.82-25,95.81-45.83,141.63-62.49C2007.8,163.54,1916.15,88.56,1887,67.73Z"
									fill="#fff"
								/>
							</svg>
						</div>
						<div
							class="flex flex-col items-center text-center justify-center"
						>
							<h1 class="mt-4">Kusama XI</h1>
							<div
								class="w-12 h-1 bg-brand-500 rounded mt-2 mb-4"
							/>
							<p class="text-base">
								Will be publishing here 11 steps to take on the
								road to Kusama Maximalism, talking about best
								staking and PLO strategy.
							</p>
						</div>
					</div>
					<div
						class="sm:w-2/3 sm:px-8 sm:py-8 sm:border-l border-brand-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-left"
					>
						<div class="">
							<h2 class="text-center">
								Why is $KSM likely to become more valuable than
								$DOT?
							</h2>
							<p>
								First mover advantage in cryptocurrencies is
								huge. $KSM will be first interoperable blockchain
								in the world with well thought out sharding in 
								form of parachains. Projects need to auction for the
								parachain slots they want to obtain in kusama.network
								Most projects are going to do Parachain Lease Offering(PLO)
								to lock borrowed $KSM for certain period of time in exchange
								of their project tokens. This will be one of the only
								ways to obtain tokens in the parachain projects meaning
								that a lot of $KSM will get unstaked to be locked in PLO.
								Less staked KSM will mean that staking reward will get in
								higher levels that will drive new adaption even more.
							</p>
							<p>
								$KSM has much stronger fundamentals as a network
								of community and has shown much more
								decentralized decision making compared to
								Polkadot at Polkassembly. Polkadot was
								distributed mainly through ICO sale to huge
								companies that are more investors than
								participators on chain.
							</p>
							<p>
								Polkadot uses an existential deposit (ED) to
								prevent dust accounts from bloating state. If an
								account drops below the ED, it will be reaped,
								i.e. completely removed from storage and the
								nonce reset. Polkadot's ED is 1 DOT, while
								Kusama's is 0.0016666 KSM.
							</p>
							<p>
								Due to the way the Phragmen algorithm generates
								the solution set, and due to the fact that the
								solution set must fit in a single block, there
								is a minimum number of DOT you must nominate
								with in order to receive staking rewards. 
								You need <a href="https://polkaview.network/dot">at least 200 DOTs</a> to 
								nominate/stake DOT and million DOTs to validate onchain.
							</p>
							<p>
								Setting these values so high means that there
								will be barely adaption from community onchain
								and ethereans are less likely to change over 
								from expensive to another expensive chain. 
								Existensial deposit on Polkadot means that
								if you hold under 40$(({ksmusd}) on your wallet,
								it will be reaped and deleted. Theoreticly if $DOT
								reaches marketcap of Bitcoin wallets under 1200$
								are in danger to be reaped...
							</p>
						</div>
						<a
							href="https://polkaview.network/dot"
							class="inline-flex items-center"
							>Learn More
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 ml-0.5"
								viewBox="0 0 24 24"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
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
