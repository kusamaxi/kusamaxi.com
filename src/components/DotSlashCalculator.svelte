<script>
  import { onMount } from 'svelte';
  
  export let showSlashAmount = false;
  export let slashPercentage = 2;
  export let stakeAmount = null; // Can be null to use dynamic min stake
  export let showPrice = false;
  
  let dotPrice = 3.59; // USD fallback
  let minStake = 1000000; // fallback
  let loading = false;
  let priceError = false;
  let stakeError = false;
  
  // Determine which stake amount to use
  $: effectiveStake = stakeAmount || minStake;
  $: slashAmount = Math.round((effectiveStake * slashPercentage) / 100);
  $: slashUsd = Math.round(slashAmount * dotPrice);
  
  async function fetchMinStake() {
    if (stakeAmount) return; // Skip if stake is provided
    
    try {
      const { DedotClient, WsProvider } = await import('dedot');
      const client = await DedotClient.new(new WsProvider('wss://rpc.polkadot.io'));
      
      try {
        const activeEra = await client.query.staking.activeEra();
        const validators = await client.query.session.validators();
        
        // Sample 5 validators for speed
        const sampleIndices = [0, Math.floor(validators.length * 0.25), Math.floor(validators.length * 0.5), Math.floor(validators.length * 0.75), validators.length - 1];
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
          minStake = Math.round(stakes[0]);
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
    if (!showPrice) return;
    
    loading = true;
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
      const data = await response.json();
      if (data.polkadot?.usd) {
        dotPrice = data.polkadot.usd;
        priceError = false;
      } else {
        throw new Error('Invalid price data');
      }
    } catch (e) {
      console.warn('Failed to fetch DOT price:', e);
      priceError = true;
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    // Fetch both min stake and price
    setTimeout(() => {
      Promise.all([fetchMinStake(), fetchPrice()]);
    }, 500);
  });
</script>

{#if showPrice}
  <span class="dot-price" class:loading class:error={priceError}>
    {#if loading}
      ~$3.59
    {:else}
      ${dotPrice.toFixed(2)}
    {/if}
  </span>
{:else if showSlashAmount}
  <span class="slash-amount">
    {slashAmount.toLocaleString()} DOT
    <span class="usd-equivalent">(~${slashUsd.toLocaleString()})</span>
  </span>
{:else}
  <span class="stake-amount">
    {effectiveStake.toLocaleString()} DOT
  </span>
{/if}

<style>
  .dot-price, .slash-amount, .stake-amount {
    font-weight: 600;
    color: #be185d;
    white-space: nowrap;
  }
  
  .dot-price.loading {
    opacity: 0.7;
    font-style: italic;
  }
  
  .dot-price.error {
    color: #dc2626;
  }
  
  .slash-amount {
    color: #dc2626;
  }
  
  .usd-equivalent {
    font-weight: 400;
    color: #6b7280;
    font-size: 0.9em;
  }
  
  .stake-amount {
    color: #059669;
  }
</style>
