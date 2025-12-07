<script>
  import Background from '$lib/components/Background.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import '$lib/styles/global.css';
  
  let { children } = $props();
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</svelte:head>

<Background />
<Navbar active="leaderboard" />

<div class="page-content">
  {@render children()}
</div>

<style>
  .page-content {
    padding: 2rem;
  }
</style>
