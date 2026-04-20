// --- НАСТРОЙКИ ---
const YOUR_CHAT_ID = 204934856; // ваш ID
// -----------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 1. Вебхук от Telegram
    if (request.method === 'POST' && url.pathname === '/webhook') {
      const update = await request.json();
      env.ctx.waitUntil(handleUpdate(update, env));
      return new Response('OK', { status: 200 });
    }
    
    // 2. Приём заказов с сайта
    if (request.method === 'POST' && url.pathname === '/send-order') {
      try {
        const orderData = await request.json();
        const message = formatOrderMessage(orderData);
        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, YOUR_CHAT_ID, message);
        return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
      } catch (error) {
        return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
      }
    }
    
    return new Response('Бот работает!', { status: 200 });
  }
};

async function handleUpdate(update, env) {
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;
    if (text === '/start') {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, 'Привет! Я бот для уведомлений о заказах.');
    } else {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, `Вы написали: ${text}`);
    }
  }
}

async function sendTelegramMessage(token, chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' })
  });
  if (!response.ok) console.error(await response.text());
  return response;
}

function formatOrderMessage(order) {
  let itemsText = '';
  if (order.items && order.items.length) {
    itemsText = order.items.map(item => `  • ${item.name} x${item.quantity} — ${item.total} Br`).join('\n');
  } else {
    itemsText = '  • (нет товаров)';
  }
  return `
🛍️ *НОВЫЙ ЗАКАЗ!*
━━━━━━━━━━━━━━━
👤 *Имя:* ${order.name || 'Не указано'}
📞 *Telegram:* ${order.telegram || 'Не указан'}
━━━━━━━━━━━━━━━
*Товары:*
${itemsText}
━━━━━━━━━━━━━━━
💰 *Итого:* ${order.totalFormatted || order.total + ' Br'}
⏰ *Время:* ${new Date().toLocaleString()}
  `;
}