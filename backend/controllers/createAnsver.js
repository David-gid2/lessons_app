import db from "../db/connectdb.js";





const createAnsver = (link_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM lessons WHERE link_id = ?';
        db.get(sql, [link_id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row); // повертаємо знайдений рядок або undefined
            }
        });
    });
};

export default createAnsver;