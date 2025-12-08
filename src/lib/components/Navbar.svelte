<script>
  import hackClubLogo from '$lib/assets/images/hackClubLogo.svg';
  
  let { active = '' } = $props();
  let menuOpen = $state(false);

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<nav class="navbar">
  <a class="navbar-brand" href="/dash">
    <img src={hackClubLogo} alt="Hack Club Logo" />
  </a>
  
  <button class="navbar-toggler" onclick={toggleMenu} aria-label="Toggle navigation">
    <span class="toggler-icon"></span>
    <span class="toggler-icon"></span>
    <span class="toggler-icon"></span>
  </button>

  <div class="navbar-collapse" class:open={menuOpen}>
    <ul class="navbar-nav">
      <li class="nav-item" class:active={active === 'dash'}>
        <a class="nav-link" href="/dash">|Home  ⠀</a>
      </li>
      <li class="nav-item" class:active={active === 'trade'}>
        <a class="nav-link" href="/trade">|Trade  ⠀</a>
      </li>
      <li class="nav-item" class:active={active === 'earn'}>
        <a class="nav-link" href="/earn">|Get  ⠀</a>
      </li>
      <li class="nav-item" class:active={active === 'leaderboard'}>
        <a class="nav-link" href="/leaderboard">|Leaderboard  ⠀</a>
      </li>
      <li class="nav-item" class:active={active === 'stickers'}>
        <a class="nav-link" href="/stickers">|Stickers  ⠀</a>
      </li>
      <li class="nav-item" class:active={active === 'my-designs'}>
        <a class="nav-link" href="/my-designs">|My  Designs  ⠀</a>
      </li>
      <li class="nav-item" class:active={active === 'vote'}>
        <a class="nav-link" href="/vote">|Vote  ⠀</a>
      </li>
    </ul>
    <span class="help-text">help us archive stickers! DM @EuanRipper or @Nora on slack</span>
  </div>
</nav>

<style>
  .navbar {
    font-family: 'Departure Mono', monospace;
    padding: 1rem 2rem;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  .navbar-brand img {
    height: 50px;
  }

  .navbar-toggler {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: 2px solid #333;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    margin-left: auto;
  }

  .toggler-icon {
    width: 24px;
    height: 3px;
    background: #333;
    display: block;
  }

  .navbar-collapse {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .navbar-nav {
    display: flex;
    flex-direction: row;
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
    text-decoration: none;
  }

  .nav-link:hover {
    color: #000;
  }

  .nav-item.active .nav-link {
    font-weight: bold;
  }

  .help-text {
    margin-left: auto;
    font-size: 1.1rem;
    font-weight: bold;
    color: #666;
    white-space: nowrap;
  }

  @media (max-width: 992px) {
    .navbar {
      flex-wrap: wrap;
    }

    .navbar-toggler {
      display: flex;
      padding: 12px;
    }

    .toggler-icon {
      width: 28px;
      height: 4px;
    }

    .navbar-collapse {
      display: none;
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      padding: 1.5rem 1rem;
    }

    .navbar-collapse.open {
      display: flex;
    }

    .navbar-nav {
      flex-direction: column;
      width: 100%;
    }

    .nav-link {
      padding: 1rem 1rem;
      border-bottom: 1px solid #ddd;
      font-size: 1.5rem;
    }

    .help-text {
      margin-left: 0;
      margin-top: 1rem;
      white-space: normal;
      font-size: 0.9rem;
    }
  }
</style>
