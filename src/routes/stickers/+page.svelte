<script>
  import { onMount } from 'svelte';

  let selectedFilter = $state('all');
  let searchQuery = $state('');
  let expandedId = $state(null);
  let stickers = $state([]);
  let loading = $state(true);
  let error = $state(null);

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:9292/stickers');
      if (!res.ok) throw new Error('Failed to fetch stickers');
      stickers = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  const filteredDesigns = $derived(
    stickers.filter(d => {
      const matchesSearch = searchQuery === '' || 
        (d.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = selectedFilter === 'all' || (d.tags && d.tags.includes(selectedFilter));
      
      return matchesSearch && matchesFilter;
    })
  );

  function toggleExpand(id) {
    expandedId = expandedId === id ? null : id;
  }
</script>

<h1><mark>Stickers</mark></h1>

<div class="content-row">
  <div class="card info-card">
    <p>Check out all the Hack Club stickers, let us know if we missed any!</p>
  </div>

  <div class="card filter-card">
    <label for="filter">Filter:</label>
    <select id="filter" bind:value={selectedFilter}>
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
</div>

{#if loading}
  <div class="loading">Loading stickers...</div>
{:else if error}
  <div class="error">Error: {error}</div>
{:else}
  <div class="panels-grid">
    {#each filteredDesigns as design}
      <div 
        class="panel" 
        class:expanded={expandedId === design.id}
        onclick={() => toggleExpand(design.id)}
      >
        <div class="panel-image">
          <img src={design.image} alt={design.name} />
        </div>
        <div class="panel-footer">
          <span class="panel-name">{design.name}</span>
          {#if design.artist}
            <span class="panel-artist">by {design.artist}</span>
          {/if}
        </div>
        {#if expandedId === design.id}
          <div class="panel-details">
            {#if design.event}
              <div class="detail-row">
                <span class="detail-label">Event:</span>
                <span>{design.event}</span>
              </div>
            {/if}
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span>{design.id}</span>
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  {#if filteredDesigns.length === 0}
    <div class="no-results">No stickers found</div>
  {/if}
{/if}

<style>
  h1 {
    font-size: 3rem;
    margin: 0 0 2rem 0;
  }

  .content-row {
    display: flex;
    gap: 1.5rem;
    flex-wrap: nowrap;
    align-items: stretch;
    margin-bottom: 2rem;
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
    flex: 0 0 auto;
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

  p {
    font-size: 1.5rem;
    margin: 0;
    white-space: nowrap;
  }

  mark {
    background-color: #d9c9b6;
    padding: 0 0.2rem;
  }

  .loading, .error {
    text-align: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #333;
    border-radius: 0.5rem;
    font-size: 1.25rem;
  }

  .error {
    color: #cc0000;
  }

  .panels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .panel {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #333;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .panel:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .panel.expanded {
    grid-column: span 1;
  }

  .panel-image {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    padding: 1rem;
  }

  .panel-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .panel-footer {
    padding: 1rem;
    border-top: 1px solid #333;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .panel-name {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .panel-artist {
    font-size: 0.9rem;
    color: #666;
  }

  .panel-details {
    padding: 1rem;
    border-top: 1px solid #333;
    background: rgba(250, 248, 245, 0.5);
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-weight: bold;
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #333;
    border-radius: 0.5rem;
    color: #666;
    font-size: 1.25rem;
  }
</style>
