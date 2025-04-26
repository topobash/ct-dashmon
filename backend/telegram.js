// backend/telegram.js
require("dotenv").config();
const axios = require("axios");

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }
    );
    console.log("✅ Telegram alert sent");
  } catch (error) {
    console.error("❌ Failed to send Telegram alert:", error.message);
  }
}

module.exports = { sendTelegramMessage };
