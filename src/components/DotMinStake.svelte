<script>
  import { onMount } from 'svelte';
  
  export let showDetails = false;
  export let defaultValue = 1000000; // 1M DOT reasonable default
  
  let minStake = defaultValue;
  let loading = false;
  let error = null;
  let samplesChecked = 0;
  
  async function calculateMinStake() {
    loading = true;
    error = null;
    
    try {
      // Dynamic import to avoid SSR issues
      const { DedotClient, WsProvider } = await import('dedot');
      const client = await DedotClient.new(new WsProvider('wss://rpc.polkadot.io'));
      
      try {
        const activeEra = await client.query.staking.activeEra();
        const validators = await client.query.session.validators();
        
        // Sample 6 validators for speed - spread across the validator set
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
              const stake = Number(overview.total) / 1e10; // Convert to DOT
              stakes.push(stake);
              samplesChecked++;
            }
          } catch (e) {
            console.warn(`Failed to fetch stake for validator ${index}:`, e);
          }
        }
        
        if (stakes.length === 0) {
          throw new Error('No validator stakes found');
        }
        
        // Get minimum from samples
        stakes.sort((a, b) => a - b);
        minStake = Math.round(stakes[0]);
        
      } finally {
        await client.disconnect();
      }
      
    } catch (e) {
      console.warn('Failed to calculate min stake:', e);
      error = e.message;
      // Keep default value
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    // Start calculation after a delay to avoid blocking page load
    setTimeout(calculateMinStake, 800);
  });
  
  $: formattedStake = minStake.toLocaleString();
</script>

<span class="min-stake" class:loading class:error>
  {formattedStake} DOT
  {#if showDetails}
    <span class="details">
      {#if loading}
        (calculating min. validator stake...)
      {:else if error}
        (est. min. validator stake)
      {:else if samplesChecked > 0}
        (min. validator stake - sampled {samplesChecked})
      {:else}
        (est. min. validator stake)
      {/if}
    </span>
  {/if}
</span>

<style>
  .min-stake {
    font-weight: 600;
    color: #be185d;
    white-space: nowrap;
    transition: opacity 0.3s ease;
  }
  
  .min-stake.loading {
    opacity: 0.8;
  }
  
  .min-stake.error {
    color: #dc2626;
  }
  
  .details {
    font-size: 0.875em;
    font-weight: 400;
    color: #6b7280;
    margin-left: 0.25rem;
  }
</style>
