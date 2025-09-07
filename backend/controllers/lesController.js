import db from "../db/connectdb.js";
import createAnswer from "./createAnsver.js"; // залишив твою назву, але краще виправити файл
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

// ⚠️ Токен і чат-айді беремо з .env
const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = parseInt(process.env.TELEGRAM_CHAT_ID, 10);

if (!TOKEN || !CHAT_ID) {
    throw new Error("Не вказані TELEGRAM_TOKEN або TELEGRAM_CHAT_ID у .env");
}

const bot = new TelegramBot(TOKEN, { polling: false });

// -------- Перевірка користувача у групі --------
const validUser = async (user_id) => {
    try {
        const id = Number(user_id);
        if (!Number.isInteger(id)) {
            console.error("searchUser: user_id не число:", user_id);
            return false;
        }
        const member = await bot.getChatMember(CHAT_ID, id);
        return !(member.status === "left" || member.status === "kicked");
    } catch (err) {
        console.error("Telegram API error:", err.response?.body || err.message || err);
        return false;
    }
};

// -------- GET LESSON --------
export const get_lesson = async (req, res) => {
    try {
        const user_id = Number(req.body.user_id);
        const link_id = req.body.link_id;

        if (!Number.isInteger(user_id) || !link_id) {
            return res.status(400).json({ message: "Некоректний user_id або відсутній link_id" });
        }

        const isValid = await validUser(user_id);
        if (!isValid) {
            return res.status(404).json({ message: "User not found or not in group" });
        }

        const lesson = await createAnswer(link_id);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // Якщо files рядок → парсимо
        if (typeof lesson.files === "string") {
            try {
                lesson.files = JSON.parse(lesson.files);
            } catch {
                lesson.files = [];
            }
        }

        return res.status(200).json({ lesson });
    } catch (err) {
        console.error("get_lesson error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// -------- CREATE LESSON --------
export const create_lesson = async (req, res) => {
    const { link_id, title, description, files } = req.body;

    if (!link_id || !title || !description) {
        return res.status(400).json({ message: "link_id, title та description обов'язкові" });
    }

    try {
        const existingLesson = await createAnswer(link_id);
        if (existingLesson) {
            return res.status(409).json({ message: "Lesson with this link_id already exists" });
        }

        const filesJson = JSON.stringify(Array.isArray(files) ? files : []);

        const sql = "INSERT INTO lessons (link_id, title, description, files) VALUES (?, ?, ?, ?)";
        await new Promise((resolve, reject) => {
            db.run(sql, [link_id, title, description, filesJson], function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        return res.status(201).json({ message: "Lesson created successfully" });
    } catch (err) {
        console.error("Помилка створення уроку:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// -------- EDIT LESSON --------
export const edit_lesson = async (req, res) => {
    const lessons = req.body;

    if (!Array.isArray(lessons) || lessons.length === 0) {
        return res.status(400).json({ message: "Масив уроків обов'язковий" });
    }

    try {
        // Починаємо транзакцію
        await new Promise((resolve, reject) => {
            db.run("BEGIN TRANSACTION", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Видаляємо всі старі уроки
        await new Promise((resolve, reject) => {
            db.run("DELETE FROM lessons", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Вставляємо нові уроки без id (авто-генерація)
        const insertSql = `
            INSERT INTO lessons (day, tittle, files, link_id)
            VALUES (?, ?, ?, ?)
        `;

        for (const lesson of lessons) {
            const { day, tittle, files, link_id } = lesson;

            if (!link_id || !tittle) continue;

            const filesJson = JSON.stringify(Array.isArray(files) ? files : []);

            await new Promise((resolve, reject) => {
                db.run(insertSql, [day || null, tittle, filesJson, link_id], function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID); // повертає згенерований id
                });
            });
        }

        // Завершуємо транзакцію
        await new Promise((resolve, reject) => {
            db.run("COMMIT", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        return res.status(200).json({ message: "Уроки повністю замінено з авто-генерацією id" });
    } catch (err) {
        // rollback у випадку помилки
        await new Promise((resolve) => {
            db.run("ROLLBACK", () => resolve());
        });

        console.error("Помилка заміни уроків:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// -------- DELETE LESSON --------
export const delete_lesson = async (req, res) => {
    const { link_id } = req.body; // 🔄 змінив на body для консистентності

    if (!link_id) {
        return res.status(400).json({ message: "link_id обов'язковий" });
    }

    try {
        const existingLesson = await createAnswer(link_id);
        if (!existingLesson) {
            return res.status(404).json({ message: "Lesson with this link_id not found" });
        }

        const sql = "DELETE FROM lessons WHERE link_id = ?";
        await new Promise((resolve, reject) => {
            db.run(sql, [link_id], function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });

        return res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (err) {
        console.error("Помилка видалення уроку:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
