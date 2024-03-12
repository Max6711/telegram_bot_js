import telebot
import requests
import time
import threading

BOT_TOKEN = '6849461882:AAFgNy2fx3eXzJLJnf1zjwpzpBwuELQCAL8'
YOUR_TELEGRAM_ID = '1292283830'

EOS_PRICE_API_URL =  'https://api.binance.com/api/v3/ticker/price?symbol=EOSUSDT'
WAXP_PRICE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=WAXPUSDT'
TLOS_PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=telos&vs_currencies=usd'

prev_EOS_price = None
prev_WAXP_price = None
prev_TLOS_price = None

bot = telebot.TeleBot(BOT_TOKEN)

def get_EOS_price():
    try:
        response = requests.get(EOS_PRICE_API_URL)
        EOS_price_USD = response.json()['price']
        return float(EOS_price_USD)
    except Exception as e:
        print('Ошибка получения цены EOS:', e)
        return None
    
def get_TLOS_price():
    try:
        TLOS_PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=telos&vs_currencies=usd'
        response = requests.get(TLOS_PRICE_API_URL)
        TLOS_price_USD = response.json()['telos']['usd']
        return float(TLOS_price_USD)
    except Exception as e:
        print('Ошибка получения цены TLOS:', e)
        return None

def get_WAXP_price():
    try:
        response = requests.get(WAXP_PRICE_API_URL)
        WAXP_price_USD = response.json()['price']
        return float(WAXP_price_USD)
    except Exception as e:
        print('Ошибка получения цены WAXP:', e)
        return None

def send_price_message(coin_name, price, percent_change):
    emoji = ''
    if percent_change > 0:
        emoji = '🟢🚀💹'
    elif percent_change < 0:
        emoji = '🔴📉🚨'

    message = f'{coin_name} {emoji} Change: {percent_change:.2f}%  ${price}'
    bot.send_message(YOUR_TELEGRAM_ID, message)

def send_price_messages():
    EOS_price = get_EOS_price()
    WAXP_price = get_WAXP_price()
    TLOS_price = get_TLOS_price()

    global prev_EOS_price, prev_WAXP_price, prev_TLOS_price

    if prev_EOS_price is not None:
        EOS_price_change = EOS_price - prev_EOS_price
        EOS_percent_change = (EOS_price_change / prev_EOS_price) * 100
        if abs(EOS_percent_change) >= 0.5:
            send_price_message('EOS', EOS_price, EOS_percent_change)

    if prev_WAXP_price is not None:
        WAXP_price_change = WAXP_price - prev_WAXP_price
        WAXP_percent_change = (WAXP_price_change / prev_WAXP_price) * 100
        if abs(WAXP_percent_change) >= 0.3:
            send_price_message('WAXP', WAXP_price, WAXP_percent_change)

    if prev_TLOS_price is not None:
        TLOS_price_change = TLOS_price - prev_TLOS_price
        TLOS_percent_change = (TLOS_price_change / prev_TLOS_price) * 100
        if abs(TLOS_percent_change) >= 0.3:
            send_price_message('TLOS', TLOS_price, TLOS_percent_change)

    prev_EOS_price = EOS_price
    prev_WAXP_price = WAXP_price
    prev_TLOS_price = TLOS_price

# Обробник команди /start
@bot.message_handler(commands=['start'])
def start_message(message):
    bot.reply_to(message, "GOOD LUCK!🚀")

def get_crypto_prices():
    eos_price = get_EOS_price()
    wax_price = get_WAXP_price()
    telos_price = get_TLOS_price()
    return eos_price, wax_price, telos_price

# Обробник повідомлень, які містять слово "price"
@bot.message_handler(func=lambda message: '/price' in message.text.lower())
def handle_price_message(message):
    # Отримання цін криптовалют
    eos_price, wax_price, telos_price = get_crypto_prices()

    # Створення відповіді з поточними цінами
    response = f"Price NOW:\n"
    response += f"🟢 EOS: 💵{eos_price}\n"
    response += f"🟢 WAXP: 💵{wax_price}\n"
    response += f"🟢 TLOS: 💵{telos_price}\n"



    # Відправлення відповіді користувачеві
    bot.reply_to(message, response)


def bot_polling():
    bot.polling()

# Запускаємо функцію бота в окремому потоці
threading.Thread(target=bot_polling).start()


while True:
    send_price_messages()
    time.sleep(30)



