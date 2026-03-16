const db = require('./db');

// Create table if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS report_comments (
        section TEXT PRIMARY KEY,
        comment TEXT NOT NULL DEFAULT '',
        updated_by TEXT,
        updated_at TEXT
    )
`).run();

exports.getComment = (section) => {
    const stmt = db.prepare('SELECT * FROM report_comments WHERE section = ?');
    return stmt.get(section);
};

exports.upsertComment = (section, comment, username) => {
    const stmt = db.prepare(`
        INSERT INTO report_comments (section, comment, updated_by, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(section) DO UPDATE SET
            comment = excluded.comment,
            updated_by = excluded.updated_by,
            updated_at = excluded.updated_at
    `);
    stmt.run(section, comment, username);
};
