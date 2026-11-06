// Manda un mensaje a tu chat de Telegram (el mismo bot que usaba n8n)
export async function avisarTelegram(texto) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error("Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: texto, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Telegram respondió ${res.status}: ${await res.text()}`);
  }
}
