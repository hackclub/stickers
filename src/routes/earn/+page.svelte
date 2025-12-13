<script>
  import { onMount } from 'svelte';
  import alertIcon from '$lib/assets/images/alert.png';
  import LazyImage from '$lib/components/LazyImage.svelte';

  let sortBy = $state('cheapest');
  let searchQuery = $state('');
  let selectedItem = $state(null);
  let items = $state([]);
  let loading = $state(true);
  let error = $state(null);

  onMount(async () => {
    try {
      const res = await fetch('/api/shop');
      if (!res.ok) throw new Error('Failed to fetch shop items');
      items = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  const filteredItems = $derived(
    items
      .filter(d => {
        const matchesSearch = searchQuery === '' || 
          (d.name?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'cheapest') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'expensive') return (b.price || 0) - (a.price || 0);
        return 0;
      })
  );

  function openModal(item) {
    selectedItem = item;
  }

  function closeModal() {
    selectedItem = null;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && selectedItem) {
      closeModal();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<h1><mark>Shop</mark></h1>

<div class="content-row">
  <div class="card info-card">
    <p>Stickers are priced dynamically based on rarity! You can also get a monthly crate by shipping 10 hours of work.</p>
  </div>


  <div class="card filter-card">
    <label for="sort">Sort By:</label>
    <select id="sort" bind:value={sortBy}>
      <option value="cheapest">Cheapest</option>
      <option value="expensive">Most Expensive</option>
    </select>
  </div>
  <div class="announcement-card card">
    <img src={alertIcon} alt="" class="card-alert" />
    <p><strong>Limited time launch deal:</strong> <br> Code a project for 10 hours and earn a 6 month subscription to Hack Club Stickers, every month we will send you new designs!</p>
  </div>
  <div class="card search-card">
    <input 
      type="text" 
      placeholder="Search shop..." 
      bind:value={searchQuery}
    />
  </div>
  <div class="card tickets-card">
    <span>You have <strong>X</strong> stickets</span>
  </div>
</div>

{#if loading}
  <div class="loading">Loading shop...</div>
{:else if error}
  <div class="error">Error: {error}</div>
{:else}
  <div class="panels-grid">
    {#each filteredItems as item}
      <div 
        class="panel"
        onclick={() => openModal(item)}
      >
        <div class="panel-image">
          <LazyImage src={item.image} alt={item.name} />
        </div>
        <div class="panel-footer">
          <span class="panel-name">{item.name}</span>
          <span class="panel-price">{item.price} Stickets</span>
        </div>
      </div>
    {/each}
  </div>

  {#if filteredItems.length === 0}
    <div class="no-results">No items found</div>
  {/if}
{/if}

{#if selectedItem}
  <div class="modal-overlay" onclick={closeModal}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <button class="modal-close" onclick={closeModal}>&times;</button>
      <div class="modal-image">
        <LazyImage src={selectedItem.image} alt={selectedItem.name} />
      </div>
      <div class="modal-footer">
        <h2>{selectedItem.name}</h2>
        <p class="modal-price">{selectedItem.price} Stickets</p>
        {#if selectedItem.description}
          <p class="modal-description">{selectedItem.description}</p>
        {/if}
        <button class="buy-btn">Purchase</button>
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
    flex-wrap: wrap;
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
    flex: 1 1 300px;
  }

  .announcement-card {
    position: relative;
  }

  .card-alert {
    position: absolute;
    top: -30px;
    right: -25px;
    width: 6vh;
    height: 6vh;
    transform: rotate(14deg);
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
    flex: 1 1 200px;
    display: flex;
    align-items: center;
  }

  .tickets-card {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    font-size: 1.25rem;
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
  }

  @media (max-width: 768px) {
    .content-row {
      flex-direction: column;
    }

    .info-card {
      flex: 0 0 auto;
    }
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

  .panel-price {
    font-size: 1rem;
    color: #28a745;
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
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
  }

  .modal-price {
    font-size: 1.5rem;
    color: #28a745;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .modal-description {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1rem;
  }

  .buy-btn {
    width: 100%;
    padding: 1rem;
    font-family: inherit;
    font-size: 1.25rem;
    background: #28a745;
    color: white;
    border: 2px solid #1e7e34;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .buy-btn:hover {
    background: #218838;
  }


  .announcement-card {
    background: #ffffff;
    color: #000000;
    border-width: 8px;
    border-color: #d15555;
  }
</style>
