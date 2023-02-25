<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  export let image1Src;
  export let image2Src;

  const dispatch = createEventDispatcher();

  let isDragging = false;
  let startX = 0;
  let sliderWidth = 0;
  let sliderPos = 0;
  let layer2Width = 0;

  const handleMouseDown = (event) => {
    isDragging = true;
    startX = event.clientX;
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const dx = event.clientX - startX;
      const newPos = sliderPos + dx;

      if (newPos >= 0 && newPos <= sliderWidth - layer2Width) {
        sliderPos = newPos;
        startX = event.clientX;
      }
    }
  };

  const handleMouseUp = () => {
    isDragging = false;
    dispatch('sliderPos', sliderPos);
  };

  onMount(() => {
    const slider = document.getElementById('slider');
    sliderWidth = slider.offsetWidth;
    layer2Width = document.getElementById('layer2').offsetWidth;
    sliderPos = (sliderWidth - layer2Width) / 2;
  });
</script>

<div
  class="relative"
  id="slider"
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
>
  <img
    class="w-full h-full object-cover"
    src={image1Src}
    alt="Image of the actual tattoo"
  />
  <div
    class="absolute top-0 left-0 w-full h-full"
    style={`transform: translateX(${sliderPos}px);`}
  >
    <img
      id="layer2"
      class="w-full h-full object-cover transition-all duration-500 ease-in-out"
      src={image2Src}
      alt="Tattoo design to confirm tattoo"
    />
  </div>
  <div
    class="absolute top-0 left-0 w-full h-full cursor-move"
    on:mousedown={handleMouseDown}
  ></div>
</div>
