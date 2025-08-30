<!-- PenumbraFaucet.svelte -->
<script>
  import { onMount } from 'svelte';
  
  export let apiEndpoint = '/api/faucet';
  export let onSuccess = (txId) => {};
  
  let isComputing = false;
  let progress = 0;
  let error = null;
  let hashRate = 0;
  let worker = null;
  let penumbraAddress = '';
  let txId = null;
  let hasWallet = false;
  let checkingWallet = true;
  let isConnecting = false;
  let accountIndex = 0;
  
  onMount(async () => {
    await checkWalletInstalled();
    initWorker();
    
    return () => worker?.terminate();
  });
  
  function initWorker() {
    const workerCode = `
      self.onmessage = async (e) => {
        const { address, difficulty } = e.data;
        const target = '0'.repeat(difficulty);
        let nonce = 0;
        let lastUpdate = Date.now();
        
        while (true) {
          const message = address + ':' + nonce;
          const encoder = new TextEncoder();
          const data = encoder.encode(message);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          if (hashHex.startsWith(target)) {
            postMessage({ type: 'complete', nonce, hash: hashHex });
            break;
          }
          
          nonce++;
          
          if (nonce % 5000 === 0) {
            const now = Date.now();
            const rate = 5000 / ((now - lastUpdate) / 1000);
            postMessage({ type: 'progress', nonce, hashRate: rate });
            lastUpdate = now;
          }
        }
      };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    worker = new Worker(URL.createObjectURL(blob));
  }
  
  async function checkWalletInstalled() {
    checkingWallet = true;
    
    try {
      const { PenumbraClient } = await import('@penumbra-zone/client');
      const providers = PenumbraClient.getProviders();
      hasWallet = Object.keys(providers).length > 0;
    } catch (e) {
      hasWallet = false;
    }
    
    checkingWallet = false;
    
    if (hasWallet) {
      await connectWallet();
    }
  }
  
  async function connectWallet() {
    isConnecting = true;
    error = null;
    
    try {
      const { PenumbraClient } = await import('@penumbra-zone/client');
      const providers = PenumbraClient.getProviders();
      const providerKeys = Object.keys(providers);
      
      if (providerKeys.length === 0) {
        throw new Error('No wallet provider found');
      }
      
      const providerKey = providerKeys[0];
      const penumbra = new PenumbraClient(providerKey);
      await penumbra.connect();
      
      const addressResponse = await penumbra.service.view.ephemeralAddress({
        addressIndex: { account: accountIndex }
      });
      
      if (addressResponse.address) {
        penumbraAddress = addressResponse.address.addressView.value.address;
      }
    } catch (e) {
      error = 'Failed to connect. Please unlock your wallet.';
    } finally {
      isConnecting = false;
    }
  }
  
  async function startPoW() {
    if (isComputing || !penumbraAddress) return;
    
    isComputing = true;
    error = null;
    progress = 0;
    txId = null;
    
    worker.onmessage = async (e) => {
      if (e.data.type === 'progress') {
        hashRate = Math.round(e.data.hashRate);
        const expectedAttempts = Math.pow(2, 5 * 4); // 5 leading zeros
        progress = Math.min(99, Math.floor((e.data.nonce / expectedAttempts) * 100));
      } else if (e.data.type === 'complete') {
        progress = 100;
        
        try {
          const res = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              address: penumbraAddress,
              pow_token: e.data.hash,
              nonce: e.data.nonce
            })
          });
          
          const data = await res.json();
          
          if (res.ok && data.success) {
            txId = data.tx_id;
            onSuccess(txId);
          } else {
            throw new Error(data.message || 'Claim failed');
          }
        } catch (err) {
          error = err.message;
        }
        
        isComputing = false;
      }
    };
    
    worker.postMessage({ address: penumbraAddress, difficulty: 5 });
  }
</script>

<div class="max-w-md mx-auto my-8 font-sans">
  {#if checkingWallet}
    <div class="bg-white border-2 border-pink-900 shadow-[0.25rem_0.25rem_0_0_#881337] p-8">
      <div class="flex justify-center">
        <div class="w-10 h-10 border-4 border-gray-200 border-t-pink-700 rounded-full animate-spin"></div>
      </div>
      <p class="text-center mt-4 text-gray-600">Checking for wallet...</p>
    </div>
  {:else if !hasWallet}
    <div class="bg-white border-2 border-pink-900 shadow-[0.25rem_0.25rem_0_0_#881337] p-8">
      <h3 class="text-2xl font-bold text-pink-900 text-center mb-2">Install Prax Wallet</h3>
      <p class="text-gray-600 text-center mb-6">You'll need Prax wallet to use Penumbra</p>
      <a 
        href="https://praxwallet.com" 
        target="_blank" 
        rel="noopener noreferrer"
        class="block w-full bg-pink-700 hover:bg-pink-900 text-white font-semibold py-3 px-6 text-center transition-colors"
      >
        Install Prax Wallet
      </a>
      <button 
        class="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 transition-colors"
        on:click={checkWalletInstalled}
      >
        I've installed it
      </button>
    </div>
  {:else}
    <div class="bg-white border-2 border-pink-900 shadow-[0.25rem_0.25rem_0_0_#881337] p-8">
      <h3 class="text-2xl font-bold text-pink-900 text-center mb-2">Penumbra Testnet Faucet</h3>
      <p class="text-gray-600 text-center mb-6">Get 1 penumbra for testing</p>
      
      {#if !txId}
        {#if penumbraAddress}
          <div class="mb-6">
            <label class="block text-sm text-gray-600 mb-1">Sending to:</label>
            <div class="bg-gray-100 p-3 rounded flex justify-between items-center">
              <code class="text-sm">{penumbraAddress.slice(0, 20)}...{penumbraAddress.slice(-10)}</code>
              <button 
                class="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                on:click={() => {
                  accountIndex = (accountIndex + 1) % 10;
                  connectWallet();
                }}
              >
                Acc {accountIndex}
              </button>
            </div>
          </div>
        {/if}
        
        {#if isComputing}
          <div class="py-4">
            <div class="flex justify-center mb-4">
              <div class="w-10 h-10 border-4 border-gray-200 border-t-pink-700 rounded-full animate-spin"></div>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Mining... {progress}%</span>
              <span class="font-mono">{hashRate.toLocaleString()} H/s</span>
            </div>
            <div class="h-2 bg-gray-200 rounded overflow-hidden">
              <div class="h-full bg-gradient-to-r from-pink-700 to-pink-900 transition-all duration-300" style="width: {progress}%"></div>
            </div>
          </div>
        {:else if penumbraAddress}
          <button 
            class="w-full bg-pink-700 hover:bg-pink-900 text-white font-semibold py-3 px-6 transition-colors"
            on:click={startPoW}
          >
            Request 1 Penumbra
          </button>
        {:else if isConnecting}
          <div class="flex justify-center">
            <div class="w-10 h-10 border-4 border-gray-200 border-t-pink-700 rounded-full animate-spin"></div>
          </div>
        {:else}
          <button 
            class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 transition-colors"
            on:click={connectWallet}
          >
            Connect Wallet
          </button>
        {/if}
        
        {#if error}
          <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center">
            {error}
          </div>
        {/if}
      {:else}
        <div class="text-center">
          <div class="text-5xl text-green-600 mb-2">✓</div>
          <h4 class="text-xl font-semibold text-green-700 mb-4">Transaction Sent!</h4>
          <div class="bg-gray-100 p-3 rounded mb-4">
            <p class="text-sm text-gray-600">TX ID:</p>
            <code class="text-xs break-all">{txId.slice(0, 20)}...</code>
          </div>
          <button 
            class="w-full bg-pink-700 hover:bg-pink-900 text-white font-semibold py-3 px-6 transition-colors"
            on:click={() => {
              txId = null;
              error = null;
            }}
          >
            Request More
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
