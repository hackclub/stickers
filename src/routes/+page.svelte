<script>
  import Peelable from '$lib/components/Peelable.svelte';

  function handleLogin() {
    
    window.location.href = '/login';
  }
</script>

<div class="container">
  <h1>Stickers</h1>
  
  <p>Manage everything sticky! Get free stickers for signing up, hack or trade to earn rare stickers and certify your collection.</p> 
    

  <Peelable 
  class="login-sticker"
  corner="bottom-right"
  peelOnHover={true}
  hoverPeelAmount={0.4}
  peelOnClick={true}
  peelAwayDuration={1000}
  onPeelComplete={handleLogin}
  borderRadius="0.5rem"
>
  {#snippet topContent()}
    <div class="sticker-face">Sign in!</div>
  {/snippet}
  {#snippet backContent()}
    <div class="sticker-back"></div>
  {/snippet}
  {#snippet bottomContent()}
    <div class="sticker-surface">
      <span></span>
    </div>
  {/snippet}
  </Peelable>
  <p>*footer joke here</p>
</div>

<style>
  @font-face {
    font-family: 'Departure Mono';
    src: url('$lib/assets/fonts/DepartureMono-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    font-family: 'Departure Mono', monospace;
    padding: 2rem;
    background: #eeeeee;
  }

  h1 {
    font-size: 10rem;
    margin-bottom: 1rem;
    font-weight: 400;
  }

  p {
    font-size: 2rem;
    max-width: 60vw;
    margin: 0.5rem 0;
    opacity: 0.8;
  }
  :global(.login-sticker) {
    width: clamp(150px, 20vw, 650px);
    height: clamp(45px, 20vw, 120px);
    margin: 2rem 0;
    cursor: pointer;
  }

  .sticker-face {
    width: 100%;
    height: 100%;
    background: #9cada6;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: 'Departure Mono', monospace;
    font-weight: 400;
    font-size: 3.1rem;
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
    background: #ffffff;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    font-family: 'Departure Mono', monospace;
    font-size: 0.9rem;
  }
</style>
