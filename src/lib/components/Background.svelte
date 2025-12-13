<script>
  import backPng from '$lib/assets/images/back.png';
</script>

<div class="background-container" style="background-image: url({backPng});">
  <div class="overlay"></div>
</div>

<style>
  .background-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #eeeeee;
    background-repeat: repeat;
    background-size: auto;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(200, 220, 240, 0.75);
    pointer-events: none;
  }
</style>
