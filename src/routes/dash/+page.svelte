<script>
  import Peelable from '$lib/components/Peelable.svelte';
  import stickersBg from '$lib/assets/images/stickers.jpg';

  let showClaimModal = $state(false);
  let requiredFingers = $state(Math.floor(Math.random() * 5) + 1);
  let uploadedFile = $state(null);
  let previewUrl = $state(null);
  let isDragging = $state(false);

  function goToTrade() {
    window.location.href = '/trade';
  }

  function goToEarn() {
    window.location.href = '/earn';
  }

  function goToVote() {
    window.location.href = '/vote';
  }

  function openClaimModal() {
    requiredFingers = Math.floor(Math.random() * 5) + 1;
    showClaimModal = true;
  }

  function closeClaimModal() {
    showClaimModal = false;
    clearFile();
  }

  function handleFileSelect(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
      setFile(input.files[0]);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function setFile(file) {
    if (file.type.startsWith('image/')) {
      uploadedFile = file;
      previewUrl = URL.createObjectURL(file);
    }
  }

  function clearFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    uploadedFile = null;
    previewUrl = null;
  }

  function submitClaim() {
    if (!uploadedFile) return;
    alert('Claim submitted for verification!');
    closeClaimModal();
  }
</script>

{#if showClaimModal}
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="close-btn" onclick={closeClaimModal}>✕</button>
      
      <h1><mark>Claim Your Stickers</mark></h1>

      <div class="instructions">
        <h2>Verification Required</h2>
        <p>To verify you have the stickers in your possession, please upload a photo showing:</p>
        <ul>
          <li>Your sticker(s) clearly visible</li>
          <li>Your hand holding up <strong>{requiredFingers}</strong> finger{requiredFingers > 1 ? 's' : ''}</li>
        </ul>
        <div class="finger-display">
          <span class="finger-count">{requiredFingers}</span>
          <span class="finger-label">finger{requiredFingers > 1 ? 's' : ''} required</span>
        </div>
      </div>

      <div
        class="upload-area"
        class:dragging={isDragging}
        class:has-preview={previewUrl}
        ondrop={handleDrop}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        role="button"
        tabindex="0"
      >
        {#if previewUrl}
          <div class="preview-container">
            <img src={previewUrl} alt="Upload preview" class="preview-image" />
            <button class="clear-file-btn" onclick={clearFile}>✕</button>
          </div>
        {:else}
          <label class="upload-label">
            <input
              type="file"
              accept="image/*"
              onchange={handleFileSelect}
              class="file-input"
            />
            <div class="upload-content">
              
              <span class="upload-text">Drop your photo here or click to upload</span>
            </div>
          </label>
        {/if}
      </div>

      <button
        class="submit-btn"
        onclick={submitClaim}
        disabled={!uploadedFile}
      >
        Submit for Verification
      </button>
    </div>
  </div>
{/if}

<div class="layout">
  <div class="left-column">
    <h1><mark>What's new</mark></h1>

    <div class="cards">
      <div class="card">
      <p>USER is looking for a sticker that you own! Are you open to trade?</p>
      <Peelable
        class="btn-sticker"
        corner="bottom-right"
        peelOnHover={true}
        hoverPeelAmount={0.3}
        borderRadius="0.5rem"
      >
        {#snippet topContent()}
          <div class="sticker-btn">Open</div>
        {/snippet}
        {#snippet backContent()}
          <div class="sticker-back"></div>
        {/snippet}
        {#snippet bottomContent()}
          <div class="sticker-surface"></div>
        {/snippet}
      </Peelable>
    </div>

    <div class="card">
      <p>STICKER is X% cheaper this week</p>
      <Peelable 
        class="btn-sticker"
        corner="bottom-right"
        peelOnHover={true}
        hoverPeelAmount={0.3}
        borderRadius="0.5rem"
      >
        {#snippet topContent()}
          <div class="sticker-btn">Shop</div>
        {/snippet}
        {#snippet backContent()}
          <div class="sticker-back"></div>
        {/snippet}
        {#snippet bottomContent()}
          <div class="sticker-surface"></div>
        {/snippet}
      </Peelable>
    </div>

    <div class="card">
      <p>New sticker drop! Vote on the best option now!</p>
      <Peelable 
        class="btn-sticker"
        corner="bottom-right"
        peelOnHover={true}
        hoverPeelAmount={0.3}
        borderRadius="0.5rem"
      >
        {#snippet topContent()}
          <div class="sticker-btn">Vote</div>
        {/snippet}
        {#snippet backContent()}
          <div class="sticker-back"></div>
        {/snippet}
        {#snippet bottomContent()}
          <div class="sticker-surface"></div>
        {/snippet}
      </Peelable>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="right-column">
    <div class="right-header">
      <h1><mark>Your collection</mark></h1>
      <div class="button-group">
        <button class="btn-left" onclick={openClaimModal}>Claim stickers</button>
        <button class="btn-right">Place stickers</button>
      </div>
    </div>
    <div class="canvas" style="background-image: url({stickersBg});">
      <div class="empty-overlay">
        <b><u>No stickers placed!</u></b>
      </div>
    </div>
  </div>
</div>

<style>
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
    background: rgba(250, 248, 245, 0.98);
    padding: 2rem;
    border-radius: 0.5rem;
    border: 2px solid #333;
    max-width: 550px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #333;
    padding: 0.25rem 0.5rem;
  }

  .close-btn:hover {
    color: #000;
  }

  .modal-content h1 {
    font-size: 2rem;
    margin: 0 0 1.5rem 0;
  }

  .instructions {
    margin-bottom: 1.5rem;
  }

  .instructions h2 {
    font-size: 1.25rem;
    margin: 0 0 0.75rem 0;
  }

  .instructions p {
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }

  .instructions ul {
    font-size: 1rem;
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;
  }

  .instructions li {
    margin-bottom: 0.25rem;
  }

  .finger-display {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #d9c9b6;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    width: fit-content;
  }

  .finger-count {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
  }

  .finger-label {
    font-size: 1rem;
    color: #555;
  }

  .upload-area {
    border: 3px dashed #999;
    border-radius: 0.5rem;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin-bottom: 1rem;
    background: #fff;
  }

  .upload-area.dragging {
    border-color: #333;
    background: #f0f0f0;
  }

  .upload-area.has-preview {
    border-style: solid;
    border-color: #333;
  }

  .upload-label {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .file-input {
    display: none;
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    color: #666;
  }

  .upload-icon {
    font-size: 2.5rem;
  }

  .upload-text {
    font-size: 1rem;
  }

  .preview-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .preview-image {
    max-width: 100%;
    max-height: 250px;
    object-fit: contain;
    border-radius: 0.25rem;
  }

  .clear-file-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    border: 2px solid #333;
    background: #fff;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-file-btn:hover {
    background: #f0f0f0;
  }

  .submit-btn {
    width: 100%;
    padding: 0.875rem;
    background: #444;
    color: white;
    border: 2px solid #333;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: #555;
  }

  .submit-btn:disabled {
    background: #999;
    cursor: not-allowed;
  }

  .layout {
    display: flex;
    gap: 2rem;
    height: calc(100vh - 120px);
    overflow: hidden;
  }

  .left-column {
    flex: 0 0 500px;
    min-width: 500px;
    overflow-y: auto;
    padding-bottom: 2rem;
  }

  .cards {
    display: flex;
    flex-direction: column;
  }

  .divider {
    width: 2px;
    background: #333;
    flex-shrink: 0;
    margin-bottom: 2rem;
  }

  .right-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding-bottom: 2rem;
  }

  .canvas {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.95);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    border: 2px solid #333;
    border-radius: 0.5rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    position: relative;
  }

  .empty-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    text-align: center;
  }

  .empty-overlay mark {
    background-color: #d9c9b6;
    padding: 0.5rem 1rem;
  }

  .right-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-shrink: 0;
  }

  .right-header h1 {
    margin: 0;
  }

  h1 {
    font-size: 3rem;
    margin: 0 0 2rem 0;
  }

  .card {
    background: rgba(250, 248, 245, 0.95);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 2px solid #333;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }

  :global(.btn-sticker) {
    width: 180px;
    height: 50px;
    cursor: pointer;
  }

  .sticker-btn {
    width: 100%;
    height: 100%;
    background: #444444;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
  }

  .sticker-back {
    width: 100%;
    height: 100%;
    background: #d9c9b6;
    border-radius: 0.5rem;
  }

  .sticker-surface {
    width: 100%;
    height: 100%;
    background: #d1a874;
    border-radius: 0.5rem;
  }

  mark {
    background-color: #d9c9b6;
    padding: 0 0.2rem;
  }

  @media (max-width: 900px) {
    .layout {
      flex-direction: column;
      height: auto;
      overflow: visible;
    }

    .left-column {
      flex: 0 0 auto;
      min-width: 0;
      max-width: 100%;
      overflow-y: visible;
    }

    .right-column {
      padding-bottom: 2rem;
    }

    .divider {
      width: 100%;
      height: 2px;
      margin: 1rem 0;
    }

    .canvas {
      min-height: 50vh;
      height: auto;
    }
  }

  .button-group {
    display: flex;
  }

  .button-group button {
    background: #444;
    color: white;
    border: 2px solid #333;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    cursor: pointer;
    font-family: inherit;
  }

  .button-group button:hover {
    background: #555;
  }

  .btn-left {
    border-radius: 0.5rem 0 0 0.5rem;
    border-right: 1px solid #333;
  }

  .btn-right {
    border-radius: 0 0.5rem 0.5rem 0;
    border-left: 1px solid #333;
  }
</style>
