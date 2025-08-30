<script>
 export let topImageUrl = "";
 export let bottomImageUrl = "";
 export let initialPercentage = 50;

 let sliderValue = initialPercentage;
 let isDragging = false;
 let container;

 function updateSlider(e) {
   if (!container) return;
   
   const rect = container.getBoundingClientRect();
   const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
   const relativeX = x - rect.left;
   const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
   
   sliderValue = percentage;
 }

 function handleStart(e) {
   isDragging = true;
   updateSlider(e);
 }

 function handleMove(e) {
   if (!isDragging) return;
   e.preventDefault();
   updateSlider(e);
 }

 function handleEnd() {
   isDragging = false;
 }

 function handleKeyDown(e) {
   if (e.key === 'ArrowLeft') {
     sliderValue = Math.max(0, sliderValue - 5);
   } else if (e.key === 'ArrowRight') {
     sliderValue = Math.min(100, sliderValue + 5);
   }
 }
</script>

<svelte:window 
 on:mousemove={handleMove}
 on:touchmove={handleMove}
 on:mouseup={handleEnd}
 on:touchend={handleEnd}
/>

<div 
 bind:this={container}
 class="relative overflow-hidden border-2 border-gray-300 rounded select-none cursor-ew-resize"
 role="slider"
 aria-label="Image comparison slider"
 aria-valuenow={Math.round(sliderValue)}
 aria-valuemin="0"
 aria-valuemax="100"
 tabindex="0"
 on:mousedown={handleStart}
 on:touchstart={handleStart}
 on:keydown={handleKeyDown}
>
 <!-- Bottom image -->
 <img 
   class="w-full block" 
   src={bottomImageUrl} 
   alt="Bottom layer for comparison"
   draggable="false"
 />
 
 <!-- Top image container with clip -->
 <div 
   class="absolute inset-0 pointer-events-none"
   style="clip-path: polygon(0 0, {sliderValue}% 0, {sliderValue}% 100%, 0 100%)"
 >
   <img 
     class="w-full h-full object-cover"
     src={topImageUrl} 
     alt="Top layer for comparison"
     draggable="false"
   />
 </div>
 
 <!-- Divider line -->
 <div 
   class="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none transform -translate-x-1/2"
   style="left: {sliderValue}%"
 >
   <!-- Handle -->
   <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-300">
     <svg class="w-6 h-6 mx-auto mt-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
     </svg>
   </div>
 </div>
</div>

<p class="text-center mt-2 text-gray-700" aria-live="polite">Comparison: {Math.round(sliderValue)}%</p>

<style>
 .cursor-ew-resize {
   cursor: ew-resize;
 }
</style>
