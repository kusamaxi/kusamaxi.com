<template>
  <div class="image-resizers">
    <fieldset aria-describedby="right-dimensions">
      <legend>Right Image Size</legend>
      <div>
        <label for="right-image-width">Width</label>
        <input id="right-image-width" type="range" min="100" max="1000" step="50" value={rightWidth} use:debounce />
      </div>
      <div>
        <label for="right-image-height">Height</label>
        <input id="right-image-height" type="range" min="100" max="1000" step="50" value={rightHeight} use:debounce />
      </div>
      <p id="right-dimensions">
        Dimensions are <code>{rightWidth}px x {rightHeight}px</code>
      </p>
    </fieldset>

    <div class="wrapper">
      {#if process.browser}
      <CompareImage
        imageLeftSrc={imageLeftSrc}
        imageRightSrc={imageRightSrc}
        --handle-size="2.5rem"
        --slider-color="#ffffff"
        --slider-width="0.125rem"
        style="height: {leftHeight}px; width: {leftWidth}px;"
      />
      {/if}
    </div>

    <fieldset aria-describedby="left-dimensions">
      <legend>Left Image Size</legend>
      <div>
        <label for="left-image-width">Width</label>
        <input id="left-image-width" type="range" min="100" max="1000" step="50" value={leftWidth} use:debounce />
      </div>
      <div>
        <label for="left-image-height">Height</label>
        <input id="left-image-height" type="range" min="100" max="1000" step="50" value={leftHeight} use:debounce />
      </div>
      <p id="left-dimensions">
        Dimensions are <code>{leftWidth}px x {leftHeight}px</code>
      </p>
    </fieldset>
  </div>
</template>

<script>
  import CompareImage from 'svelte-compare-image';
  export let imageLeftSrc;
  export let imageRightSrc;
  let leftHeight = 400;
  let leftWidth = 600;
  let rightHeight = 400;
  let rightWidth = 600;

  const debounce = (node) => {
    let timer;
    function handleChange(e) {
      const { valueAsNumber, id } = e.target;
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        switch (id) {
          case "left-image-height": {
            leftHeight = valueAsNumber;
            break;
          }
          case "left-image-width": {
            leftWidth = valueAsNumber;
            break;
          }
          case "right-image-height": {
            rightHeight = valueAsNumber;
            break;
          }
          case "right-image-width": {
            rightWidth = valueAsNumber;
            break;
          }
        }
      }, 300);
    }
    node.addEventListener("input", handleChange);
    return {
      destroy() {
        node.removeEventListener("input", handleChange);
      },
    };
  };
</script>

<style>
  .image-resizers {
    display: flex;
    flex-wrap: wrap;
  }
  fieldset {
    flex: 1 1 auto;
  }
  fieldset p {
    margin: 0;
  }
  .wrapper {
    max-width: 400px;
  }
</style>
