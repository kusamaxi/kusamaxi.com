<script>
  import { onMount } from 'svelte';
  
  export let slashPercentage = 2;
  export let showDetails = false;
  export let defaultStake = 1000000; // Fallback value
  
  let minStake = defaultStake;
  let dotPrice = 3.59;
  let loading = true;
  let error = null;
  
  async function fetchData() {
    try {
      // Fetch both min stake and DOT price in parallel
      const [stakePromise, pricePromise] = await Promise.all([
        calculateMinStake(),
        fetchPrice()
      ]);
      
    } catch (e) {
      console.warn('Failed to fetch data:', e);
      error = e.message;
    } finally {
      loading = false;
    }
  }
  
  async function calculateMinStake() {
    try {
      const { DedotClient, WsProvider } = await import('dedot');
      const client = await DedotClient.new(new WsProvider('wss://rpc.polkadot.io'));
      
      try {
        const activeEra = await client.query.staking.activeEra();
        const validators = await client.query.session.validators();
        
        // Sample 6 validators for speed
        const sampleIndices = [
          0, 
          Math.floor(validators.length * 0.2),
          Math.floor(validators.length * 0.4), 
          Math.floor(validators.length * 0.6),
          Math.floor(validators.length * 0.8),
          validators.length - 1
        ];
        
        const stakes = [];
        
        for (const index of sampleIndices) {
          try {
            const validator = validators[index].address();
            const overview = await client.query.staking.erasStakersOverview([activeEra.index, validator]);
            
            if (overview) {
              const stake = Number(overview.total) / 1e10;
              stakes.push(stake);
            }
          } catch (e) {
            // Skip failed validators
          }
        }
        
        if (stakes.length > 0) {
          stakes.sort((a, b) => a - b);
          minStake = Math.round(stakes[0]);
        }
        
      } finally {
        await client.disconnect();
      }
      
    } catch (e) {
      console.warn('Failed to calculate min stake:', e);
      // Keep default value
    }
  }
  
  async function fetchPrice() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
      const data = await response.json();
      if (data.polkadot?.usd) {
        dotPrice = data.polkadot.usd;
      }
    } catch (e) {
      console.warn('Failed to fetch DOT price:', e);
      // Keep fallback price
    }
  }
  
  onMount(() => {
    // Start fetching after a delay
    setTimeout(fetchData, 500);
  });
  
  $: slashAmount = Math.round((minStake * slashPercentage) / 100);
  $: slashUsd = Math.round(slashAmount * dotPrice);
</script>

<span class="combined-display" class:loading class:error>
  {#if loading}
    <span class="stake">{defaultStake.toLocaleString()} DOT</span>, 
    a {slashPercentage}% slash represents 
    <span class="slash">{Math.round(defaultStake * slashPercentage / 100).toLocaleString()} DOT (~${Math.round(defaultStake * slashPercentage / 100 * 3.59).toLocaleString()})</span>
    at current prices of <span class="price">~$3.59</span> per DOT
  {:else}
    <span class="stake">{minStake.toLocaleString()} DOT</span>, 
    a {slashPercentage}% slash represents 
    <span class="slash">{slashAmount.toLocaleString()} DOT (~${slashUsd.toLocaleString()})</span>
    at current prices of <span class="price">${dotPrice.toFixed(2)}</span> per DOT
    {#if showDetails && !error}
      <span class="details">(live data)</span>
    {:else if error}
      <span class="details">(estimated)</span>
    {/if}
  {/if}
</span>

<style>
  .combined-display {
    white-space: nowrap;
  }
  
  .combined-display.loading {
    opacity: 0.8;
  }
  
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
  
  .details {
    font-size: 0.875em;
    font-weight: 400;
    color: #6b7280;
    margin-left: 0.25rem;
  }
</style>
