<script>
  import { onMount } from 'svelte';

  let designs = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let votingId = $state(null);

  onMount(async () => {
    try {
      const res = await fetch('/api/designs/all');
      if (!res.ok) throw new Error('Failed to fetch designs');
      designs = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  async function toggleVote(design) {
    if (votingId) return;
    votingId = design.id;

    try {
      const res = await fetch(`/api/designs/${design.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to submit vote');
      const result = await res.json();
      
      designs = designs.map(d => 
        d.id === design.id 
          ? { ...d, votes: result.votes, voted: result.voted }
          : d
      );
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      votingId = null;
    }
  }

  const myVotesCount = $derived(designs.filter(d => d.voted).length);
</script>

<h1><mark>Vote</mark></h1>

<div class="content-row">
  <div class="card info-card">
    <p>Vote for your favorite designs with a click, The highest voted design will be included in the monthly sticker box and all will be added to the shop for artists to earn commission.</p>
  </div>

  <div class="card votes-card">
    <span class="votes-count">Your votes: {myVotesCount}</span>
  </div>
</div>

{#if loading}
  <div class="loading">Loading designs...</div>
{:else if error}
  <div class="error">Error: {error}</div>
{:else if designs.length === 0}
  <div class="empty-state">
    <p>No approved designs to vote on yet.</p>
  </div>
{:else}
  <div class="designs-grid">
    {#each designs as design}
      <button 
        class="design-card" 
        class:voted={design.voted}
        class:voting={votingId === design.id}
        onclick={() => toggleVote(design)}
        disabled={votingId !== null}
      >
        <div class="design-image">
          <img src={design.cdn_url} alt={design.name} />
        </div>
        <div class="design-footer">
          <span class="design-name">{design.name || 'Untitled'}</span>
          <span class="design-votes">{design.votes} vote{design.votes !== 1 ? 's' : ''}</span>
        </div>
        {#if design.voted}
          <script>
          console.log('voted');
          </script>
        {/if}
        {#if votingId === design.id}
          <div class="voting-overlay">...</div>
        {/if}
      </button>
    {/each}
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
    flex: 1 1 auto;
  }

  .info-card p {
    font-size: 1.5rem;
    margin: 0;
  }

  .votes-card {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
  }

  .votes-count {
    font-size: 1.25rem;
    white-space: nowrap;
  }

  mark {
    background-color: #d9c9b6;
    padding: 0 0.2rem;
  }

  .loading, .error, .empty-state {
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

  .designs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .design-card {
    background: rgba(255, 255, 255, 0.95);
    border: 3px solid #333;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    position: relative;
    padding: 0;
    text-align: left;
    font-family: inherit;
  }

  .design-card:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .design-card.voted {
    border-color: #28a745;
    background: rgba(200, 247, 197, 0.95);
  }

  .design-card.voting {
    opacity: 0.7;
  }

  .design-card:disabled {
    cursor: wait;
  }

  .design-image {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    padding: 1rem;
  }

  .design-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .design-footer {
    padding: 1rem;
    border-top: 1px solid #333;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .design-name {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .design-votes {
    font-size: 0.9rem;
    color: #666;
  }

  .voted-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #28a745;
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }

  .voting-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    .content-row {
      flex-direction: column;
    }

    .info-card {
      flex: 0 0 auto;
    }
  }
</style>
