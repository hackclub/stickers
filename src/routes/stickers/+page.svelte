<script>
  import { onMount } from "svelte";
  import LazyImage from "$lib/components/LazyImage.svelte";

  /** @typedef {{ id: string, name: string, image: string, owned?: boolean, tags?: string[] }} Sticker */

  let selectedFilter = $state("all");
  let searchQuery = $state("");
  /** @type {Sticker | null} */
  let selectedSticker = $state(null);
  /** @type {Sticker[]} */
  let stickers = $state([]);
  let loading = $state(true);
  /** @type {string | null} */
  let error = $state(null);

  onMount(async () => {
    try {
      const res = await fetch("/api/stickers");
      if (!res.ok) throw new Error("Failed to fetch stickers");
      stickers = await res.json();
      const ownedCount = stickers.filter((s) => s.owned).length;
      //TODO: this is slow asf, we can use a ledger maybe
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading = false;
    }
  });

  const filteredDesigns = $derived(
    stickers.filter((d) => {
      const matchesSearch =
        searchQuery === "" ||
        d.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        selectedFilter === "all" || (d.tags && d.tags.includes(selectedFilter));

      return matchesSearch && matchesFilter;
    })
  );

  /** @param {Sticker} sticker */
  function openModal(sticker) {
    selectedSticker = sticker;
  }

  function closeModal() {
    selectedSticker = null;
  }

  /** @param {KeyboardEvent} e */
  function handleKeydown(e) {
    if (e.key === "Escape" && selectedSticker) {
      closeModal();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<h1><mark>Stickers</mark></h1>

<div class="content-row">
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
  <div class="paper-background">
    <h2 class="paper-title"><br />All our beautiful stickers:</h2>
    <div class="stickers-scatter">
      {#each filteredDesigns as design, i}
        <div
          class="sticker-item"
          style="--rotation: {((i * 17) % 30) - 15}deg"
          onclick={() => openModal(design)}
        >
          <div class="sticker-image">
            <LazyImage src={design.image} alt={design.name} />
          </div>
          <span class="sticker-name">{design.name}</span>
        </div>
      {/each}
    </div>
    <p class="paper-footer">
      {#if filteredDesigns.length === 0}
        I don't have that one yet, maybe you can help me <a href="https://forms.hackclub.com/archive" class="archive-link">archive designs</a>
      {:else}
        I can't find the rest, but maybe you can help me <a href="https://forms.hackclub.com/archive" class="archive-link">archive designs</a>
      {/if}
    </p>
  </div>
{/if}

{#if selectedSticker}
  <div class="modal-overlay" onclick={closeModal}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <button class="modal-close" onclick={closeModal}>&times;</button>
      <div class="modal-image">
        <LazyImage src={selectedSticker.image} alt={selectedSticker.name} />
      </div>
      <div class="modal-footer">
        <h2>{selectedSticker.name}</h2>
        <div class="modal-info">
          {#each Object.entries(selectedSticker) as [key, value]}
            {#if key !== "image" && key !== "owned_by" && key !== "owned" && key !== "id"}
              <div class="info-row">
                <span class="info-key">{key}:</span>
                <span class="info-value"
                  >{Array.isArray(value) ? value.join(", ") : value}</span
                >
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @font-face {
    font-family: "GeraldScript";
    src: url("$lib/assets/fonts/GeraldScript.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  h1 {
    font-size: 3rem;
    margin: 0 0 2rem 0;
  }

  .content-row {
    display: flex;
    gap: 1.5rem;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 2rem;
  }

  .card {
    background: transparent;
    padding: 0;
    border-radius: 0;
    border: none;
  }

  .filter-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    flex: 0 0 auto;
    background: rgba(255, 255, 255, 0.95);
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    border: 2px solid #333;
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
  .archive-link {
    font-family: "GeraldScript", cursive;
    text-align: center;
    font-size: 2rem;
    line-height: 32px;
    color: 000000;
    margin: 3rem 0 0 0;
    padding-bottom: 6px;
  }
  .search-card {
    flex: 1 1 200px;
    background-color: #d9c9b6;
    display: flex;
    align-items: center;
  }

  .search-card input {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-bottom: 2px solid #333;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.8);
    width: 100%;
  }

  .search-card input:focus {
    outline: none;
    border-bottom-color: #666;
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
      flex-wrap: wrap;
    }

    .filter-card {
      padding: 0.75rem 1rem;
    }

    .filter-card label {
      font-size: 1rem;
    }

    .search-card {
      flex: 1 1 100%;
    }

    .sticker-image {
      width: 120px;
      height: 120px;
    }

    .stickers-scatter {
      gap: 1.5rem;
    }

    .paper-background {
      padding: 0.5rem 1rem 1.5rem 30px;
    }

    .paper-title,
    .paper-footer {
      font-size: 1.5rem;
    }
  }

  mark {
    background-color: #d9c9b6;
    padding: 0 0.2rem;
  }

  .loading,
  .error {
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

  .paper-background {
    background-color: #faf8f5;
    background-image: linear-gradient(
        to right,
        transparent 0px,
        transparent 40px,
        #e8b4b8 40px,
        #e8b4b8 41px,
        transparent 41px
      ),
      linear-gradient(
        to bottom,
        transparent 0px,
        transparent 62px,
        #6b8cae 62px,
        #6b8cae 66px,
        transparent 66px
      ),
      repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 31px,
        #c8d4e0 31px,
        #c8d4e0 32px
      );
    background-size: 100% 100%, 100% 100%, 100% 32px;
    background-repeat: repeat-y, no-repeat, repeat;
    border: 2px solid #333;
    border-radius: 0.5rem;
    padding: 0.5rem 2rem 2rem 50px;
    min-height: 60vh;
    box-shadow:
      inset 0 0 30px rgba(0, 0, 0, 0.03),
      0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .paper-title {
    font-family: "GeraldScript", cursive;
    text-align: left;
    font-size: 2rem;
    line-height: 28px;
    margin: 0 0 3rem 0;
    color: #333;
  }

  .stickers-scatter {
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    justify-content: center;
    align-items: flex-start;
  }

  .paper-footer {
    font-family: "GeraldScript", cursive;
    text-align: center;
    font-size: 2rem;
    line-height: 32px;
    margin: 3rem 0 0 0;
    padding-bottom: 6px;

    color: #333;
  }

  .sticker-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .sticker-image :global(img) {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
  }

  .sticker-image {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(var(--rotation, 0deg));
    transition: transform 0.2s ease;
  }

  .sticker-item:hover .sticker-image {
    transform: rotate(var(--rotation, 0deg)) scale(1.05);
  }

  .sticker-image :global(img) {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .sticker-name {
    font-size: 1rem;
    color: #333;
    text-align: center;
    max-width: 200px;
    word-wrap: break-word;
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
    overflow: hidden;
  }

  .modal-image :global(img) {
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
    font-family: 'Departure Mono', monospace;
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
