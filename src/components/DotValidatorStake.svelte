<script>
  import { onMount } from 'svelte';
  
  export let showMinStake = false;
  export let showSlashAmount = false;
  export let showPrice = false;
  export let slashPercentage = 2;
  export let stakeAmount = null; // For fixed amounts like nominator examples
  
  let minStake = 1000000; // fallback
  let dotPrice = 3.59; // fallback
  let loading = false;
  let stakeError = false;
  let priceError = false;
  
  // Use provided stakeAmount or fetched minStake
  $: effectiveStake = stakeAmount || minStake;
  $: slashAmount = Math.round((effectiveStake * slashPercentage) / 100);
  $: slashUsd = Math.round(slashAmount * dotPrice);
  
  async function fetchData() {
    try {
      const promises = [];
      
      // Fetch min stake if we need it
      if (!stakeAmount) {
        promises.push(fetchMinStake());
      }
      
      // Fetch price if we need it
      if (showPrice || showSlashAmount) {
        promises.push(fetchPrice());
      }
      
      await Promise.all(promises);
    } catch (e) {
      console.warn('Failed to fetch data:', e);
    }
  }
  
  async function fetchMinStake() {
    try {
      const { DedotClient, WsProvider } = await import('dedot');
      const client = await DedotClient.new(new WsProvider('wss://rpc.polkadot.io'));
      
      try {
        const activeEra = await client.query.staking.activeEra();
        const validators = await client.query.session.validators();
        
        const sampleIndices = [0, Math.floor(validators.length * 0.25), Math.floor(validators.length * 0.75), validators.length - 1];
        const stakes = [];
        
        for (const index of sampleIndices) {
          try {
            const validator = validators[index].address();
            const overview = await client.query.staking.erasStakersOverview([activeEra.index, validator]);
            if (overview) {
              stakes.push(Number(overview.total) / 1e10);
            }
          } catch (e) {
            // Skip failed validators
          }
        }
        
        if (stakes.length > 0) {
          stakes.sort((a, b) => a - b);
          const newMinStake = Math.round(stakes[0]);
          console.log(`Fetched min validator stake: ${newMinStake.toLocaleString()} DOT`);
          minStake = newMinStake;
          stakeError = false;
        }
      } finally {
        await client.disconnect();
      }
    } catch (e) {
      console.warn('Failed to fetch min stake:', e);
      stakeError = true;
    }
  }
  
  async function fetchPrice() {
    loading = true;
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
      const data = await response.json();
      if (data.polkadot?.usd) {
        dotPrice = data.polkadot.usd;
        console.log(`Fetched DOT price: $${dotPrice.toFixed(2)}`);
        priceError = false;
      }
    } catch (e) {
      console.warn('Failed to fetch DOT price:', e);
      priceError = true;
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    setTimeout(fetchData, 500);
  });
  
  // Debug logging
  $: if (showSlashAmount) {
    console.log(`Stake calc: ${effectiveStake.toLocaleString()} DOT × ${slashPercentage}% = ${slashAmount.toLocaleString()} DOT × $${dotPrice} = $${slashUsd.toLocaleString()}`);
  }
</script>

{#if showPrice}
  <span class="price" class:loading class:error={priceError}>
    {#if loading}
      ~$3.59
    {:else}
      ${dotPrice.toFixed(2)}
    {/if}
  </span>
{:else if showSlashAmount}
  <span class="slash">
    {slashAmount.toLocaleString()} DOT (~${slashUsd.toLocaleString()})
  </span>
{:else if showMinStake}
  <span class="stake">
    {effectiveStake.toLocaleString()} DOT
  </span>
{:else}
  <span class="stake">
    {effectiveStake.toLocaleString()} DOT
  </span>
{/if}

<style>
  .stake {
    font-weight: 600;
    color: #be185d;
  }
  
  .slash {
    font-weight: 600;
    color: #dc2626;
  }
  
  .price {
    font-weight: 600;
    color: #059669;
  }
  
  .price.loading {
    opacity: 0.7;
    font-style: italic;
  }
  
  .price.error {
    color: #dc2626;
  }
</style>
