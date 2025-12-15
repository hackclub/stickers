<script>
  import Background from '$lib/components/Background.svelte';
  import hackClubLogo from '$lib/assets/images/hackClubLogo.png';
  import '$lib/styles/global.css';
  
  let { children } = $props();
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</svelte:head>

<Background />

<nav class="navbar">
  <div class="navbar-left">
    <a class="navbar-brand" href="/">
      <img src={hackClubLogo} alt="Hack Club Logo" draggable="false"/>
    </a>
    
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="/">Log in for more</a>
      </li>
    </ul>
  </div>

  <a class="flag-link" href="https://hackclub.com" target="_blank" rel="noopener noreferrer">
    <img 
      class="flag-bw" 
      src="https://assets.hackclub.com/flag-standalone-bw.svg" 
      alt="Hack Club Flag"
    />
    <img 
      class="flag-color" 
      src="https://assets.hackclub.com/flag-standalone.svg" 
      alt="Hack Club Flag"
    />
  </a>
</nav>

<div class="page-content">
  {@render children()}
</div>

<style>
  :global(html, body) {
    overflow: auto;
  }

  .navbar {
    font-family: 'Departure Mono', monospace;
    padding: 1rem 2rem;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .navbar-brand img {
    height: 70px;
    width: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
  }

  .navbar-nav {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    margin: 0;
  }

  .nav-link {
    display: block;
    font-size: 1.25rem;
    padding: 0.75rem 1.25rem;
    color: #333;
    text-decoration: underline;
    text-align: left;
    border: 0px solid #333;
    border-radius: 0.5rem;
  }

  .nav-link:hover {
    color: rgb(0 0 0 / 1);
    text-decoration: underline;
  }

  .flag-link {
    display: block;
    position: relative;
    height: 50px;
  }

  .flag-link img {
    height: 50px;
    width: auto;
    transition: opacity 0.2s ease;
  }

  .flag-bw {
    opacity: 1;
  }

  .flag-color {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .flag-link:hover .flag-bw {
    opacity: 0;
  }

  .flag-link:hover .flag-color {
    opacity: 1;
  }

  .page-content {
    padding: 2rem 4rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 1rem;
    }

    .navbar-left {
      gap: 0.5rem;
    }

    .navbar-brand img {
      height: 50px;
    }

    .nav-link {
      font-size: 0.9rem;
      padding: 0.5rem 0.75rem;
    }

    .flag-link,
    .flag-link img {
      height: 35px;
    }

    .page-content {
      padding: 1rem;
    }
  }
</style>
