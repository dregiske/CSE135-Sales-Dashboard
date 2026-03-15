const db = require('./db');

exports.getTotalRevenue = () => {
    const stmt = db.prepare(`
	SELECT SUM(amount) as total_revenue
	FROM orders
	WHERE status = 'completed'
    `);
    const result = stmt.get();
    return result.total_revenue || 0;
};

exports.getTotalOrders = () => {
    const stmt = db.prepare(`
	SELECT COUNT(*) as total_orders
	FROM orders
    `);
    const result = stmt.get();
    return result.total_orders || 0;
};

exports.getPendingOrders = () => {
    const stmt = db.prepare(`
	SELECT COUNT(*) as pending_orders
	FROM orders
	WHERE status = 'pending'
    `);
    const result = stmt.get();
    return result.pending_orders || 0;
};

exports.getMonthlyRevenue = () => {
    const stmt = db.prepare(`
        SELECT 
            strftime('%Y-%m', order_date) as month,
            SUM(amount) as total_revenue
        FROM orders
        WHERE status = 'completed'
        GROUP BY month
        ORDER BY month ASC
    `);
    return stmt.all();
};

exports.getOrdersByStatus = () => {
    const stmt = db.prepare(`
        SELECT 
            status,
            COUNT(*) as count
        FROM orders
        GROUP BY status
    `);
    return stmt.all();
};

exports.getRevenueByRegion = () => {
    const stmt = db.prepare(`
        SELECT 
            customers.region,
            SUM(orders.amount) as total_revenue
        FROM orders
        JOIN customers ON orders.customer_id = customers.id
        WHERE orders.status = 'completed'
        GROUP BY customers.region
        ORDER BY total_revenue DESC
    `);
    return stmt.all();
};

exports.getAll = () => {
    const stmt = db.prepare(`
        SELECT 
            orders.*,
            customers.name as customer_name
        FROM orders
        JOIN customers ON orders.customer_id = customers.id
        ORDER BY order_date DESC
    `);
    return stmt.all();
};
