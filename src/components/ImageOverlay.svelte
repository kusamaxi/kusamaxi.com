<script>
  export let image1Src;
  export let image2Src;
</script>

<div class="relative">
  <img class="w-full h-full object-cover" src={image1Src} alt="Image of the actual tattoo">
  <div class="absolute top-0 left-0 w-full h-full">
    <img class="w-0 h-0 object-cover transition-all duration-500 ease-in-out"
      src={image2Src} alt="Tattoo design to confirm tattoo">
  </div>
</div>

<style>
  .absolute:hover img {
    width: 25px;
    height: 25px;
    margin-top: -12.5px;
    margin-left: -12.5px;
  }
</style>
