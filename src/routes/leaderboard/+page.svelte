<script>
  let sortBy = $state('total');

  const mockUsers = [
    { rank: 1, username: 'MSW', totalStickers: 42, uniques: 33, rares: 4 },
    { rank: 2, username: 'ZRL', totalStickers: 30, uniques: 20, rares: 4 },
    { rank: 3, username: 'LFD', totalStickers: 28, uniques: 18, rares: 3 },
    { rank: 4, username: 'Nora', totalStickers: 19, uniques: 15, rares: 3 },
    { rank: 5, username: 'Euan', totalStickers: 17, uniques: 16, rares: 3 },

    { rank: 1192, username: 'You', totalStickers: 2, uniques: 2, rares: 0 }
  ];

  const youUser = mockUsers.find(u => u.username === 'You');
  const sortedUsers = $derived(
    [...mockUsers].filter(u => u.username !== 'You').sort((a, b) => {
      if (sortBy === 'total') return b.totalStickers - a.totalStickers;
      if (sortBy === 'uniques') return b.uniques - a.uniques;
      if (sortBy === 'rares') return b.rares - a.rares;
      return 0;
    }).map((user, i) => ({ ...user, rank: i + 1 }))
  );
</script>

<h1><mark>Leaderboard</mark></h1>

<div class="content-row">
  <div class="card info-card">
    <p>Top Sticker collectors! This really is a bragging right.</p>
  </div>

  <div class="card filter-card">
    <label for="sort">Sort by:</label>
    <select id="sort" bind:value={sortBy}>
      <option value="total">Total Stickers</option>
      <option value="uniques">Unique Stickers</option>
      <option value="rares">Rare Stickers</option>
    </select>
  </div>
</div>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Username</th>
        <th>Total Stickers</th>
        <th>Uniques</th>
        <th>Rares</th>
      </tr>
    </thead>
    <tbody>
      {#each sortedUsers as user}
        <tr class:top-three={user.rank <= 3}>
          <td class="rank rank-{user.rank}">{user.rank}</td>
          <td class="username">{user.username}</td>
          <td>{user.totalStickers}</td>
          <td>{user.uniques}</td>
          <td>{user.rares}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<br />

{#if youUser}
  <div class="table-container you-container">
    <table>
      <thead class="hidden-header">
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Total Stickers</th>
          <th>Uniques</th>
          <th>Rares</th>
        </tr>
      </thead>
      <tbody>
        <tr class="you-row">
          <td class="rank">{youUser.rank}</td>
          <td class="username">{youUser.username}</td>
          <td>{youUser.totalStickers}</td>
          <td>{youUser.uniques}</td>
          <td>{youUser.rares}</td>
        </tr>
      </tbody>
    </table>
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
    flex-direction: row;
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

  p {
    font-size: 1.5rem;
    margin: 0;
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
    }

    .card {
      padding: 1rem;
    }

    .filter-card label {
      font-size: 1rem;
    }

    table {
      font-size: 0.9rem;
    }

    th, td {
      padding: 0.5rem;
    }
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
    border-collapse: separate;
    border-spacing: 0;
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

  .top-three {
    font-weight: bold;
  }

  .rank {
    font-family: 'Departure Mono', monospace;
    font-size: 1.25rem;
  }

  .rank-1 {
    color: #ffd700;
  }

  .rank-2 {
    color: #c0c0c0;
  }

  .rank-3 {
    color: #cd7f32;
  }

  .username {
    font-weight: bold;
  }

  .you-container {
    background: #d4edda;
  }

  .hidden-header {
    visibility: collapse;
  }

  .you-row:hover {
    background: #c3e6cb;
  }

  .you-row td {
    border-bottom: none;
  }
</style>
