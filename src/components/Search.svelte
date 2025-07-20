<script>
	export let posts = [];
	export let projects = [];
	
	let searchTerm = '';
	let searchResults = [];
	let showResults = false;
	let inputElement;
	
	$: {
		if (searchTerm.length > 1) {
			const term = searchTerm.toLowerCase();
			const postResults = posts
				.filter(p => 
					p.title.toLowerCase().includes(term) || 
					p.description.toLowerCase().includes(term) ||
					p.tags.some(t => t.toLowerCase().includes(term))
				)
				.map(p => ({ ...p, type: 'post' }));
			
			const projectResults = projects
				.filter(p => 
					p.title.toLowerCase().includes(term) || 
					p.description.toLowerCase().includes(term)
				)
				.map(p => ({ ...p, type: 'project' }));
			
			searchResults = [...postResults, ...projectResults].slice(0, 8);
			showResults = searchResults.length > 0;
		} else {
			searchResults = [];
			showResults = false;
		}
	}
	
	function handleKeydown(e) {
		if (e.key === 'Escape') {
			searchTerm = '';
			showResults = false;
			inputElement.blur();
		}
	}
	
	// close on click outside
	function handleClickOutside(e) {
		if (!e.target.closest('.search-container')) {
			showResults = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="search-container relative w-full max-w-md mx-auto">
	<div class="relative">
		<input
			bind:this={inputElement}
			type="search"
			placeholder="Search posts and projects..."
			bind:value={searchTerm}
			on:keydown={handleKeydown}
			class="w-full px-4 py-2 pl-10 border-2 border-rose-900 dark:border-rose-600 shadow-sharp outline-none focus:shadow-xl transition-shadow bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
		/>
		<svg class="absolute left-3 top-3 w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>
	</div>
	
	{#if showResults}
		<div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border-2 border-rose-900 dark:border-rose-600 shadow-sharp max-h-96 overflow-y-auto z-50">
			{#each searchResults as result}
				<a 
					href={`/${result.type}/${result.slug}`}
					class="block p-4 hover:bg-rose-50 dark:hover:bg-zinc-700 border-b border-rose-200 dark:border-zinc-600 last:border-b-0 no-underline transition-colors"
					on:click={() => { searchTerm = ''; showResults = false; }}
				>
					<div class="flex items-center gap-2 mb-1">
						<span class="text-xs font-heading uppercase text-rose-600 dark:text-rose-400">
							{result.type}
						</span>
						<h3 class="font-heading font-semibold text-zinc-900 dark:text-zinc-100">{result.title}</h3>
					</div>
					<p class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{result.description}</p>
					{#if result.tags}
						<div class="flex gap-2 mt-2">
							{#each result.tags.slice(0, 3) as tag}
								<span class="text-xs text-zinc-500 dark:text-zinc-500">#{tag}</span>
							{/each}
						</div>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
