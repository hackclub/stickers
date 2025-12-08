<script>
  import resizeIcon from '$lib/assets/images/resize.jpg';

  let showModal = $state(false);
  let selectedDesign = $state(null);

  const myDesigns = [
    { designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/80c59fb29dd5a3fbffc1b2297b512ac8cbb719cb_IMG_5304.png ', name: 'FlavorTownRed', status: 'approved', votes: 42, width: 100, height: 100, submittedAt: '2024-03-15' },
    { designUrl: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/80c59fb29dd5a3fbffc1b2297b512ac8cbb719cb_IMG_5304.png ', name: 'FlavorTownRed', status: 'pending', votes: 42, width: 100, height: 100, submittedAt: '2024-03-15' }
  ];

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
    <p>Submit a sticker design, after voting it could be shipped out in the monthly sticker box</p>
  </div>

  <button class="card upload-btn">+ Upload a design</button>
</div>

{#if myDesigns.length > 0}
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Design</th>
          <th>Name</th>
          <th>Submitted</th>
          <th>Status</th>
          <th>Votes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each myDesigns as design}
          <tr>
            <td class="design-cell">
              <img src={design.designUrl} alt={design.name} class="design-thumb" />
              <button class="resize-btn" onclick={() => openModal(design)}>
                <img src={resizeIcon} alt="Resize" />
              </button>
            </td>
            <td>{design.name}</td>
            <td>{design.submittedAt}</td>
            <td>
              <span class="status status-{design.status}">{design.status}</span>
            </td>
            <td>{design.votes}</td>
            <td>
              <button class="action-btn">Edit</button>
              <button class="action-btn delete">Delete</button>
            </td>
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
      <img src={selectedDesign.designUrl} alt={selectedDesign.name} class="modal-image" />
      <div class="modal-footer">
        {selectedDesign.name} — {selectedDesign.width}mm × {selectedDesign.height}mm
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
  }

  .card {
    background: rgba(255, 255, 255, 0.95);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 2px solid #333;
  }

  .info-card {
    flex: 1;
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

  .action-btn {
    font-family: inherit;
    font-size: 0.9rem;
    padding: 0.4rem 0.75rem;
    border: 1px solid #333;
    border-radius: 0.25rem;
    background: #fff;
    cursor: pointer;
    margin-right: 0.5rem;
  }

  .action-btn:hover {
    background: #f0f0f0;
  }

  .action-btn.delete {
    background: #f8d7da;
    border-color: #cc0000;
  }

  .action-btn.delete:hover {
    background: #f5c6cb;
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
</style>
