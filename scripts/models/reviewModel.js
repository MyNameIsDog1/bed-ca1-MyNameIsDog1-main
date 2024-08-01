const db = require('../database/db'); // Adjust the path as necessary

module.exports.insertSingle = (data, callback) => {
    const query = 'INSERT INTO Reviews (user_id, review_amt, comment, username) VALUES (?, ?, ?, ?)';
    db.query(query, [data.user_id, data.review_amt, data.comment, data.username], callback);
};

module.exports.selectById = (data, callback) => {
    const query = 'SELECT * FROM Reviews WHERE id = ?';
    db.query(query, [data.id], callback);
};

module.exports.selectAll = (callback) => {
    const query = 'SELECT * FROM Reviews';
    db.query(query, callback);
};

module.exports.updateById = (data, callback) => {
    const query = 'UPDATE Reviews SET review_amt = ?, comment = ? WHERE id = ?';
    db.query(query, [data.review_amt, data.comment, data.id], callback);
};

module.exports.deleteById = (data, callback) => {
    const query = 'DELETE FROM Reviews WHERE id = ?';
    db.query(query, [data.id], callback);
};

module.exports.getReviewCounts = (callback) => {
    const query = 'SELECT review_amt, COUNT(*) as count FROM Reviews GROUP BY review_amt';
    db.query(query, callback);
};
