// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

interface BookingData {
  fullName: string;
  phoneNumber: string;
  selectedActionType: string;
  selectedRentItem?: string;
  selectedSaleItem?: string;
  actionType: string;
  productName?: string;
}

export const sendToTelegram = async (bookingData: BookingData): Promise<boolean> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram configuration missing. Please set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env file');
    return false;
  }

  try {
    // Format the message
    const message = formatBookingMessage(bookingData);
    
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
};

const formatBookingMessage = (data: BookingData): string => {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yerevan',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  let message = `🎧 <b>New Booking Request</b>\n\n`;
  message += `📅 <b>Date:</b> ${timestamp} (Armenia Time)\n`;
  message += `👤 <b>Name:</b> ${data.fullName}\n`;
  message += `📞 <b>Phone:</b> ${data.phoneNumber}\n`;
  message += `🎯 <b>Action Type:</b> ${data.selectedActionType || data.actionType}\n`;

  if (data.productName) {
    message += `📦 <b>Product:</b> ${data.productName}\n`;
  }

  if (data.selectedRentItem) {
    message += `🔄 <b>Rent Item:</b> ${data.selectedRentItem}\n`;
  }

  if (data.selectedSaleItem) {
    message += `💰 <b>Sale Item:</b> ${data.selectedSaleItem}\n`;
  }

  message += `\n🌐 <b>Source:</b> SpyTech Exam Tools Website`;
  message += `\n\n<i>Please contact the customer within 24 hours.</i>`;

  return message;
};

// Test function to verify Telegram configuration
export const testTelegramConnection = async (): Promise<boolean> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram configuration missing');
    return false;
  }

  try {
    const testMessage = `🧪 <b>Test Message</b>\n\nTelegram integration is working!\n\n📅 ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Yerevan' })} (Armenia Time)`;
    
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Telegram test failed:', error);
    return false;
  }
};
