const db = require('./db');

exports.getAll = () => {
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all()
};

exports.getById = (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id)
};

exports.getByUsername = (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
};

exports.createUser = (username, hashedPassword) => {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    return stmt.run(username, hashedPassword);
};
