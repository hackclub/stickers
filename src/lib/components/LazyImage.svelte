<script>
  /** @type {{ src: string, alt?: string, class?: string, width?: number, height?: number, [key: string]: any }} */
  let {
    src,
    alt = '',
    class: className = '',
    width = undefined,
    height = undefined,
    ...restProps
  } = $props();
</script>
    
<img
  {src}
  {alt}
  width={width}
  height={height}
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
