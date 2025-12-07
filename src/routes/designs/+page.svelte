<script>
  let selectedRarity = $state('all');
  let searchQuery = $state('');
</script>

<h1><mark>Designs</mark></h1>

<div class="content-row">
  <div class="card info-card">
    <p>Browse and vote on sticker designs here.</p>
  </div>

  <div class="card filter-card">
    <label for="rarity">Filter by rarity:</label>
    <select id="rarity" bind:value={selectedRarity}>
      <option value="all">All</option>
      <option value="current">Current</option>
      <option value="old">Old</option>
      <option value="special">Special</option>
      <option value="in-person">In-Person</option>
    </select>
  </div>

  <div class="card search-card">
    <input 
      type="text" 
      placeholder="Search designs..." 
      bind:value={searchQuery}
    />
  </div>

  <button class="card upload-btn">+ Upload a design</button>
</div>

<style>
  h1 {
    font-size: 3rem;
    margin: 0 0 2rem 0;
  }

  .content-row {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: stretch;
  }

  .card {
    background: rgba(255, 255, 255, 0.95);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 2px solid #333;
  }

  .info-card {
    flex: 0 0 auto;
  }

  .filter-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .filter-card label {
    font-size: 1.25rem;
    white-space: nowrap;
  }

  .filter-card select {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: 2px solid #333;
    border-radius: 0.5rem;
    background: rgba(250, 248, 245, 0.95);
    cursor: pointer;
  }

  .search-card {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .search-card input {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: 2px solid #333;
    border-radius: 0.5rem;
    background: rgba(250, 248, 245, 0.95);
    width: 100%;
  }

  .upload-btn {
    font-family: inherit;
    font-size: 1.25rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .upload-btn:hover {
    background: rgba(250, 248, 245, 1);
  }

  p {
    font-size: 1.5rem;
    margin: 0;
  }

  mark {
    background-color: #d9c9b6;
    padding: 0 0.2rem;
  }
</style>
