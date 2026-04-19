const BOT_TOKEN = '8559711885:AAE4vRXIKYa58h4NQzwuiI-m_58b1ui5gBk';
const CHANNEL_ID = '-100ВСТАВЬТЕ_ID';

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === '/webhook' && request.method === 'POST') {
    const update = await request.json();
    if (update.message && update.message.web_app_data) {
      const orderText = update.message.web_app_data.data;
      const user = update.message.from;
      const userLine = '\n👤 От: ' + (user.first_name || '') + (user.last_name ? ' ' + user.last_name : '') + (user.username ? ' (@' + user.username + ')' : '');
      await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHANNEL_ID, text: orderText + userLine })
      });
    }
    return new Response('ok');
  }

  return new Response(HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' }
  });
}

export default { fetch: handleRequest };

const HTML = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Victoria's Secret</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://telegram.org/js/telegram-web-app.js"><\/script>
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; -webkit-tap-highlight-color: transparent; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        button { font-family: inherit; border: none; background: none; cursor: pointer; color: inherit; }
        input { font-family: inherit; border: none; outline: none; background: none; }
        img { display: block; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        :root { --bg: #FDF6F8; --bg-warm: #FAEDF1; --card: #FFFFFF; --text: #1C1917; --text-sec: #8A7E7F; --text-tri: #C4B8BA; --accent: #C4957A; --accent-h: #B5846B; --accent-l: #F8E4EC; --accent-t: #FFFFFF; --border: #EDE2E5; --danger: #D45D5D; --danger-l: #FDEAEA; --success: #6B9E6F; --fav-color: #E25555; --r-s: 8px; --r-m: 14px; --r-l: 20px; --safe-t: env(safe-area-inset-top, 0px); --safe-b: env(safe-area-inset-bottom, 0px); --header-h: 56px; --filter-h: 52px; }
        .app-header { position: fixed; top: 0; left: 0; right: 0; z-index: 110; height: calc(var(--header-h) + var(--safe-t)); padding-top: var(--safe-t); background: rgba(253,246,248,0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding-left: 20px; padding-right: 16px; }
        .logo { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; }
        .header-actions { display: flex; gap: 2px; align-items: center; }
        .header-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; position: relative; transition: background 0.2s; }
        .header-btn:active { background: var(--accent-l); }
        .header-btn.sort-active { color: var(--accent); }
        .header-btn.sort-active::after { content: ''; position: absolute; bottom: 5px; right: 5px; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
        .cart-badge { position: absolute; top: 1px; right: 1px; min-width: 18px; height: 18px; border-radius: 9px; background: var(--accent); color: var(--accent-t); font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; padding: 0 5px; transform: scale(0); transition: transform 0.25s cubic-bezier(0.175,0.885,0.32,1.275); }
        .cart-badge.visible { transform: scale(1); }
        .cart-badge.bounce { animation: badgeBounce 0.3s ease; }
        @keyframes badgeBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
        .search-bar { position: fixed; top: calc(var(--header-h) + var(--safe-t)); left: 0; right: 0; z-index: 105; background: var(--bg); border-bottom: 1px solid var(--border); padding: 10px 20px; display: flex; align-items: center; gap: 10px; height: 58px; transform: translateY(-110%); opacity: 0; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.25s; pointer-events: none; }
        .search-bar.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
        .search-bar input { flex: 1; height: 40px; padding: 0 16px; background: var(--card); border: 1px solid var(--border); border-radius: var(--r-s); font-size: 15px; color: var(--text); }
        .search-bar input::placeholder { color: var(--text-tri); }
        .search-close-btn { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .search-close-btn:active { background: var(--bg-warm); }
        .filter-bar { position: fixed; top: calc(var(--header-h) + var(--safe-t)); left: 0; right: 0; z-index: 100; background: var(--bg); height: var(--filter-h); padding: 10px 0 8px; display: flex; align-items: center; gap: 0; transition: top 0.3s cubic-bezier(0.4,0,0.2,1); }
        .filter-bar.shifted-down { top: calc(var(--header-h) + var(--safe-t) + 58px); }
        .filter-scroll { display: flex; gap: 8px; padding: 0 0 0 20px; overflow-x: auto; -webkit-overflow-scrolling: touch; flex: 1; min-width: 0; -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%); mask-image: linear-gradient(to right, black 80%, transparent 100%); }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .cat-chip { flex-shrink: 0; padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 500; border: 1px solid var(--border); background: var(--card); color: var(--text-sec); transition: all 0.2s; white-space: nowrap; }
        .cat-chip:active { transform: scale(0.96); }
        .cat-chip.active { background: var(--text); color: var(--accent-t); border-color: var(--text); }
        #favStickyChip { flex-shrink: 0; margin-right: 16px; display: inline-flex; align-items: center; gap: 5px; position: relative; }
        #favStickyChip i { font-size: 12px; }
        #favStickyChip.active i { color: #F8C8CC; }
        .fav-chip-badge { background: var(--fav-color); color: #fff; font-size: 9px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 8px; display: none; align-items: center; justify-content: center; padding: 0 4px; margin-left: 2px; }
        .fav-chip-badge.visible { display: inline-flex; }
        .main-content { padding-top: calc(var(--header-h) + var(--safe-t) + var(--filter-h)); padding-bottom: calc(var(--safe-b) + 24px); min-height: 100vh; }
        .product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 14px 16px; }
        @media (min-width:600px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; padding: 18px 24px; } }
        @media (min-width:900px) { .product-grid { grid-template-columns: repeat(4, 1fr); max-width: 920px; margin: 0 auto; } }
        .product-card { background: var(--card); border-radius: var(--r-m); overflow: hidden; box-shadow: 0 1px 8px rgba(28,25,23,0.04); cursor: pointer; opacity: 0; animation: cardIn 0.4s ease forwards; transition: transform 0.25s, box-shadow 0.25s; }
        .product-card:active { transform: scale(0.97) !important; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .card-img-wrap { width: 100%; aspect-ratio: 3/4; background: var(--bg-warm); position: relative; overflow: hidden; }
        .card-img-wrap::before { content: ''; position: absolute; inset: 0; background: var(--bg-warm); filter: blur(20px); transform: scale(1.2); z-index: 1; transition: opacity 0.6s; }
        .card-img-wrap.loaded::before { opacity: 0; pointer-events: none; }
        .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 2; opacity: 0; transition: opacity 0.6s ease; }
        .card-img-wrap.loaded img { opacity: 1; }
        .card-badge { position: absolute; top: 10px; left: 10px; z-index: 5; padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .card-badge.type-new { background: var(--card); color: var(--accent); box-shadow: 0 1px 6px rgba(0,0,0,0.06); }
        .card-badge.type-hit { background: var(--accent); color: var(--accent-t); }
        .card-badge.type-pre { background: #E8E0F0; color: #7B6B8D; }
        .card-fav-btn { position: absolute; top: 10px; right: 10px; z-index: 5; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--text-tri); transition: all 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .card-fav-btn:active { transform: scale(0.85); }
        .card-fav-btn.is-fav { color: var(--fav-color); }
        .card-fav-btn.is-fav i { font-weight: 900; }
        .card-add-btn { position: absolute; bottom: 10px; right: 10px; z-index: 5; min-width: 36px; height: 36px; border-radius: 50%; background: var(--card); box-shadow: 0 2px 12px rgba(28,25,23,0.1); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: var(--text); border: 1px solid var(--border); transition: all 0.2s; padding: 0 2px; }
        .card-add-btn:active { transform: scale(0.85); }
        .card-add-btn.in-cart { background: var(--accent); color: var(--accent-t); border-color: var(--accent); box-shadow: 0 4px 16px rgba(196,149,122,0.35); }
        @keyframes btnPop { 0%{transform:scale(1)} 50%{transform:scale(1.25)} 100%{transform:scale(1)} }
        .card-add-btn.pop-anim { animation: btnPop 0.25s ease; }
        .card-share-btn { position: absolute; bottom: 10px; left: 10px; z-index: 5; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--text-tri); transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .card-share-btn:active { transform: scale(0.85); color: var(--accent); }
        .card-info { padding: 12px 14px 14px; }
        .card-name { font-family: 'Playfair Display', serif; font-size: 13.5px; font-weight: 500; line-height: 1.35; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-price { font-size: 14.5px; font-weight: 600; color: var(--accent); }
        .card-price.is-preorder { font-size: 12.5px; font-weight: 500; color: #7B6B8D; font-style: italic; }
        .fly-dot { position: fixed; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); z-index: 9999; pointer-events: none; box-shadow: 0 0 12px rgba(196,149,122,0.5); transition: left 0.45s cubic-bezier(0.22,0.61,0.36,1), top 0.45s cubic-bezier(0.22,0.61,0.36,1), transform 0.45s cubic-bezier(0.22,0.61,0.36,1), opacity 0.35s; }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 40px; text-align: center; }
        .empty-icon { width: 80px; height: 80px; border-radius: 50%; background: var(--accent-l); display: flex; align-items: center; justify-content: center; font-size: 28px; color: var(--accent); margin-bottom: 24px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 500; margin-bottom: 8px; }
        .empty-desc { font-size: 14px; color: var(--text-sec); line-height: 1.5; max-width: 260px; }
        .contact-link { display: flex; justify-content: center; padding: 16px 0 4px; }
        .contact-link button { font-size: 13px; color: var(--text-sec); display: flex; align-items: center; gap: 7px; padding: 8px 18px; border-radius: 100px; transition: all 0.2s; }
        .contact-link button:active { color: var(--accent); background: var(--accent-l); }
        .overlay-backdrop { position: fixed; inset: 0; z-index: 190; background: rgba(28,25,23,0.25); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .overlay-backdrop.open { opacity: 1; pointer-events: auto; }
        .overlay-panel { position: fixed; inset: 0; z-index: 200; background: var(--bg); transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.32,0.72,0,1); display: flex; flex-direction: column; }
        .overlay-panel.open { transform: translateX(0); }
        .panel-scroll-area { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
        .panel-nav { flex-shrink: 0; height: calc(52px + var(--safe-t)); padding-top: var(--safe-t); display: flex; align-items: center; padding-left: 8px; padding-right: 16px; background: rgba(253,246,248,0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .panel-nav .back-btn { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: background 0.2s; }
        .panel-nav .close-btn { margin-left: auto; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--text-sec); transition: background 0.2s; }
        .panel-nav .back-btn:active, .panel-nav .close-btn:active { background: var(--accent-l); }
        .detail-hero-img { width: 100%; aspect-ratio: 3/4; max-height: 55vh; object-fit: cover; background: var(--bg-warm); display: block; }
        .detail-body { padding: 24px 22px 32px; }
        .detail-cat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-tri); margin-bottom: 8px; }
        .detail-product-name { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; line-height: 1.3; margin-bottom: 12px; }
        .detail-product-price { font-size: 22px; font-weight: 600; color: var(--accent); margin-bottom: 20px; }
        .detail-product-price.is-preorder { font-size: 16px; font-weight: 500; color: #7B6B8D; font-style: italic; }
        .detail-product-desc { font-size: 14.5px; line-height: 1.7; color: var(--text-sec); }
        .detail-sticky-bar { flex-shrink: 0; padding: 16px 22px calc(16px + var(--safe-b)); background: linear-gradient(to top, var(--bg) 60%, transparent); }
        .detail-sticky-bar button { width: 100%; height: 54px; border-radius: var(--r-m); background: var(--text); color: var(--accent-t); font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background 0.2s, transform 0.15s; }
        .detail-sticky-bar button:active { transform: scale(0.98); background: var(--accent); }
        .detail-sticky-bar button.is-added { background: var(--success); }
        .cart-nav-title { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 600; margin-left: 8px; }
        .cart-nav-count { font-size: 14px; color: var(--text-sec); margin-left: 6px; font-weight: 400; }
        .cart-items-list { padding: 8px 16px; }
        .cart-item { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); animation: cartItemIn 0.3s ease both; }
        @keyframes cartItemIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .cart-item-img { width: 76px; height: 96px; border-radius: var(--r-s); overflow: hidden; flex-shrink: 0; background: var(--bg-warm); }
        .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .cart-item-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
        .cart-item-name { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 500; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cart-item-row { display: flex; align-items: center; justify-content: space-between; }
        .cart-item-price { font-size: 14.5px; font-weight: 600; color: var(--accent); }
        .qty-controls { display: flex; align-items: center; }
        .qty-btn { width: 30px; height: 30px; border-radius: var(--r-s); display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--text); border: 1px solid var(--border); transition: all 0.15s; }
        .qty-btn:active { background: var(--accent-l); border-color: var(--accent); }
        .qty-value { width: 32px; text-align: center; font-size: 14px; font-weight: 600; }
        .cart-item-del { align-self: flex-start; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--text-tri); flex-shrink: 0; transition: color 0.2s; }
        .cart-item-del:active { color: var(--danger); }
        .cart-footer-bar { position: sticky; bottom: 0; z-index: 10; background: var(--bg); border-top: 1px solid var(--border); padding: 14px 20px calc(14px + var(--safe-b)); }
        .cart-delivery-note { font-size: 12px; color: var(--text-sec); text-align: center; margin-bottom: 12px; line-height: 1.4; font-style: italic; }
        .cart-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
        .cart-total-label { font-size: 15px; }
        .cart-total-value { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; }
        .checkout-open-btn { width: 100%; height: 52px; border-radius: var(--r-m); background: var(--text); color: var(--accent-t); font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, transform 0.15s; }
        .checkout-open-btn:active { transform: scale(0.98); background: var(--accent); }
        .checkout-modal { position: fixed; inset: 0; z-index: 300; display: flex; align-items: flex-end; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .checkout-modal.open { opacity: 1; pointer-events: auto; }
        .checkout-modal-bg { position: absolute; inset: 0; background: rgba(28,25,23,0.3); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
        .checkout-sheet { position: relative; z-index: 1; width: 100%; max-width: 500px; background: var(--card); border-radius: var(--r-l) var(--r-l) 0 0; padding: 12px 24px calc(24px + var(--safe-b)); transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32,0.72,0,1); max-height: 80vh; overflow-y: auto; }
        .checkout-modal.open .checkout-sheet { transform: translateY(0); }
        .sheet-handle { width: 36px; height: 4px; border-radius: 2px; background: var(--border); margin: 0 auto 20px; }
        .sheet-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-sec); margin-bottom: 8px; }
        .form-input { width: 100%; height: 48px; padding: 0 16px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--r-s); font-size: 15px; color: var(--text); transition: border-color 0.2s; }
        .form-input:focus { border-color: var(--accent); }
        .form-input.has-error { border-color: var(--danger); background: var(--danger-l); }
        .form-error-msg { font-size: 12px; color: var(--danger); margin-top: 6px; display: none; }
        .form-error-msg.visible { display: block; }
        .form-delivery-notice { font-size: 12.5px; color: var(--text-sec); text-align: center; line-height: 1.5; padding: 14px; background: var(--accent-l); border-radius: var(--r-s); margin-bottom: 20px; font-style: italic; }
        .submit-order-btn { width: 100%; height: 52px; border-radius: var(--r-m); background: var(--accent); color: var(--accent-t); font-size: 15px; font-weight: 600; transition: background 0.2s, transform 0.15s; }
        .submit-order-btn:active { transform: scale(0.98); background: var(--accent-h); }
        .success-overlay { position: fixed; inset: 0; z-index: 400; background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; opacity: 0; pointer-events: none; transition: opacity 0.4s; }
        .success-overlay.open { opacity: 1; pointer-events: auto; }
        .success-check-wrap { width: 88px; height: 88px; margin-bottom: 28px; }
        .success-check-wrap svg { width: 88px; height: 88px; transform: scale(0); transition: transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.15s; }
        .success-overlay.open .success-check-wrap svg { transform: scale(1); }
        .success-svg-circle { fill: none; stroke: var(--success); stroke-width: 2.5; stroke-dasharray: 264; stroke-dashoffset: 264; transition: stroke-dashoffset 0.6s ease 0.25s; }
        .success-overlay.open .success-svg-circle { stroke-dashoffset: 0; }
        .success-svg-check { fill: none; stroke: var(--success); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 40; stroke-dashoffset: 40; transition: stroke-dashoffset 0.4s ease 0.65s; }
        .success-overlay.open .success-svg-check { stroke-dashoffset: 0; }
        .success-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 10px; opacity: 0; transform: translateY(12px); transition: all 0.4s ease 0.75s; }
        .success-overlay.open .success-title { opacity: 1; transform: translateY(0); }
        .success-desc { font-size: 14.5px; color: var(--text-sec); text-align: center; line-height: 1.6; max-width: 280px; margin-bottom: 28px; opacity: 0; transform: translateY(12px); transition: all 0.4s ease 0.9s; }
        .success-overlay.open .success-desc { opacity: 1; transform: translateY(0); }
        .success-actions { display: flex; flex-direction: column; gap: 10px; align-items: center; opacity: 0; transform: translateY(12px); transition: all 0.4s ease 1.05s; }
        .success-overlay.open .success-actions { opacity: 1; transform: translateY(0); }
        .success-primary-btn { padding: 14px 40px; border-radius: var(--r-m); background: var(--text); color: var(--accent-t); font-size: 15px; font-weight: 600; transition: background 0.2s; }
        .success-primary-btn:active { background: var(--accent); }
        .success-secondary-btn { padding: 12px 28px; border-radius: var(--r-m); font-size: 14px; font-weight: 500; color: var(--accent); display: flex; align-items: center; gap: 8px; transition: background 0.2s; }
        .success-secondary-btn:active { background: var(--accent-l); }
        .toast-element { position: fixed; bottom: calc(24px + var(--safe-b)); left: 50%; transform: translateX(-50%) translateY(16px); z-index: 5000; padding: 10px 22px; border-radius: 100px; background: var(--text); color: var(--accent-t); font-size: 13px; font-weight: 500; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.25s, transform 0.25s; box-shadow: 0 6px 24px rgba(28,25,23,0.15); }
        .toast-element.visible { opacity: 1; transform: translateX(-50%) translateY(0); }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
    </style>
