<script>
  import { onMount } from 'svelte';

  let {
    corner = 'bottom-right',
    peelOnHover = true,
    hoverPeelAmount = 0.15,
    peelOnClick = false,
    peelAwayDuration = 500,
    dragEnabled = false,
    borderRadius = '0',
    class: className = '',
    topContent,
    backContent,
    bottomContent,
    onPeel = () => {},
    onPeelComplete = () => {},
    options = {}
  } = $props();

  let container = $state(null);
  let peel = $state(null);
  let isPeeled = $state(false);
  let isHovering = $state(false);
  let width = $state(0);
  let height = $state(0);
  let cornerValue = $state(3);
  let currentPos = $state(null);
  let isActive = $state(false);
  let animationId = $state(0);

  const cornerMap = {
    'top-left': 0,
    'top-right': 1,
    'bottom-left': 2,
    'bottom-right': 3
  };

  function getRestPosition() {
    switch (cornerValue) {
      case 0: return { x: 0, y: 0 };
      case 1: return { x: width, y: 0 };
      case 2: return { x: 0, y: height };
      case 3: return { x: width, y: height };
    }
  }

  function getHoverPosition() {
    const offset = Math.min(width, height) * hoverPeelAmount;
    switch (cornerValue) {
      case 0: return { x: offset, y: offset };
      case 1: return { x: width - offset, y: offset };
      case 2: return { x: offset, y: height - offset };
      case 3: return { x: width - offset, y: height - offset };
    }
  }

  function getPeeledPosition() {
    switch (cornerValue) {
      case 0: return { x: width * 1.5, y: height * 1.5 };
      case 1: return { x: -width * 0.5, y: height * 1.5 };
      case 2: return { x: width * 1.5, y: -height * 0.5 };
      case 3: return { x: -width * 0.5, y: -height * 0.5 };
    }
  }

  function animateTo(targetX, targetY, duration, callback, showLayers = true) {
    if (!peel) return;
    
    animationId++;
    const thisAnimationId = animationId;
    const startTime = performance.now();
    const startPos = currentPos || getRestPosition();
    let firstFrame = true;
    
    function animate(currentTime) {
      if (thisAnimationId !== animationId) return;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const x = startPos.x + (targetX - startPos.x) * eased;
      const y = startPos.y + (targetY - startPos.y) * eased;
      
      peel.setPeelPosition(x, y);
      currentPos = { x, y };
      
      if (firstFrame && showLayers) {
        firstFrame = false;
        const capturedId = thisAnimationId;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (capturedId === animationId) {
              isActive = true;
            }
          });
        });
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const rest = getRestPosition();
        if (Math.abs(x - rest.x) < 1 && Math.abs(y - rest.y) < 1) {
          isActive = false;
        }
        if (callback) callback();
      }
    }
    
    requestAnimationFrame(animate);
  }

  function handleClick() {
    if (!peelOnClick || !peel) return;
    
    isPeeled = !isPeeled;
    
    if (isPeeled) {
      const target = getPeeledPosition();
      animateTo(target.x, target.y, peelAwayDuration, () => {
        onPeelComplete();
      });
    } else {
      const target = isHovering ? getHoverPosition() : getRestPosition();
      animateTo(target.x, target.y, peelAwayDuration);
    }
  }

  function handleMouseEnter() {
    if (!peel || !peelOnHover || isPeeled) return;
    isHovering = true;
    const pos = getHoverPosition();
    animateTo(pos.x, pos.y, 200);
  }

  function handleMouseLeave() {
    if (!peel || !peelOnHover || isPeeled) return;
    isHovering = false;
    const pos = getRestPosition();
    animateTo(pos.x, pos.y, 200, null, false);
  }

  onMount(async () => {
    const Peel = (await import('$lib/peel.js')).default;
    if (!Peel || !container) return;

    cornerValue = typeof corner === 'string' ? cornerMap[corner] ?? 4 : corner;
    width = container.offsetWidth;
    height = container.offsetHeight;
    
    peel = new Peel(container, {
      corner: cornerValue,
      setPeelOnInit: false,
      ...options
    });

    currentPos = { x: peel.corner.x, y: peel.corner.y };
    peel.setPeelPosition(currentPos.x, currentPos.y);
    


    if (dragEnabled) {
      peel.handleDrag(function(evt, x, y) {
        this.setPeelPosition(x, y);
        onPeel({ x, y, amountClipped: this.getAmountClipped() });
      });
    }

    return () => {
      if (peel) {
        peel.removeEvents();
      }
    };
  });

  export function getPeel() {
    return peel;
  }

  export function setPeelPosition(x, y) {
    if (peel) peel.setPeelPosition(x, y);
  }

  export function peelAway() {
    if (!peel) return;
    isPeeled = true;
    const target = getPeeledPosition();
    animateTo(target.x, target.y, peelAwayDuration, onPeelComplete);
  }

  export function reset() {
    if (!peel) return;
    isPeeled = false;
    const target = getRestPosition();
    animateTo(target.x, target.y, peelAwayDuration);
  }
</script>

<div 
  bind:this={container} 
  class="peelable {className}"
  class:peelable-active={isActive || isPeeled}
  style="--peel-border-radius: {borderRadius}"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={handleClick}
  role="button"
  tabindex="0"
>
  <div class="peel-top">
    {#if topContent}
      {@render topContent()}
    {/if}
  </div>
  <div class="peel-back">
    {#if backContent}
      {@render backContent()}
    {/if}
  </div>
  <div class="peel-bottom">
    {#if bottomContent}
      {@render bottomContent()}
    {/if}
  </div>
</div>

<style>
  .peelable {
    position: relative;
  }

  .peelable :global(.peel-top),
  .peelable :global(.peel-back),
  .peelable :global(.peel-bottom) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--peel-border-radius, 0);
    overflow: hidden;
  }

  .peelable :global(.peel-back),
  .peelable :global(.peel-bottom),
  .peelable :global(.peel-top-shadow),
  .peelable :global(.peel-back-shadow),
  .peelable :global(.peel-back-reflection),
  .peelable :global(.peel-bottom-shadow) {
    opacity: 0;
    pointer-events: none;
  }

  .peelable.peelable-active :global(.peel-back),
  .peelable.peelable-active :global(.peel-bottom),
  .peelable.peelable-active :global(.peel-top-shadow),
  .peelable.peelable-active :global(.peel-back-shadow),
  .peelable.peelable-active :global(.peel-back-reflection),
  .peelable.peelable-active :global(.peel-bottom-shadow) {
    opacity: 1;
    pointer-events: auto;
  }



  .peelable :global(.peel-layer) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-transform-origin: top left;
    -moz-transform-origin: top left;
    transform-origin: top left;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .peelable :global(.peel-svg-clip-element) {
    position: absolute;
    top: -10000px;
    left: -10000px;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
</style>
