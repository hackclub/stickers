<script>
  import Peelable from '$lib/components/Peelable.svelte';
  import Background from '$lib/components/Background.svelte';
  import hackClubLogo from '$lib/assets/images/hackClub.png';

  let logoTransform = $state('');

  function handleLogoMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = x * 20;
    const rotateX = -y * 20;
    logoTransform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleLogoMouseLeave() {
    logoTransform = '';
  }

  function handleLogin() {
    window.location.href = 'http://localhost:9292/auth/login';
  }
</script>

<Background />

<div class="container">
  <h1>
    <img 
      class="title-logo" 
      src={hackClubLogo} 
      alt="Stickers!"
      style:transform={logoTransform}
      onmousemove={handleLogoMouseMove}
      onmouseleave={handleLogoMouseLeave}
    >
  </h1>
  
  <p>Manage everything sticky! Get free stickers for signing up, hack or trade to earn rare stickers and certify your collection</p> 
    

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
      <span style="color: black; font-size: 2xrem;">Loading...</span>
    </div>
  {/snippet}
  </Peelable>
  <p>*with Hack Club</p>
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
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
    text-align: center;
    font-family: 'Departure Mono', monospace;
    padding: 0 2rem 2rem 2rem;
    background: transparent;
    overflow: hidden;
  }

  h1 {
    font-size: 10rem;
    margin: -20px 0 1rem 0;
    font-weight: 400;
  }

  .title-logo {
    max-width: 100%;
    height: auto;
    transition: transform 0.15s ease-out;
    transform-style: preserve-3d;
  }

  p {
    font-size: 2rem;
    max-width: 60vw;
    margin: 0.5rem 0;
    background: rgba(250, 248, 245, 0.9);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
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
