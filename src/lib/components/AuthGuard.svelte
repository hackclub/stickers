<script>
  import { onMount } from 'svelte';
  import { checkAuth, user, loading } from '$lib/stores/auth.js';

  let { children } = $props();

  onMount(() => {
    checkAuth().then(authenticated => {
      if (!authenticated) {
        window.location.href = '/';
      }
    });
  });
</script>

{#if $loading}
  <div class="auth-loading">
    <p>Loading...</p>
  </div>
{:else if $user}
  {@render children()}
{:else}
  <div class="auth-loading">
    <p>Redirecting...</p>
  </div>
{/if}

<style>
  .auth-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Departure Mono', monospace;
    font-size: 1.5rem;
  }
</style>
