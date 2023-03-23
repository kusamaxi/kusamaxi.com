<script>
  import { writable } from "svelte/store";

  export let topImageUrl = "";
  export let bottomImageUrl = "";

  let sliderValue = writable(50);
  let imageComparisonTop;

  $: if (imageComparisonTop) {
    imageComparisonTop.style.width = `${$sliderValue}%`;
  }

  function handleSliderInput(event) {
    sliderValue.set(event.target.value);
  }
</script>

<div class="relative overflow-hidden border-gray-300 rounded">
  <img class="w-full block" src="{bottomImageUrl}" alt="Bottom" />
  <div bind:this="{imageComparisonTop}" class="absolute top-0 left-0 overflow-hidden image-comparison-top">
    <img class="w-full block" src="{topImageUrl}" alt="Top" />
  </div>
  <input
    type="range"
    class="absolute bottom-4 left-0 w-full bg-gray-300 bg-opacity-50 cursor-pointer appearance-none h-1 rounded-full outline-none focus:outline-none thumb:bg-gray-400 thumb:w-6 thumb:h-6 thumb:rounded-full thumb:focus:bg-gray-500"
    min="0"
    max="100"
    bind:value="{$sliderValue}"
    on:input="{handleSliderInput}"
  />
</div>

<p>Slider Value: {$sliderValue}%</p>
