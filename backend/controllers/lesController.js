import db from "../db/connectdb.js";
import createAnsver from "./createAnsver.js"

const searchUser = (tg_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE tg_id = ?';
        db.get(sql, [tg_id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!row); // true якщо користувач знайдений
            }
        });
    });
};

export const get_lesson = async (req, res) => {
    const user_id = req.body.tg_id;
    const link_id = req.body.link_id;

    if (!user_id || !link_id) {
        return res.status(400).json({ message: 'user_id та link_id обов\'язкові' });
    }

    try {
        const validUser = await searchUser(user_id);

        if (!validUser) {  // <-- тут перевіряємо правильну змінну
            return res.status(404).json({ message: 'User undefined' });
        }

        const lesson = await createAnsver(link_id);

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // Розпарсимо поле files, якщо воно є
        if (lesson.files) {
            try {
                lesson.files = JSON.parse(lesson.files);
            } catch (err) {
                console.error("Помилка парсингу files:", err);
                lesson.files = [];
            }
        }

        return res.status(200).json({ lesson });

            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Server error" });
            }
        };

//-------------------------------------------------------------------------------------------------------------------
export const create_lesson = async (req, res) => {
    const { link_id, title, description, files } = req.body;

    if (!link_id || !title || !Array.isArray(files) || !description) {
        return res.status(400).json({ message: 'link_id та title обов\'язкові' });
    }

    try {
        // Перевіряємо, чи існує урок з таким link_id
        const existingLesson = await createAnsver(link_id);
        if (existingLesson) {
            return res.status(409).json({ message: 'Lesson with this link_id already exists' });
        }

        // Якщо файли передані, конвертуємо їх у JSON рядок
        const filesJson = files ? JSON.stringify(files) : null;

        const sql = 'INSERT INTO lessons (link_id, title, description, files) VALUES (?, ?, ?, ?)';
        await new Promise((resolve, reject) => {
            db.run(sql, [link_id, title, description || null, filesJson], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });

        return res.status(201).json({ message: 'Lesson created successfully' });
    } catch (err) {
        console.error("Помилка створення уроку:", err);
        return res.status(500).json({ message: "Server error" });
    }
}
    
//-------------------------------------------------------------------------------------------------------------------

export const edit_lesson = async (req, res) => {
    const { link_id, title, description, files } = req.body;

    if (!link_id || !title || !Array.isArray(files) || !description) {
        return res.status(400).json({ message: 'link_id та title обов\'язкові' });
    }

    try {
        // Перевіряємо, чи існує урок з таким link_id
        const existingLesson = await createAnsver(link_id);
        if (!existingLesson) {
            return res.status(404).json({ message: 'Lesson with this link_id not found' });
        }

        // Якщо файли передані, конвертуємо їх у JSON рядок
        const filesJson = files ? JSON.stringify(files) : null;

        const sql = 'UPDATE lessons SET title = ?, description = ?, files = ? WHERE link_id = ?';
        await new Promise((resolve, reject) => {
            db.run(sql, [title, description || null, filesJson, link_id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });

        return res.status(200).json({ message: 'Lesson updated successfully' });
    } catch (err) {
        console.error("Помилка оновлення уроку:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

//-------------------------------------------------------------------------------------------------------------------


export const delete_lesson = async (req, res) => {
    const link_id = req.params.id;

    if (!link_id) {
        return res.status(400).json({ message: 'link_id обов\'язковий' });
    }

    try {
        // Перевіряємо, чи існує урок з таким link_id
        const existingLesson = await createAnsver(link_id);
        if (!existingLesson) {
            return res.status(404).json({ message: 'Lesson with this link_id not found' });
        }

        const sql = 'DELETE FROM lessons WHERE link_id = ?';
        await new Promise((resolve, reject) => {
            db.run(sql, [link_id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });

        return res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (err) {
        console.error("Помилка видалення уроку:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

