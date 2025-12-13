<script>
  let selectedRarity = $state('all');
  let searchQuery = $state('');


</script>

<h1><mark>Designs</mark></h1>

<div class="content-row">
  <div class="card info-card">
    <p>Check out all the Hack Club stickers, let us know if we missed any!</p>
  </div>

  <div class="card filter-card">
    <label for="rarity">Sort:</label>
    <select id="rarity" bind:value={selectedRarity}>
      <option value="all">All</option>
      <option value="rarity">Rarity</option>
      <option value="current">Available</option>
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

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Design</th>
        <th>Name</th>
        <th>In Stock</th>
        <th>Price</th>
        <th>Program</th>
        <th>Created</th>
        <th>Artist</th>
      </tr>
    </thead>
    <tbody>
      {#each mockDesigns as design}
        <tr>
          <td class="design-icon">{design.design}</td>
          <td>{design.name}</td>
          <td class:out-of-stock={design.inStock === 0}>{design.inStock}</td>
          <td>{design.price} hrs</td>
          <td>{design.program}</td>
          <td>{design.created}</td>
          <td>{design.artist}</td>
        </tr>
      {/each}
    </tbody>
  </table>
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

  .upload-btn {
    font-family: 'Departure Mono', monospace;
    font-size: 1.5rem;
    cursor: pointer;
    white-space: nowrap;
    flex: 0 0 auto;
  }

  .upload-btn:hover {
    background: rgba(250, 248, 245, 1);
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

  .table-container {
    margin-top: 2rem;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #333;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1.1rem;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }

  th {
    background: rgba(217, 201, 182, 0.5);
    font-weight: normal;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background: rgba(250, 248, 245, 0.5);
  }

  .design-icon {
    font-size: 2rem;
  }

  .out-of-stock {
    color: #cc0000;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .content-row {
      flex-direction: column;
    }

    p {
      font-size: 1rem;
      white-space: normal;
    }

    .card {
      padding: 1rem;
    }

    .filter-card label {
      font-size: 1rem;
    }

    .upload-btn {
      font-size: 1.1rem;
      width: 100%;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      font-size: 0.85rem;
      min-width: 600px;
    }

    th, td {
      padding: 0.5rem;
    }
  }
</style>
