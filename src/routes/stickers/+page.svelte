<script>
  import { onMount } from 'svelte';

  let selectedFilter = $state('all');
  let searchQuery = $state('');
  let selectedSticker = $state(null);
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

  function openModal(sticker) {
    selectedSticker = sticker;
  }

  function closeModal() {
    selectedSticker = null;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && selectedSticker) {
      closeModal();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

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
        onclick={() => openModal(design)}
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
      </div>
    {/each}
  </div>

  {#if filteredDesigns.length === 0}
    <div class="no-results">No stickers found</div>
  {/if}
{/if}

{#if selectedSticker}
  <div class="modal-overlay" onclick={closeModal}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <button class="modal-close" onclick={closeModal}>&times;</button>
      <div class="modal-image">
        <img src={selectedSticker.image} alt={selectedSticker.name} />
      </div>
      <div class="modal-footer">
        <h2>{selectedSticker.name}</h2>
        <div class="modal-info">
          {#each Object.entries(selectedSticker) as [key, value]}
            {#if key !== 'image'}
              <div class="info-row">
                <span class="info-key">{key}:</span>
                <span class="info-value">{Array.isArray(value) ? value.join(', ') : value}</span>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
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

  .no-results {
    text-align: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #333;
    border-radius: 0.5rem;
    color: #666;
    font-size: 1.25rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: rgba(255, 255, 255, 0.98);
    border: 3px solid #333;
    border-radius: 0.75rem;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #333;
    color: white;
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .modal-close:hover {
    background: #555;
  }

  .modal-image {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: #f5f5f5;
    min-height: 300px;
  }

  .modal-image img {
    max-width: 100%;
    max-height: 60vh;
    object-fit: contain;
  }

  .modal-footer {
    padding: 1.5rem;
    border-top: 2px solid #333;
  }

  .modal-footer h2 {
    margin: 0 0 1rem 0;
    font-size: 1.75rem;
  }

  .modal-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-row {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(250, 248, 245, 0.5);
    border-radius: 0.25rem;
  }

  .info-key {
    font-weight: bold;
    text-transform: capitalize;
    min-width: 80px;
  }

  .info-value {
    color: #555;
  }
</style>
