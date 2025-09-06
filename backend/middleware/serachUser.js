import TelegramBot from "node-telegram-bot-api";

const TOKEN = '8443556331:AAHYs6H-t7qckr6YmTsnSntgqBxVlYX1ehc';
const CHAT_ID = -4655450691; // У супергрупах ОБОВ'ЯЗКОВО з мінусом!
const bot = new TelegramBot(TOKEN, { polling: false });

/**
 * Перевіряє, чи є користувач у групі
 * @param {number|string} user_id - Telegram user_id
 * @returns {Promise<boolean>} - true якщо є в групі, false якщо ні
 */
export const searchUser = async (user_id) => {
    try {
        // Переконаємось, що user_id — число
        const id = parseInt(user_id, 10);
        if (isNaN(id)) {
            console.error("searchUser: user_id не є числом:", user_id);
            return false;
        }

        const member = await bot.getChatMember(CHAT_ID, id);

        // Якщо користувач пішов або його кікнули → false
        if (member.status === "left" || member.status === "kicked") {
            return false;
        }

        // В усіх інших випадках → true
        return true;
    } catch (err) {
        // Якщо Telegram повернув помилку — теж повертаємо false
        console.error("Telegram API error:", err.response?.body || err.message);
        return false;
    }
};
