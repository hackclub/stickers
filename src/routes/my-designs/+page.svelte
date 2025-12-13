<script>
  import { onMount } from 'svelte';
  import resizeIcon from '$lib/assets/images/resize.jpg';

  let showModal = $state(false);
  let selectedDesign = $state(null);
  let showUploadModal = $state(false);
  let myDesigns = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let uploadUrl = $state('');
  let uploadName = $state('');
  let submitting = $state(false);

  onMount(async () => {
    await fetchDesigns();
  });

  async function fetchDesigns() {
    loading = true;
    try {
      const res = await fetch('/api/designs');
      if (!res.ok) throw new Error('Failed to fetch designs');
      myDesigns = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function submitDesign() {
    if (!uploadUrl.trim()) return;
    submitting = true;
    try {
      const res = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            CDN_URL: uploadUrl,
            Name: uploadName || 'Untitled'
          }
        })
      });
      if (!res.ok) throw new Error('Failed to submit design');
      showUploadModal = false;
      uploadUrl = '';
      uploadName = '';
      await fetchDesigns();
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      submitting = false;
    }
  }

  function openModal(design) {
    selectedDesign = design;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedDesign = null;
  }
</script>

<h1><mark>My Designs</mark></h1>

<div class="content-row">
  <div class="card info-card">
    <p>Submit a sticker design, after approval it will go into the shop where you can be paid per sticker order (after reaching a small threshold)</p>
  </div>

  <button class="card upload-btn" onclick={() => showUploadModal = true}>+ Upload a design</button>
</div>

{#if loading}
  <div class="loading">Loading designs...</div>
{:else if error}
  <div class="error">Error: {error}</div>
{:else if myDesigns.length > 0}
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Design</th>
          <th>Name</th>
          <th>Submitted</th>
          <th>Status</th>
          <th>Votes</th>
        </tr>
      </thead>
      <tbody>
        {#each myDesigns as design}
          <tr>
            <td class="design-cell">
              <img src={design.cdn_url} alt={design.name} class="design-thumb" />
              <button class="resize-btn" onclick={() => openModal(design)}>
                <img src={resizeIcon} alt="Resize" />
              </button>
            </td>
            <td>{design.name || 'Untitled'}</td>
            <td>{design.submitted_at || '-'}</td>
            <td>
              <span class="status status-{design.status || 'pending'}">{design.status || 'pending'}</span>
            </td>
            <td>{design.votes || 0}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div class="empty-state">
    <p>You haven't uploaded any designs yet.</p>
  </div>
{/if}

{#if showModal && selectedDesign}
  <div class="modal-overlay" onclick={closeModal}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <button class="modal-close" onclick={closeModal}>×</button>
      <img src={selectedDesign.cdn_url} alt={selectedDesign.name} class="modal-image" />
      <div class="modal-footer">
        {selectedDesign.name || 'Untitled'}
      </div>
    </div>
  </div>
{/if}

{#if showUploadModal}
  <div class="modal-overlay" onclick={() => showUploadModal = false}>
    <div class="modal-content upload-modal" onclick={(e) => e.stopPropagation()}>
      <button class="modal-close" onclick={() => showUploadModal = false}>×</button>
      <h2>Upload Design</h2>
      <div class="form-group">
        <label for="cdn-url">Link (upload image in #CDN)</label>
        <input type="text" id="cdn-url" bind:value={uploadUrl} placeholder="https://hc-cdn.hel1.your-objectstorage.com/..." />
      </div>
      <div class="form-group">
        <label for="design-name">Name of sticker (optional)</label>
        <input type="text" id="design-name" bind:value={uploadName} placeholder="Heidpheus" />
      </div>
      <button class="submit-btn" onclick={submitDesign} disabled={submitting || !uploadUrl.trim()}>
        {submitting ? 'Submitting...' : 'Submit Design'}
      </button>
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
  }

  @media (max-width: 1000px) {
    .content-row {
      flex-direction: column;
    }

    .info-card {
      flex: 0 0 auto;
    }

    .upload-btn {
      width: 100%;
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

  .design-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .design-thumb {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 0.25rem;
  }

  .resize-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .resize-btn img {
    width: 40px;
    height: 40px;
  }

  .resize-btn:hover {
    opacity: 0.7;
  }

  .status {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.9rem;
  }

  .status-approved {
    background: #c8f7c5;
  }

  .status-pending {
    background: #fff3cd;
  }

  .status-rejected {
    background: #f8d7da;
  }


  .empty-state {
    margin-top: 2rem;
    background: rgba(255, 255, 255, 0.95);
    padding: 3rem;
    border-radius: 0.5rem;
    border: 2px solid #333;
    text-align: center;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: #fff;
    border-radius: 0.5rem;
    border: 2px solid #333;
    padding: 2rem;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
  }

  .modal-image {
    max-width: 70vw;
    max-height: 60vh;
    object-fit: contain;
  }

  .modal-footer {
    margin-top: 1.5rem;
    font-family: 'Departure Mono', monospace;
    font-size: 1.25rem;
    text-align: center;
  }

  .loading, .error {
    margin-top: 2rem;
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

  .upload-modal {
    width: 400px;
    max-width: 90vw;
  }

  .upload-modal h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    font-family: inherit;
    font-size: 1rem;
    border: 2px solid #333;
    border-radius: 0.5rem;
    box-sizing: border-box;
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    font-family: inherit;
    font-size: 1.1rem;
    background: #444;
    color: white;
    border: 2px solid #333;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .submit-btn:hover:not(:disabled) {
    background: #555;
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
