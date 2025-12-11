<script>
  import Background from '$lib/components/Background.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import AuthGuard from '$lib/components/AuthGuard.svelte';
  import '$lib/styles/global.css';
  
  let { children } = $props();
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</svelte:head>

<AuthGuard>
  <Background />
  <Navbar active="leaderboard" />

  <div class="page-content">
    {@render children()}
  </div>

</AuthGuard>

<style>
  .page-content {
    padding: 2rem 4rem;
    max-width: 1500px;
    margin: 0 auto;
  }
  .site-footer {
    background: #000;
    color: #fff;
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
  }
</style>
