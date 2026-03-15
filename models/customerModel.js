const db = require('./db');

exports.getTotalCustomers = () => {
    const stmt = db.prepare(`
	SELECT COUNT(*) as total_customers
	FROM customers
    `);
    const result = stmt.get();
    return result.total_customers || 0;
};

exports.getAll = () => {
    const stmt = db.prepare(`
	SELECT * FROM customers
	ORDER BY name ASC
    `);
    return stmt.all();
};

exports.getById = (id) => {
    const stmt = db.prepare(`
	SELECT * FROM customers
	WHERE id = ?
    `);
    return stmt.get(id);
};
