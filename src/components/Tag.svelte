<script lang="ts">
export let onClick: (() => void) | undefined = undefined;
export let variant: "ghost" | "solid" = "ghost"
</script>

{#if onClick}
<button
	type="button"
	class={`inline-block font-heading font-medium ${variant === "ghost" ? "bg-rose-100 text-rose-700" : "shadow-sharp border-2 border-rose-900 bg-white text-zinc-900"} text-[0.65rem] sm:text-xs md:text-sm no-underline py-0.5 px-1.5 sm:py-1 sm:px-2 mt-1 sm:mt-2 uppercase transition-property-filter duration-200 ease-out cursor-pointer border-none whitespace-nowrap`}
	on:click={() => onClick?.()}
>
	<slot />
</button>
{:else}
<span
	class={`inline-block font-heading font-medium ${variant === "ghost" ? "bg-rose-100 text-rose-700" : "shadow-sharp border-2 border-rose-900 bg-white text-zinc-900"} text-[0.65rem] sm:text-xs md:text-sm no-underline py-0.5 px-1.5 sm:py-1 sm:px-2 mt-1 sm:mt-2 uppercase transition-property-filter duration-200 ease-out whitespace-nowrap`}
>
	<slot />
</span>
{/if}
