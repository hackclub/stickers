<script>
  /**
   * @param {string} src URL
   * @param {string} alt Alt
   * @param {string} [class=''] class
   * @param {number} [width] 
   * @param {number} [height] 
   */
  let {
    src,
    alt = '',
    class: className = '',
    width,
    height,
    ...restProps
  } = $props();
</script>
    
<img
  {src}
  {alt}
  {width}
  {height}
  loading="lazy"
  decoding="async"
  class={className}
  {...restProps}
/>

<style>
  img {
    max-width: 100%;
    height: auto;
  }
</style>
