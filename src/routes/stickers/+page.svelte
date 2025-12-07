<script>
  let selectedFilter = $state('all');
  let searchQuery = $state('');
  let expandedId = $state(null);

  const mockDesigns = [
    { id: 1, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 2, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 3, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 4, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 5, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 6, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 7, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 8, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 9, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 10, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 11, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 12, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 13, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 14, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 15, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 16, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 },
    { id: 17, designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/3d9f704b3a59ae5109d4fb1d2ca76fac0b6c917d_image.png', name: 'Boba Drops', inStock: 150, price: 2, program: 'Boba Drops', created: '??', artist: 'MSW', tags: ['current'], width: 100, height: 100 }
  ];

  const filteredDesigns = $derived(
    mockDesigns.filter(d => {
      const matchesSearch = searchQuery === '' || 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.program.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || d.tags.includes(selectedFilter);
      
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

<div class="panels-grid">
  {#each filteredDesigns as design}
    <div 
      class="panel" 
      class:expanded={expandedId === design.id}
      onclick={() => toggleExpand(design.id)}
    >
      <div class="panel-image">
        <img src={design.designUrl} alt={design.name} />
      </div>
      <div class="panel-footer">
        <span class="panel-name">{design.name}</span>
        <span class="panel-artist">by {design.artist}</span>
      </div>
      {#if expandedId === design.id}
        <div class="panel-details">
          <div class="detail-row">
            <span class="detail-label">Dimensions:</span>
            <span>{design.width}mm × {design.height}mm</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Program:</span>
            <span>{design.program}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Created:</span>
            <span>{design.created}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">In Stock:</span>
            <span class:out-of-stock={design.inStock === 0}>{design.inStock}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Price:</span>
            <span>{design.price} hrs</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tags:</span>
            <span class="tags">
              {#each design.tags as tag}
                <span class="tag tag-{tag}">{tag}</span>
              {/each}
            </span>
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

{#if filteredDesigns.length === 0}
  <div class="no-results">No stickers found</div>
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

  .out-of-stock {
    color: #cc0000;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
  }

  .tag {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
  }

  .tag-current {
    background: #c8f7c5;
  }

  .tag-old {
    background: #d0d0d0;
  }

  .tag-special {
    background: #fff3cd;
  }

  .tag-in-person {
    background: #cce5ff;
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
