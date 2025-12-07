<script>
  import hackClubLogo from '$lib/assets/images/hackClubLogo.svg';
  
  export let active = '';
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="/dash">
    <img src={hackClubLogo} alt="Hack Club Logo" style="height: 40px;">
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item" class:active={active === 'dash'}>
        <a class="nav-link" href="/dash">| Home |</a>
      </li>
      <li class="nav-item" class:active={active === 'trade'}>
        <a class="nav-link" href="/trade">Trade |</a>
      </li>
      <li class="nav-item" class:active={active === 'earn'}>
        <a class="nav-link" href="/earn">Earn |</a>
      </li>
      <li class="nav-item" class:active={active === 'leaderboard'}>
        <a class="nav-link" href="/leaderboard">Leaderboard |</a>
      </li>
    </ul>
  </div>
</nav>

<style>
  .navbar {
    font-family: 'Departure Mono', monospace;
    padding: 1rem 2rem;
  }

  .navbar :global(.nav-link) {
    font-size: 1.25rem;
    padding: 0.75rem 1.25rem;
  }

  .navbar :global(.navbar-brand img) {
    height: 50px;
  }
</style>
