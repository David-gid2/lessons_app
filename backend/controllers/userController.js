import db from "../db/connectdb.js";

//-------------------------------------------------------------------------------------------------------------------

export const getUsers = async (req, res) => {
    try {
        const sql = "SELECT * FROM users";

        const users = await new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return res.json({ users });

    } catch (err) {
        console.error("Помилка отримання користувачів:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
    
//-------------------------------------------------------------------------------------------------------------------

export const getUserById = async(req, res) => {
  try {
        const sql = "SELECT * FROM users WHERE tg_id = ?";
        const id = parseInt(req.params.id);
        const user = await new Promise((resolve, reject) => {
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return res.json({ user });
    } 
  catch (err) {
        console.error("Помилка отримання користувача:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
  
//-------------------------------------------------------------------------------------------------------------------

export const createUser = async(req, res) => {
  try {
        const sql = "INSERT INTO users (tg_id) VALUES (?)";
        const tg_id = parseInt(req.body.tg_id);
        const create = await new Promise((resolve, reject) => {
            db.all(sql, [tg_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return res.json(create);
    } 
  catch (err) {
        console.error("Помилка отримання користувача:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

//-------------------------------------------------------------------------------------------------------------------

export const deleteUser = async(req, res) => {
  try {
        const sql = " DELETE FROM users WHERE tg_id = ?";
        const tg_id = parseInt(req.params.id);
        const delete_ = await new Promise((resolve, reject) => {
            db.all(sql, [tg_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return res.json(delete_);
    } 
  catch (err) {
        console.error("Помилка отримання користувача:", err);
        return res.status(500).json({ message: "Server error" });
    }
};  
