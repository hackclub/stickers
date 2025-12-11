<script>
  import Background from '$lib/components/Background.svelte';
  import errorImg from '$lib/assets/images/404.png';
  import '$lib/styles/global.css';
</script>

<Background />

<div class="error-wrapper">
  <div class="error-container">
    <h1>404!</h1>
    <img src={errorImg} alt="404" class="error-image" />
    <p>You aren't supposed to be here - Please go <a href="/dash">back</a></p>
  </div>
</div>

<style>
  .error-wrapper {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
    overflow: hidden;
  }

  .error-container {
    background: rgba(255, 255, 255, 0.95);
    border: 4px solid #ff0000;
    border-radius: 0.5rem;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .error-image {
    max-width: 300px;
    margin-bottom: 2rem;
  }

  h1 {
    font-family: 'Departure Mono', monospace;
    font-size: 6rem;
    margin: 0 0 1rem 0;
  }

  p {
    font-family: 'Departure Mono', monospace;
    font-size: 1.5rem;
    margin: 0;
  }

  a {
    color: #333;
    text-decoration: underline;
  }

  a:hover {
    color: #000000;
  }
</style>