</head>
<body>
    <header class="app-header" id="appHeader">
        <div class="logo">VICTORIA'S SECRET</div>
        <div class="header-actions">
            <button class="header-btn" id="sortBtn" aria-label="Сортировка по цене"><i class="fas fa-arrow-down-short-wide"></i></button>
            <button class="header-btn" id="searchBtn" aria-label="Поиск"><i class="fas fa-search"></i></button>
            <button class="header-btn" id="cartBtn" aria-label="Корзина"><i class="fas fa-shopping-bag"></i><span class="cart-badge" id="cartBadge">0</span></button>
        </div>
    </header>
    <div class="search-bar" id="searchBar">
        <input type="text" id="searchInput" placeholder="Поиск товаров..." autocomplete="off">
        <button class="search-close-btn" id="searchCloseBtn" aria-label="Закрыть поиск"><i class="fas fa-times"></i></button>
    </div>
    <div class="filter-bar" id="filterBar">
        <div class="filter-scroll" id="filterScroll"></div>
        <button class="cat-chip" id="favStickyChip" aria-label="Избранное"><i class="far fa-heart"></i> Избранное<span class="fav-chip-badge" id="favChipBadge">0</span></button>
    </div>
    <main class="main-content" id="mainContent"></main>
    <div class="overlay-backdrop" id="overlayBackdrop"></div>
    <div class="overlay-panel" id="detailPanel" role="dialog" aria-label="Детали товара">
        <div class="panel-nav"><button class="back-btn" id="detailBackBtn" aria-label="Назад"><i class="fas fa-arrow-left"></i></button><button class="close-btn" id="detailCloseBtn" aria-label="Закрыть"><i class="fas fa-times"></i></button></div>
        <div class="panel-scroll-area" id="detailScrollArea">
            <img class="detail-hero-img" id="detailImg" src="" alt="">
            <div class="detail-body">
                <div class="detail-cat-label" id="detailCatLabel"></div>
                <h1 class="detail-product-name" id="detailName"></h1>
                <div class="detail-product-price" id="detailPrice"></div>
                <p class="detail-product-desc" id="detailDesc"></p>
            </div>
        </div>
        <div class="detail-sticky-bar"><button id="detailAddBtn"><i class="fas fa-shopping-bag"></i> Добавить в корзину</button></div>
    </div>
    <div class="overlay-panel" id="cartPanel" role="dialog" aria-label="Корзина">
        <div class="panel-nav" style="border-bottom: 1px solid var(--border);"><button class="back-btn" id="cartBackBtn" aria-label="Назад"><i class="fas fa-arrow-left"></i></button><span class="cart-nav-title">Корзина</span><span class="cart-nav-count" id="cartNavCount"></span></div>
        <div class="panel-scroll-area" id="cartContentArea"></div>
    </div>
    <div class="checkout-modal" id="checkoutModal" role="dialog" aria-label="Оформление заказа">
        <div class="checkout-modal-bg" id="checkoutModalBg"></div>
        <div class="checkout-sheet">
            <div class="sheet-handle"></div>
            <h2 class="sheet-title">Оформление заказа</h2>
            <div class="form-group"><label class="form-label" for="nameInput">Ваше имя</label><input class="form-input" type="text" id="nameInput" placeholder="Введите имя" autocomplete="name"><div class="form-error-msg" id="nameError">Пожалуйста, введите ваше имя</div></div>
            <div class="form-group"><label class="form-label" for="tgInput">Ваш Telegram</label><input class="form-input" type="text" id="tgInput" placeholder="@username" autocomplete="off"><div class="form-error-msg" id="tgError">Пожалуйста, укажите ваш Telegram</div></div>
            <div class="form-delivery-notice">Доставка оплачивается отдельно клиентом</div>
            <button class="submit-order-btn" id="submitOrderBtn">Отправить заказ</button>
        </div>
    </div>
    <div class="success-overlay" id="successOverlay">
        <div class="success-check-wrap"><svg viewBox="0 0 88 88"><circle class="success-svg-circle" cx="44" cy="44" r="42"/><polyline class="success-svg-check" points="28,46 40,58 62,32"/></svg></div>
        <h2 class="success-title">Заказ оформлен</h2>
        <p class="success-desc">Ваш заказ отправлен продавцу. Мы свяжемся с вами для подтверждения.</p>
        <div class="success-actions">
            <button class="success-primary-btn" id="successBackBtn">Вернуться в каталог</button>
            <button class="success-secondary-btn" id="successChatBtn"><i class="fab fa-telegram-plane"></i> Написать продавцу</button>
        </div>
    </div>
    <div class="toast-element" id="toastElement"></div>
    <script>
    var CHANNEL_LINK = "https://t.me/victorias_secret_shopby";
    var DIRECT_CHAT_LINK = "https://t.me/victorias_secret_shopby?direct";
    var APP_BASE_URL = "https://t.me/VSecret_shop_bot/VSecret_shop";
    var products = [
        { id:1, name:"Сумка Victoria Tote", price:145, image:"https://picsum.photos/seed/vs-bag1/800/1067", category:"bags", shortDescription:"Практичная сумка на каждый день", fullDescription:"Стильная и вместительная сумка Victoria's Secret из качественной эко-кожи. Идеально подходит для повседневного использования.", badge:"new", available:true },
        { id:2, name:"Сумка через плечо Very Sexy", price:125, image:"https://picsum.photos/seed/vs-bag2/800/1067", category:"bags", shortDescription:"Элегантная сумка через плечо", fullDescription:"Компактная и утончённая сумка через плечо из коллекции Very Sexy.", badge:undefined, available:true },
        { id:3, name:"Мини-сумка Pink Collection", price:105, image:"https://picsum.photos/seed/vs-bag3/800/1067", category:"bags", shortDescription:"Миниатюрная сумка с логотипом Pink", fullDescription:"Очаровательная мини-сумка из коллекции Pink.", badge:undefined, available:true },
        { id:4, name:"Парфюм Bombshell EDP 50ml", price:180, image:"https://picsum.photos/seed/vs-per1/800/1067", category:"perfume", shortDescription:"Иконический аромат с нотами пиона", fullDescription:"Легендарный аромат Bombshell — бестселлер Victoria's Secret.", badge:"hit", available:true },
        { id:5, name:"Парфюм Tease EDP 50ml", price:165, image:"https://picsum.photos/seed/vs-per2/800/1067", category:"perfume", shortDescription:"Соблазнительный аромат с нотами гуавы", fullDescription:"Tease — чувственный и утончённый аромат.", badge:undefined, available:true },
        { id:6, name:"Бодимист Love Spell 250ml", price:82, image:"https://picsum.photos/seed/vs-per3/800/1067", category:"perfume", shortDescription:"Лёгкий бодимист с ароматом вишни", fullDescription:"Love Spell — один из самых любимых бодимистов Victoria's Secret.", badge:undefined, available:false },
        { id:7, name:"Подарочный набор Bombshell", price:275, image:"https://picsum.photos/seed/vs-set1/800/1067", category:"sets", shortDescription:"Полный набор с ароматом Bombshell", fullDescription:"Роскошный подарочный набор Victoria's Secret.", badge:"new", available:true },
        { id:8, name:"Подарочный набор Tease", price:245, image:"https://picsum.photos/seed/vs-set2/800/1067", category:"sets", shortDescription:"Соблазнительный набор для ухода", fullDescription:"Подарочный набор с ароматом Tease.", badge:undefined, available:true },
        { id:9, name:"Набор по уходу Pink", price:145, image:"https://picsum.photos/seed/vs-set3/800/1067", category:"sets", shortDescription:"Набор для ухода с ароматом Pink", fullDescription:"Бодрящий набор для ежедневного ухода из коллекции Pink.", badge:undefined, available:false },
        { id:10, name:"Кошелёк Victoria Large", price:92, image:"https://picsum.photos/seed/vs-wal1/800/1067", category:"wallets", shortDescription:"Просторный кошелёк на молнии", fullDescription:"Просторный женский кошелёк Victoria's Secret на молнии.", badge:undefined, available:true },
        { id:11, name:"Кардхолдер Very Sexy", price:58, image:"https://picsum.photos/seed/vs-wal2/800/1067", category:"wallets", shortDescription:"Компактный кардхолдер на 6 карт", fullDescription:"Минималистичный кардхолдер из коллекции Very Sexy.", badge:undefined, available:true },
        { id:12, name:"Клатч-кошелёк Pink", price:72, image:"https://picsum.photos/seed/vs-wal3/800/1067", category:"wallets", shortDescription:"Клатч с отделением для телефона", fullDescription:"Стильный клатч-кошелёк из коллекции Pink.", badge:undefined, available:false },
        { id:13, name:"Бралет Body by VS", price:98, image:"https://picsum.photos/seed/vs-lin1/800/1067", category:"lingerie", shortDescription:"Мягкий бралет без косточек", fullDescription:"Нежный бралет из коллекции Body by Victoria's Secret.", badge:undefined, available:true },
        { id:14, name:"Бюстгальтер Dream Angels", price:115, image:"https://picsum.photos/seed/vs-lin2/800/1067", category:"lingerie", shortDescription:"Бра с лёгкой поддержкой", fullDescription:"Бюстгальтер Dream Angels — сочетание красоты и комфорта.", badge:"hit", available:true },
        { id:15, name:"Комплект белья Very Sexy", price:158, image:"https://picsum.photos/seed/vs-lin3/800/1067", category:"lingerie", shortDescription:"Элегантный комплект из двух предметов", fullDescription:"Роскошный комплект белья из коллекции Very Sexy.", badge:undefined, available:true },
        { id:16, name:"Пижама Love Cloud", price:135, image:"https://picsum.photos/seed/vs-paj1/800/1067", category:"pajamas", shortDescription:"Мягкая пижама из микрофибры", fullDescription:"Нежная пижама Love Cloud из сверхмягкой микрофибры.", badge:"new", available:true },
        { id:17, name:"Пижама Pink Sweet Dreams", price:118, image:"https://picsum.photos/seed/vs-paj2/800/1067", category:"pajamas", shortDescription:"Короткая пижама с принтом Pink", fullDescription:"Стильная короткая пижама из коллекции Pink.", badge:undefined, available:true },
        { id:18, name:"Пижама Dream Angels", price:155, image:"https://picsum.photos/seed/vs-paj3/800/1067", category:"pajamas", shortDescription:"Шёлковая пижама с кружевом", fullDescription:"Роскошная пижама Dream Angels из шелковистой ткани.", badge:undefined, available:false }
    ];
    var categoryDefs = [{ key:"all", label:"Все" },{ key:"bags", label:"Сумки" },{ key:"perfume", label:"Духи" },{ key:"sets", label:"Наборы" },{ key:"wallets", label:"Кошельки" },{ key:"lingerie", label:"Бельё" },{ key:"pajamas", label:"Пижамы" }];
    var categoryLabels = { bags:"Сумки", perfume:"Духи", sets:"Наборы", wallets:"Кошельки", lingerie:"Бельё", pajamas:"Пижамы" };
    var state = { currentView:"catalog", selectedCategory:"all", sortMode:"none", searchQuery:"", selectedProduct:null, cart:[], favorites:[], isSearchOpen:false };
    var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
    if (tg) { tg.ready(); tg.expand(); try { tg.setHeaderColor("#FDF6F8"); tg.setBackgroundColor("#FDF6F8"); } catch(e){} tg.BackButton.onClick(function(){ navigateBack(); }); }
    function updateTelegramBackButton(){ if(!tg||!tg.BackButton)return; if(state.currentView!=="catalog") tg.BackButton.show(); else tg.BackButton.hide(); }
    function saveToStorage(k,d){ try{localStorage.setItem("vs_"+k,JSON.stringify(d));}catch(e){} }
    function loadFromStorage(k){ try{var r=localStorage.getItem("vs_"+k);return r?JSON.parse(r):null;}catch(e){return null;} }
    function formatPrice(a){ return a.toLocaleString("ru-RU")+" Br"; }
    function getCartTotal(){ return state.cart.reduce(function(s,i){return s+i.product.price*i.quantity;},0); }
    function getCartItemCount(){ return state.cart.reduce(function(s,i){return s+i.quantity;},0); }
    function isFavorite(id){ return state.favorites.indexOf(id)>-1; }
    function findCartItem(id){ return state.cart.find(function(i){return i.product.id===id;}); }
    function findProduct(id){ return products.find(function(p){return p.id===id;}); }
    function openChannelChat(){ if(tg&&tg.openTelegramLink) tg.openTelegramLink(DIRECT_CHAT_LINK); else window.open(DIRECT_CHAT_LINK,"_blank"); }
    function getProductDeepLink(id){ return APP_BASE_URL+"?startapp=product_"+id; }
    var toastTimer=null;
    function showToast(m){ var el=document.getElementById("toastElement"); el.textContent=m; el.classList.add("visible"); clearTimeout(toastTimer); toastTimer=setTimeout(function(){el.classList.remove("visible");},1800); }
    function updateCartBadge(){ var b=document.getElementById("cartBadge"); var c=getCartItemCount(); b.textContent=c; if(c>0){b.classList.add("visible");b.classList.remove("bounce");void b.offsetWidth;b.classList.add("bounce");}else{b.classList.remove("visible");} }
    function animateFlyToCart(f){ var fr=f.getBoundingClientRect(); var te=document.getElementById("cartBadge"); var tr=te.getBoundingClientRect(); var d=document.createElement("div"); d.className="fly-dot"; d.style.left=(fr.left+fr.width/2-7)+"px"; d.style.top=(fr.top+fr.height/2-7)+"px"; document.body.appendChild(d); requestAnimationFrame(function(){requestAnimationFrame(function(){d.style.left=(tr.left+tr.width/2-7)+"px";d.style.top=(tr.top+tr.height/2-7)+"px";d.style.transform="scale(0.3)";d.style.opacity="0.2";});}); setTimeout(function(){d.remove();},500); }
    function renderFilterBar(){ var s=document.getElementById("filterScroll"); var h=""; for(var i=0;i<categoryDefs.length;i++){var c=categoryDefs[i];var a=state.selectedCategory===c.key?" active":"";h+='<button class="cat-chip'+a+'" data-category="'+c.key+'">'+c.label+'</button>';} s.innerHTML=h; var ch=s.querySelectorAll(".cat-chip"); for(var j=0;j<ch.length;j++){ch[j].addEventListener("click",function(){state.selectedCategory=this.getAttribute("data-category");renderFilterBar();updateFavStickyChip();renderCatalog();});} }
    function updateFavStickyChip(){ var chip=document.getElementById("favStickyChip");var badge=document.getElementById("favChipBadge");var count=state.favorites.length;var isActive=state.selectedCategory==="fav"; if(isActive)chip.classList.add("active");else chip.classList.remove("active"); badge.textContent=count;if(count>0)badge.classList.add("visible");else badge.classList.remove("visible"); var icon=chip.querySelector("i"); if(icon){if(isActive)icon.className="fas fa-heart";else if(count>0)icon.className="fas fa-heart";else icon.className="far fa-heart";} }
    function getFilteredProducts(){ var l=products.slice(); if(state.selectedCategory==="fav")l=l.filter(function(p){return state.favorites.indexOf(p.id)>-1;}); else if(state.selectedCategory!=="all")l=l.filter(function(p){return p.category===state.selectedCategory;}); if(state.searchQuery.trim()){var q=state.searchQuery.toLowerCase().trim();l=l.filter(function(p){return p.name.toLowerCase().indexOf(q)>-1||p.shortDescription.toLowerCase().indexOf(q)>-1||(categoryLabels[p.category]||"").toLowerCase().indexOf(q)>-1;});} if(state.sortMode==="asc")l.sort(function(a,b){return a.price-b.price;}); else if(state.sortMode==="desc")l.sort(function(a,b){return b.price-a.price;}); return l; }
    function renderCatalog(){ var f=getFilteredProducts();var m=document.getElementById("mainContent"); if(f.length===0){var isF=state.selectedCategory==="fav";var isS=state.searchQuery.trim().length>0;m.innerHTML='<div class="empty-state"><div class="empty-icon"><i class="fas '+(isF?'fa-heart':isS?'fa-search':'fa-shopping-bag')+'"></i></div><h2 class="empty-title">'+(isF?'Пока ничего не избранно':isS?'Ничего не найдено':'Товаров пока нет')+'</h2><p class="empty-desc">'+(isF?'Нажмите на сердечко у товара':isS?'Попробуйте изменить запрос':'В данной категории товаров нет')+'</p></div>';return;} var h='<div class="product-grid">'; for(var i=0;i<f.length;i++){var p=f[i];var bh='';if(!p.available)bh='<span class="card-badge type-pre">Под заказ</span>';else if(p.badge==="new")bh='<span class="card-badge type-new">Новинка</span>';else if(p.badge==="hit")bh='<span class="card-badge type-hit">Хит</span>'; var fc=isFavorite(p.id)?' is-fav':'';var fi=isFavorite(p.id)?'fas':'far'; var ci=findCartItem(p.id);var ac=ci?' in-cart':'';var cc=ci?ci.quantity:'<i class="fas fa-plus"></i>'; var ph=p.available?'<div class="card-price">'+formatPrice(p.price)+'</div>':'<div class="card-price is-preorder">Под заказ</div>'; h+='<article class="product-card" data-product-id="'+p.id+'" style="animation-delay:'+(i*0.05)+'s" tabindex="0"><div class="card-img-wrap"><img src="'+p.image+'" alt="'+p.name+'" loading="lazy" onload="this.parentElement.classList.add(\'loaded\')">'+bh+'<button class="card-fav-btn'+fc+'" data-fav-id="'+p.id+'"><i class="'+fi+' fa-heart"></i></button><button class="card-add-btn'+ac+'" data-add-id="'+p.id+'">'+cc+'</button><button class="card-share-btn" data-share-id="'+p.id+'"><i class="fas fa-share-alt"></i></button></div><div class="card-info"><div class="card-name">'+p.name+'</div>'+ph+'</div></article>';} h+='</div><div class="contact-link"><button id="contactLinkBtn"><i class="fab fa-telegram-plane"></i> Написать нам</button></div>'; m.innerHTML=h; var cards=m.querySelectorAll(".product-card"); for(var c=0;c<cards.length;c++){(function(card){var handler=function(){var id=parseInt(card.getAttribute("data-product-id"));var pr=findProduct(id);if(pr)openProductDetail(pr);}; card.addEventListener("click",function(e){if(e.target.closest(".card-fav-btn")||e.target.closest(".card-add-btn")||e.target.closest(".card-share-btn"))return;handler();}); card.addEventListener("keydown",function(e){if(e.key==="Enter")handler();});})(cards[c]);} var fb=m.querySelectorAll(".card-fav-btn"); for(var fv=0;fv<fb.length;fv++){(function(btn){btn.addEventListener("click",function(e){e.stopPropagation();toggleFavorite(parseInt(btn.getAttribute("data-fav-id")));});})(fb[fv]);} var ab=m.querySelectorAll(".card-add-btn"); for(var aa=0;aa<ab.length;aa++){(function(btn){btn.addEventListener("click",function(e){e.stopPropagation();addToCartFromCard(parseInt(btn.getAttribute("data-add-id")),btn);});})(ab[aa]);} var sb=m.querySelectorAll(".card-share-btn"); for(var ss=0;ss<sb.length;ss++){(function(btn){btn.addEventListener("click",function(e){e.stopPropagation();shareProduct(parseInt(btn.getAttribute("data-share-id")));});})(sb[ss]);} var clb=m.querySelector("#contactLinkBtn");if(clb)clb.addEventListener("click",openChannelChat); }
    function toggleFavorite(id){ var idx=state.favorites.indexOf(id); if(idx>-1){state.favorites.splice(idx,1);showToast("Удалено из избранного");}else{state.favorites.push(id);showToast("Добавлено в избранное");} saveToStorage("favorites",state.favorites);updateFavButtonsOnCards();updateFavStickyChip();if(state.selectedCategory==="fav")renderCatalog(); }
    function updateFavButtonsOnCards(){ var b=document.querySelectorAll(".card-fav-btn"); for(var i=0;i<b.length;i++){var id=parseInt(b[i].getAttribute("data-fav-id")); if(isFavorite(id)){b[i].classList.add("is-fav");b[i].innerHTML='<i class="fas fa-heart"></i>';}else{b[i].classList.remove("is-fav");b[i].innerHTML='<i class="far fa-heart"></i>';}} }
    function shareProduct(id){ var p=findProduct(id);if(!p)return; var st=p.available?"":" (Под заказ)"; var text="\u2728 Victoria's Secret\n\n\uD83D\uDCDE "+p.name+st+"\n\uD83D\uDCB0 "+formatPrice(p.price)+"\n\uD83D\uDCDD "+p.shortDescription+"\n\n\u2B07\uFE0F Открыть товар"; var url=getProductDeepLink(id); if(tg&&tg.openTelegramLink){var sl="https://t.me/share/url?url="+encodeURIComponent(url)+"&text="+encodeURIComponent(text);tg.openTelegramLink(sl);}else if(navigator.share){navigator.share({title:p.name+" — Victoria's Secret",text:text,url:url}).catch(function(){});}else{var ft=text+"\n"+url;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ft).then(function(){showToast("Скопировано");});}else{var ta=document.createElement("textarea");ta.value=ft;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);showToast("Скопировано");}} }
    function addToCartFromCard(id,btn){ var p=findProduct(id);if(!p)return; var ex=findCartItem(id); if(ex)ex.quantity++;else state.cart.push({product:p,quantity:1}); saveToStorage("cart",state.cart);updateCartBadge();animateFlyToCart(btn); btn.classList.remove("pop-anim");void btn.offsetWidth;btn.classList.add("pop-anim"); updateAddButtonsOnCards(); if(state.selectedProduct&&state.selectedProduct.id===id){var db=document.getElementById("detailAddBtn");db.innerHTML='<i class="fas fa-shopping-bag"></i> Уже в корзине';db.classList.add("is-added");} showToast("Добавлено в корзину"); }
    function updateAddButtonsOnCards(){ var b=document.querySelectorAll(".card-add-btn"); for(var i=0;i<b.length;i++){var id=parseInt(b[i].getAttribute("data-add-id"));var it=findCartItem(id); if(it){b[i].classList.add("in-cart");b[i].textContent=it.quantity;}else{b[i].classList.remove("in-cart");b[i].innerHTML='<i class="fas fa-plus"></i>';}} }
    function openProductDetail(p){ state.selectedProduct=p;state.currentView="detail";updateTelegramBackButton(); document.getElementById("detailImg").src=p.image;document.getElementById("detailImg").alt=p.name; document.getElementById("detailCatLabel").textContent=categoryLabels[p.category]||""; document.getElementById("detailName").textContent=p.name; document.getElementById("detailDesc").textContent=p.fullDescription; var pe=document.getElementById("detailPrice"); if(p.available){pe.textContent=formatPrice(p.price);pe.classList.remove("is-preorder");}else{pe.textContent="Под заказ — "+formatPrice(p.price);pe.classList.add("is-preorder");} var btn=document.getElementById("detailAddBtn");var ic=findCartItem(p.id); btn.className=ic?"is-added":""; btn.innerHTML='<i class="fas fa-shopping-bag"></i> '+(ic?"Уже в корзине":(p.available?"Добавить в корзину":"Предзаказать")); document.getElementById("overlayBackdrop").classList.add("open"); document.getElementById("detailPanel").classList.add("open"); document.getElementById("detailScrollArea").scrollTop=0; }
    function closeProductDetail(){ state.currentView="catalog";state.selectedProduct=null;updateTelegramBackButton(); document.getElementById("detailPanel").classList.remove("open"); document.getElementById("overlayBackdrop").classList.remove("open"); }
    function openCart(){ if(state.currentView==="cart")return; state.currentView="cart";updateTelegramBackButton(); document.getElementById("overlayBackdrop").classList.add("open"); document.getElementById("cartPanel").classList.add("open"); document.getElementById("cartContentArea").scrollTop=0; renderCartContent(); }
    function closeCart(){ state.currentView="catalog";updateTelegramBackButton(); document.getElementById("cartPanel").classList.remove("open"); document.getElementById("overlayBackdrop").classList.remove("open"); closeCheckoutModal(); }
    function removeFromCart(id){ state.cart=state.cart.filter(function(i){return i.product.id!==id;}); saveToStorage("cart",state.cart);updateCartBadge();updateAddButtonsOnCards();renderCartContent(); }
    function changeCartQuantity(id,d){ var it=findCartItem(id);if(!it)return; it.quantity+=d; if(it.quantity<=0){removeFromCart(id);return;} saveToStorage("cart",state.cart);updateCartBadge();updateAddButtonsOnCards();renderCartContent(); }
    function renderCartContent(){ var el=document.getElementById("cartContentArea");var c=getCartItemCount(); document.getElementById("cartNavCount").textContent=c>0?"("+c+")":""; if(state.cart.length===0){el.innerHTML='<div class="empty-state"><div class="empty-icon"><i class="fas fa-shopping-bag"></i></div><h2 class="empty-title">Корзина пуста</h2><p class="empty-desc">Выберите товары, которые вам понравятся</p></div>';return;} var h='<div class="cart-items-list">'; for(var i=0;i<state.cart.length;i++){var it=state.cart[i]; h+='<div class="cart-item" style="animation-delay:'+(i*0.04)+'s"><div class="cart-item-img"><img src="'+it.product.image+'" alt="'+it.product.name+'"></div><div class="cart-item-body"><div class="cart-item-name">'+it.product.name+'</div><div class="cart-item-row"><div class="cart-item-price">'+formatPrice(it.product.price*it.quantity)+'</div><div class="qty-controls"><button class="qty-btn" data-qty-id="'+it.product.id+'" data-qty-delta="-1"><i class="fas fa-minus" style="font-size:10px"></i></button><span class="qty-value">'+it.quantity+'</span><button class="qty-btn" data-qty-id="'+it.product.id+'" data-qty-delta="1"><i class="fas fa-plus" style="font-size:10px"></i></button></div></div></div><button class="cart-item-del" data-del-id="'+it.product.id+'"><i class="fas fa-trash-alt"></i></button></div>';} h+='</div><div class="cart-footer-bar"><div class="cart-delivery-note">Доставка оплачивается отдельно клиентом</div><div class="cart-total-row"><span class="cart-total-label">Итого</span><span class="cart-total-value">'+formatPrice(getCartTotal())+'</span></div><button class="checkout-open-btn" id="checkoutOpenBtn">Оформить заказ <i class="fas fa-arrow-right" style="font-size:12px"></i></button></div>'; el.innerHTML=h; var qb=el.querySelectorAll(".qty-btn"); for(var q=0;q<qb.length;q++){(function(btn){btn.addEventListener("click",function(){changeCartQuantity(parseInt(btn.getAttribute("data-qty-id")),parseInt(btn.getAttribute("data-qty-delta")));});})(qb[q]);} var db=el.querySelectorAll(".cart-item-del"); for(var d=0;d<db.length;d++){(function(btn){btn.addEventListener("click",function(){removeFromCart(parseInt(btn.getAttribute("data-del-id")));});})(db[d]);} var cb=el.querySelector("#checkoutOpenBtn");if(cb)cb.addEventListener("click",openCheckoutModal); }
    function openCheckoutModal(){ document.getElementById("checkoutModal").classList.add("open"); if(tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user){var u=tg.initDataUnsafe.user; if(u.first_name&&!document.getElementById("nameInput").value)document.getElementById("nameInput").value=u.first_name+(u.last_name?" "+u.last_name:""); if(u.username&&!document.getElementById("tgInput").value)document.getElementById("tgInput").value="@"+u.username;} setTimeout(function(){if(!document.getElementById("nameInput").value)document.getElementById("nameInput").focus();else if(!document.getElementById("tgInput").value)document.getElementById("tgInput").focus();},400); }
    function closeCheckoutModal(){ document.getElementById("checkoutModal").classList.remove("open");clearFormErrors(); }
    function clearFormErrors(){ var i=document.querySelectorAll(".form-input");for(var a=0;a<i.length;a++)i[a].classList.remove("has-error"); var e=document.querySelectorAll(".form-error-msg");for(var b=0;b<e.length;b++)e[b].classList.remove("visible"); }
    function submitOrder(){ var valid=true;clearFormErrors(); var nv=document.getElementById("nameInput").value.trim(); var tv=document.getElementById("tgInput").value.trim(); if(!nv){document.getElementById("nameInput").classList.add("has-error");document.getElementById("nameError").classList.add("visible");valid=false;} if(!tv){document.getElementById("tgInput").classList.add("has-error");document.getElementById("tgError").classList.add("visible");valid=false;} if(!valid)return; var lines=["\uD83D\uDED2 НОВЫЙ ЗАКАЗ","\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500","\uD83D\uDC64 Клиент: "+nv,"\uD83D\uDCAC Telegram: "+tv,"\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500","\uD83D\uDED2 Товары:"]; for(var i=0;i<state.cart.length;i++){var it=state.cart[i];lines.push("  \u2022 "+it.product.name+" x"+it.quantity+" \u2014 "+formatPrice(it.product.price*it.quantity));} lines.push("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"); lines.push("\uD83D\uDCB0 Итого: "+formatPrice(getCartTotal())); lines.push("\uD83D\uDE9A Доставка: оплачивается отдельно клиентом"); var om=lines.join("\n"); if(tg&&tg.sendData){try{tg.sendData(om);}catch(e){console.log("sendData err:",e);}}else{console.log("sendData not available");} closeCheckoutModal();closeCart();closeProductDetail(); state.cart=[];saveToStorage("cart",state.cart);updateCartBadge();updateAddButtonsOnCards(); document.getElementById("successOverlay").classList.add("open"); }
    function closeSuccessOverlay(){ document.getElementById("successOverlay").classList.remove("open"); state.currentView="catalog";updateTelegramBackButton();renderCatalog(); }
    function navigateBack(){ if(state.currentView==="detail")closeProductDetail(); else if(state.currentView==="cart")closeCart(); }
    function toggleSearch(fc){ var b=document.getElementById("searchBar");var f=document.getElementById("filterBar"); if(fc||state.isSearchOpen){state.isSearchOpen=false;b.classList.remove("open");f.classList.remove("shifted-down");document.getElementById("searchInput").value="";state.searchQuery="";renderCatalog();}else{state.isSearchOpen=true;b.classList.add("open");f.classList.add("shifted-down");setTimeout(function(){document.getElementById("searchInput").focus();},300);} }
    function cycleSortMode(){ if(state.sortMode==="none"){state.sortMode="asc";showToast("Сортировка: Дешевле");}else if(state.sortMode==="asc"){state.sortMode="desc";showToast("Сортировка: Дороже");}else{state.sortMode="none";showToast("Сортировка сброшена");} var b=document.getElementById("sortBtn");if(state.sortMode!=="none")b.classList.add("sort-active");else b.classList.remove("sort-active"); renderCatalog(); }
    function handleStartParam(){ if(!tg)return; try{var sp=tg.initDataUnsafe&&tg.initDataUnsafe.start_param; if(sp&&sp.indexOf("product_")===0){var pid=parseInt(sp.replace("product_",""));var pr=findProduct(pid); if(pr)setTimeout(function(){openProductDetail(pr);},400);}}catch(e){} }
    function initEventListeners(){ document.getElementById("sortBtn").addEventListener("click",cycleSortMode); document.getElementById("searchBtn").addEventListener("click",function(){toggleSearch();}); document.getElementById("searchCloseBtn").addEventListener("click",function(){toggleSearch(true);}); document.getElementById("searchInput").addEventListener("input",function(e){state.searchQuery=e.target.value;renderCatalog();}); document.getElementById("cartBtn").addEventListener("click",openCart); document.getElementById("favStickyChip").addEventListener("click",function(){state.selectedCategory="fav";renderFilterBar();updateFavStickyChip();renderCatalog();}); document.getElementById("detailBackBtn").addEventListener("click",closeProductDetail); document.getElementById("detailCloseBtn").addEventListener("click",closeProductDetail); document.getElementById("detailAddBtn").addEventListener("click",function(){ if(!state.selectedProduct)return;var p=state.selectedProduct;var ex=findCartItem(p.id); if(ex)ex.quantity++;else state.cart.push({product:p,quantity:1}); saveToStorage("cart",state.cart);updateCartBadge();updateAddButtonsOnCards(); var btn=document.getElementById("detailAddBtn");btn.innerHTML='<i class="fas fa-shopping-bag"></i> Уже в корзине';btn.classList.add("is-added");showToast("Добавлено в корзину"); }); document.getElementById("cartBackBtn").addEventListener("click",closeCart); document.getElementById("overlayBackdrop").addEventListener("click",function(){ if(state.currentView==="detail")closeProductDetail(); else if(state.currentView==="cart")closeCart(); }); document.getElementById("checkoutModalBg").addEventListener("click",closeCheckoutModal); document.getElementById("submitOrderBtn").addEventListener("click",submitOrder); document.getElementById("nameInput").addEventListener("input",function(){document.getElementById("nameInput").classList.remove("has-error");document.getElementById("nameError").classList.remove("visible");}); document.getElementById("tgInput").addEventListener("input",function(){document.getElementById("tgInput").classList.remove("has-error");document.getElementById("tgError").classList.remove("visible"); var v=document.getElementById("tgInput").value;if(v.length>0&&v.charAt(0)!=="@")document.getElementById("tgInput").value="@"+v;}); document.getElementById("successBackBtn").addEventListener("click",closeSuccessOverlay); document.getElementById("successChatBtn").addEventListener("click",openChannelChat); }
    function init(){ var sc=loadFromStorage("cart");if(sc)state.cart=sc; var sf=loadFromStorage("favorites");if(sf)state.favorites=sf; renderFilterBar();updateFavStickyChip();renderCatalog();updateCartBadge();initEventListeners();updateTelegramBackButton(); handleStartParam(); }
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
    <\/script>
</body>
</html>
`;