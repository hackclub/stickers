<script>
  import Peelable from '$lib/components/Peelable.svelte';
  import stickersBg from '$lib/assets/images/stickers.jpg';
</script>

<div class="layout">
  <div class="left-column">
    <h1><mark>What's new</mark></h1>

    <div class="cards">
      <div class="card">
      <p>USER is looking for a sticker that you own! Are you open to trade?</p>
      <Peelable
        class="btn-sticker"
        corner="bottom-right"
        peelOnHover={true}
        hoverPeelAmount={0.3}
        borderRadius="0.5rem"
      >
        {#snippet topContent()}
          <div class="sticker-btn">Open</div>
        {/snippet}
        {#snippet backContent()}
          <div class="sticker-back"></div>
        {/snippet}
        {#snippet bottomContent()}
          <div class="sticker-surface"></div>
        {/snippet}
      </Peelable>
    </div>

    <div class="card">
      <p>STICKER is X% cheaper this week</p>
      <Peelable 
        class="btn-sticker"
        corner="bottom-right"
        peelOnHover={true}
        hoverPeelAmount={0.3}
        borderRadius="0.5rem"
      >
        {#snippet topContent()}
          <div class="sticker-btn">Shop</div>
        {/snippet}
        {#snippet backContent()}
          <div class="sticker-back"></div>
        {/snippet}
        {#snippet bottomContent()}
          <div class="sticker-surface"></div>
        {/snippet}
      </Peelable>
    </div>

    <div class="card">
      <p>New sticker drop! Vote on the best option now!</p>
      <Peelable 
        class="btn-sticker"
        corner="bottom-right"
        peelOnHover={true}
        hoverPeelAmount={0.3}
        borderRadius="0.5rem"
      >
        {#snippet topContent()}
          <div class="sticker-btn">Vote</div>
        {/snippet}
        {#snippet backContent()}
          <div class="sticker-back"></div>
        {/snippet}
        {#snippet bottomContent()}
          <div class="sticker-surface"></div>
        {/snippet}
      </Peelable>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="right-column">
    <div class="right-header">
      <h1><mark>Your collection</mark></h1>
      <div class="button-group">
        <button class="btn-left">Claim stickers</button>
        <button class="btn-right">Place stickers</button>
      </div>
    </div>
    <div class="canvas" style="background-image: url({stickersBg});">
      <div class="empty-overlay">
        <b><u>No stickers placed!</u></b>
      </div>
    </div>
  </div>
</div>

<style>
  .layout {
    display: flex;
    gap: 2rem;
    height: calc(100vh - 120px);
    overflow: hidden;
  }

  .left-column {
    flex: 0 0 500px;
    min-width: 500px;
    overflow-y: auto;
    padding-bottom: 2rem;
  }

  .cards {
    display: flex;
    flex-direction: column;
  }

  .divider {
    width: 2px;
    background: #333;
    flex-shrink: 0;
    margin-bottom: 2rem;
  }

  .right-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding-bottom: 2rem;
  }

  .canvas {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.95);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    border: 2px solid #333;
    border-radius: 0.5rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    position: relative;
  }

  .empty-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    text-align: center;
  }

  .empty-overlay mark {
    background-color: #d9c9b6;
    padding: 0.5rem 1rem;
  }

  .right-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-shrink: 0;
  }

  .right-header h1 {
    margin: 0;
  }

  h1 {
    font-size: 3rem;
    margin: 0 0 2rem 0;
  }

  .card {
    background: rgba(250, 248, 245, 0.95);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 2px solid #333;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }

  :global(.btn-sticker) {
    width: 180px;
    height: 50px;
    cursor: pointer;
  }

  .sticker-btn {
    width: 100%;
    height: 100%;
    background: #444444;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
  }

  .sticker-back {
    width: 100%;
    height: 100%;
    background: #d9c9b6;
    border-radius: 0.5rem;
  }

  .sticker-surface {
    width: 100%;
    height: 100%;
    background: #d1a874;
    border-radius: 0.5rem;
  }

  mark {
    background-color: #d9c9b6;
    padding: 0 0.2rem;
  }

  @media (max-width: 900px) {
    .layout {
      flex-direction: column;
      height: auto;
      overflow: visible;
    }

    .left-column {
      flex: 0 0 auto;
      min-width: 0;
      max-width: 100%;
      overflow-y: visible;
    }

    .right-column {
      padding-bottom: 2rem;
    }

    .divider {
      width: 100%;
      height: 2px;
      margin: 1rem 0;
    }

    .canvas {
      min-height: 50vh;
      height: auto;
    }
  }

  .button-group {
    display: flex;
  }

  .button-group button {
    background: #444;
    color: white;
    border: 2px solid #333;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    cursor: pointer;
    font-family: inherit;
  }

  .button-group button:hover {
    background: #555;
  }

  .btn-left {
    border-radius: 0.5rem 0 0 0.5rem;
    border-right: 1px solid #333;
  }

  .btn-right {
    border-radius: 0 0.5rem 0.5rem 0;
    border-left: 1px solid #333;
  }
</style>
