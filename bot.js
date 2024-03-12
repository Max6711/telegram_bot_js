
const { Telegraf } = require('telegraf');
const axios = require('axios');

// Токен вашего бота
const BOT_TOKEN = '6849461882:AAFgNy2fx3eXzJLJnf1zjwpzpBwuELQCAL8';

// Ваш Telegram ID (используется для отправки сообщений)
const YOUR_TELEGRAM_ID = '1292283830';
// URL API для получения цены EOS (пример для CoinGecko)
const EOS_PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=eos&vs_currencies=usd';
// URL API для получения цены WAXP (пример для CoinGecko)
const WAXP_PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=wax&vs_currencies=usd';
// URL API для получения цены TLOS (пример для CoinGecko)
const TLOS_PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=telos&vs_currencies=usd';

const bot = new Telegraf(BOT_TOKEN);

// Предыдущая цена каждого актива
let prevEOSPrice = null;
let prevWAXPPrice = null;
let prevTLOSPrice = null;

// Функция для получения цены EOS из CoinGecko API
async function getEOSPrice() {
  try {
    const response = await axios.get(EOS_PRICE_API_URL);
    const EOSPriceUSD = response.data.eos.usd;
    return EOSPriceUSD;
  } catch (error) {
    console.error('Ошибка получения цены EOS:', error);
    
  }
}

// Функция для получения цены WAXP из CoinGecko API
async function getWAXPPrice() {
  try {
    const response = await axios.get(WAXP_PRICE_API_URL);
    const WAXPPriceUSD = response.data.wax.usd;
    return WAXPPriceUSD;
  } catch (error) {
    console.error('Ошибка получения цены WAXP:', error);
   
  }
}

// Функция для получения цены TLOS из CoinGecko API
async function getTLOSPrice() {
  try {
    const response = await axios.get(TLOS_PRICE_API_URL);
    const TLOSPriceUSD = response.data.telos.usd;
    return TLOSPriceUSD;
  } catch (error) {
    console.error('Ошибка получения цены TLOS:', error);
   
  }
}

// Функция для отправки сообщения о цене актива
async function sendPriceMessage(coinName, price, percentChange) {
  let emoji = '';
  if (percentChange > 0) {
    emoji = '🟢🚀💹🟢🚀💹';
  } else if (percentChange < 0) {
    emoji = '🔴📉🚨🔴📉🚨';
  }

  const message = `${coinName} ${emoji} Change: ${percentChange.toFixed(2)}%  $${price}`;

  bot.telegram.sendMessage(YOUR_TELEGRAM_ID, message);
}



// Обработчик текстовых сообщений
bot.on('text', async (ctx) => {
  const message = ctx.message.text.toLowerCase();
  if (message.includes('price')) {
    const EOSPrice = await getEOSPrice();
    const WAXPPrice = await getWAXPPrice();
    const TLOSPrice = await getTLOSPrice();
    let response = `Price for EOS: $${EOSPrice}\n`;
    response += `Price for WAXP: $${WAXPPrice}\n`;
    response += `Price for TLOS: $${TLOSPrice}\n`;
    ctx.reply(response);
  }
});

// Функция для отправки сообщений о ценах активов
async function sendPriceMessages() {
  const EOSPrice = await getEOSPrice();
  const WAXPPrice = await getWAXPPrice();
  const TLOSPrice = await getTLOSPrice();

  // Проверка изменения цены для EOS
  if (prevEOSPrice !== null) {
    const EOSPriceChange = EOSPrice - prevEOSPrice;
    const EOSPercentChange = (EOSPriceChange / prevEOSPrice) * 100;
    if (Math.abs(EOSPercentChange) >= 0.1) {
      await sendPriceMessage('EOS', EOSPrice, EOSPercentChange);
    }
  }

  // Проверка изменения цены для WAXP
  if (prevWAXPPrice !== null) {
    const WAXPPriceChange = WAXPPrice - prevWAXPPrice;
    const WAXPPercentChange = (WAXPPriceChange / prevWAXPPrice) * 100;
    if (Math.abs(WAXPPercentChange) >= 0.01) {
      await sendPriceMessage('WAXP', WAXPPrice, WAXPPercentChange);
    }
  }

  // Проверка изменения цены для TLOS
  if (prevTLOSPrice !== null) {
    const TLOSPriceChange = TLOSPrice - prevTLOSPrice;
    const TLOSPercentChange = (TLOSPriceChange / prevTLOSPrice) * 100;
    if (Math.abs(TLOSPercentChange) >= 0.01) {
      await sendPriceMessage('TLOS', TLOSPrice, TLOSPercentChange);
    }
  }

  // Обновление предыдущих цен
  prevEOSPrice = EOSPrice;
  prevWAXPPrice = WAXPPrice;
  prevTLOSPrice = TLOSPrice;
}

// Запуск функции отправки сообщений каждые 20 секунд
setInterval(sendPriceMessages, 30 * 1000);




// Запуск бота
bot.launch();
