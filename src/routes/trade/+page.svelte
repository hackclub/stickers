<script>
  const mockTrades = [
    {
      id: 1,
      from: 'LFD',
      get: { name: 'Crow thing', img: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/d2edc2953c00399264ec0c9d93167794a1cb1867_image.png ', quantity: 2 },
      give: { name: 'FlavorTownRed', img: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/80c59fb29dd5a3fbffc1b2297b512ac8cbb719cb_IMG_5304.png', quantity: 1 },
      message: "I have loads of midnight stickers lets trade!"
    },
      {
      id: 1,
      from: 'LFD',
      get: { name: 'Crow thing', img: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/d2edc2953c00399264ec0c9d93167794a1cb1867_image.png ', quantity: 2 },
      give: { name: 'FlavorTownRed', img: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/80c59fb29dd5a3fbffc1b2297b512ac8cbb719cb_IMG_5304.png', quantity: 1 },
      message: "I have loads of midnight stickers lets trade!"
    }
  ];

  let showModal = $state(false);

  function openMakeDeal() {
    showModal = true;
    showModal()
  }

  function closeModal() {
    showModal = false;
  }

if (showModal) {
  document.body.style.overflow = 'hidden';
  alert('test');

} else {
  document.body.style.overflow = 'auto';
}
</script>

<h1><mark>Trade</mark></h1>

<button class="make-deal-btn" onclick={openMakeDeal}>Propose</button>

<h2><div style="font-weight: bold; background-color: #d9c9b6; padding: 0 1rem; font-family: 'Departure Mono', monospace; height: 2rem; width: max-content;">Incoming Trades</div></h2>

<div class="trades-list">
</div>

<style>
  h1 {
    font-size: 3rem;
    margin: 0 0 2rem 0;
  }

  h2 {
    font-size: 1.5rem;
    margin: 2rem 0 1rem 0;
  }

  mark {
    background-color: #d9c9b6;
    padding: 0 0.2rem;
  }

  .make-deal-btn {
    background: #444;
    color: white;
    border: 2px solid #333;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    font-family: inherit;
  }

  .make-deal-btn:hover {
    background: #555;
  }

  .trades-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .trade-row {
    display: flex;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #333;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .trade-box {
    display: flex;
    flex-shrink: 0;
  }

  .trade-side {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .give-side {
    background: #ffebee;
  }

  .get-side {
    background: #e8f5e9;
  }

  .sticker-img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  .quantity {
    font-size: 1.25rem;
    font-weight: bold;
    font-family: 'Departure Mono', monospace;
  }

  .trade-message {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .message-header {
    font-size: 0.9rem;
  }

  .from-user {
    font-weight: bold;
  }

  .message-text {
    margin: 0;
    font-size: 1rem;
    color: #333;
    flex: 1;
  }

  .discuss-btn {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    background: #444;
    color: white;
    border: 2px solid #333;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    font-family: inherit;
  }

  .discuss-btn:hover {
    background: #555;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border: 2px solid #333;
    border-radius: 0.5rem;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
  }

  .modal h2 {
    margin: 0 0 1.5rem 0;
  }

  .modal-content {
    display: flex;
    align-items: stretch;
    gap: 0;
    border: 2px solid #333;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .modal-content .trade-side {
    padding: 1.5rem;
  }

  .modal-content .trade-side label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .modal-content .trade-side select,
  .modal-content .trade-side input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-family: inherit;
    font-size: 1rem;
  }

  .modal-content .trade-side input {
    margin-top: 0.5rem;
    width: 80px;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    justify-content: flex-end;
  }

  .cancel-btn {
    background: #eee;
    color: #333;
    border: 2px solid #333;
    border-radius: 0.5rem;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    cursor: pointer;
    font-family: inherit;
  }

  .submit-btn {
    background: #4caf50;
    color: white;
    border: 2px solid #333;
    border-radius: 0.5rem;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    cursor: pointer;
    font-family: inherit;
  }

  .cancel-btn:hover {
    background: #ddd;
  }

  .submit-btn:hover {
    background: #45a049;
  }
</style>
