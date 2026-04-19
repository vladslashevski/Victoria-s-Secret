const BOT_TOKEN = '8559711885:AAE4vRXIKYa58h4NQzwuiI-m_58b1ui5gBk';
const CHANNEL_ID = '-100ВСТАВЬТЕ_СЮДА_ID_КАНАЛА';

export async function onRequestPost(context) {
  const update = await context.request.json();

  if (update.message && update.message.web_app_data) {
    const orderText = update.message.web_app_data.data;
    const user = update.message.from;

    const userLine = '\n👤 От: ' +
      (user.first_name || '') +
      (user.last_name ? ' ' + user.last_name : '') +
      (user.username ? ' (@' + user.username + ')' : '');

    await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: orderText + userLine
      })
    });
  }

  return new Response('ok');
}