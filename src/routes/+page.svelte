<script>
  import { dev } from '$app/environment';
  import Peelable from '$lib/components/Peelable.svelte';
  import Background from '$lib/components/Background.svelte';
  import Logo from '$lib/assets/images/hackClubLogo.png';

  function handleLogin() {
    const authUrl = dev ? 'http://localhost:9292/auth/login' : '/auth/login';
    //console.log('called handleLogin');
    window.location.href = authUrl;
  }
</script>

<Background />

<div class="page-wrapper">
  
  <img src={Logo} alt="Hack Club Stickers" class="hero-logo" title="Logo by Charlie @Dumbhog" draggable="false" on:dragstart|preventDefault />
  <div class="content-container">
    
    <h1><u>Hack Club Stickers</u></h1>
    <p>Get sticky! Every Hack Clubber gets free stickers, and can code or trade to earn a collection.</p>

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
          <span>Loading...</span>
        </div>
      {/snippet}
    </Peelable>

    <footer><a href="https://hackclub.com/privacy-and-terms/" target="_blank" rel="noopener noreferrer">Privacy and Terms</a></footer>
  </div>
</div>

<style>
  @font-face {
    font-family: 'Departure Mono';
    src: url('$lib/assets/fonts/DepartureMono-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :global(html, body) {
    overflow: hidden;
    height: 100%; 
    margin: 0;
    padding: 0;
  }

  .page-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Departure Mono', monospace;
    padding: 2rem;
    box-sizing: border-box;
  }

  .hero-logo {
    width: clamp(180px, 20vw, 300px);
    height: auto;
    margin-bottom: 2rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
    pointer-events: none;
  }

  .content-container {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #333;
    border-radius: 0.5rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 440px;
  }

  p {
    font-size: clamp(1rem, 3.5vw, 1.5rem);
    margin: 0 0 1rem 0;
  }

  .content-container h1 {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
    margin: 0 0 1rem 0;
  }

  a {
    color: #333;
    text-decoration: underline;
  }
  :global(.login-sticker) {
    width: clamp(150px, 20vw, 300px);
    min-height: clamp(45px, 6vw, 80px);
    margin: 1rem 0;
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
    font-size: clamp(1.2rem, 4vw, 2rem);
    padding: 0.5rem;
    box-sizing: border-box;
    word-break: break-word;
    text-align: center;
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

  footer {
    font-size: 1rem;
    color: #666;
    margin-top: 1rem;
  }
</style>
