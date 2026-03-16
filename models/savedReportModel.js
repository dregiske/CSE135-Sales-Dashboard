const db = require('./db');

db.prepare(`
    CREATE TABLE IF NOT EXISTS saved_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        exported_by TEXT NOT NULL,
        exported_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
`).run();

exports.create = (filename, exportedBy) => {
    db.prepare(`
        INSERT INTO saved_reports (filename, exported_by)
        VALUES (?, ?)
    `).run(filename, exportedBy);
};

exports.getAll = () => {
    return db.prepare(`
        SELECT * FROM saved_reports ORDER BY exported_at DESC
    `).all();
};
