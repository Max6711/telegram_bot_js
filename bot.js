

const { Telegraf } = require('telegraf');
const axios = require('axios');

// Токен вашого бота
const BOT_TOKEN = '6849461882:AAFgNy2fx3eXzJLJnf1zjwpzpBwuELQCAL8';
// Ваш Telegram ID (використовується для надсилання повідомлень)
const YOUR_TELEGRAM_ID = 'MaxWell6711';
// URL API для отримання ціни біткоїна (приклад для CoinGecko)
const BITCOIN_PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

const bot = new Telegraf(BOT_TOKEN);

// Функція для отримання ціни біткоїна з CoinGecko API
async function getBitcoinPrice() {
  try {
    const response = await axios.get(BITCOIN_PRICE_API_URL);
    const bitcoinPriceUSD = response.data.bitcoin.usd;
    return bitcoinPriceUSD;
  } catch (error) {
    console.error('Помилка отримання ціни біткоїна:', error);
    return null;
  }
}

// Функція для надсилання повідомлення про ціну біткоїна
async function sendBitcoinPriceMessage() {
  const bitcoinPrice = await getBitcoinPrice();
  if (bitcoinPrice !== null) {
    const message = `Ціна біткоїна зараз: $${bitcoinPrice}`;
    bot.telegram.sendMessage(YOUR_TELEGRAM_ID, message);
  }
}

// Запускаємо функцію надсилання повідомлення про ціну біткоїна кожні 30 хвилин
setInterval(sendBitcoinPriceMessage, 30 * 60 * 1000);

// Запускаємо бота
bot.launch();
