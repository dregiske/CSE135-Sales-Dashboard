require("dotenv").config();
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");

const db = new Database("./database.db");

// ── Create Tables ─────────────────────────────────
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
	role TEXT NOT NULL DEFAULT 'viewer',
	sections TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        region TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        product TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL,
        order_date TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
`);

// ── Migrate existing users table if columns missing ──
const cols = db.pragma("table_info(users)").map((c) => c.name);
if (!cols.includes("role")) {
  db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'viewer'`);
  console.log("Migrated: added role column");
}
if (!cols.includes("sections")) {
  db.exec(`ALTER TABLE users ADD COLUMN sections TEXT NOT NULL DEFAULT '[]'`);
  console.log("Migrated: added sections column");
}

// ── Seed Users ────────────────────────────────────

const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, password, role, sections) 
    VALUES (?, ?, ?, ?)
`);

// Super Admin
insertUser.run(
  "superadmin",
  bcrypt.hashSync("super123", 10),
  "superadmin",
  JSON.stringify(["revenue", "products", "regional"]),
);

// Example analyst Sam
insertUser.run(
  "sam",
  bcrypt.hashSync("sam123", 10),
  "analyst",
  JSON.stringify(["revenue", "products"]),
);

// Example analyst Sally
insertUser.run(
  "sally",
  bcrypt.hashSync("sally123", 10),
  "analyst",
  JSON.stringify(["revenue", "regional"]),
);

// Viewer
insertUser.run(
  "viewer",
  bcrypt.hashSync("viewer123", 10),
  "viewer",
  JSON.stringify([]),
);

// ── Seed Customers ────────────────────────────────
const insertCustomer = db.prepare(`
    INSERT OR IGNORE INTO customers (id, name, email, region) 
    VALUES (?, ?, ?, ?)
`);

const customers = [
  [1, "John Smith", "john@email.com", "North"],
  [2, "Jane Doe", "jane@email.com", "South"],
  [3, "Bob Johnson", "bob@email.com", "East"],
  [4, "Alice Brown", "alice@email.com", "West"],
  [5, "Charlie Davis", "charlie@email.com", "North"],
  [6, "Diana Wilson", "diana@email.com", "South"],
  [7, "Edward Moore", "edward@email.com", "East"],
  [8, "Fiona Taylor", "fiona@email.com", "West"],
];

customers.forEach((c) => insertCustomer.run(...c));

// ── Seed Orders ───────────────────────────────────
const insertOrder = db.prepare(`
    INSERT OR IGNORE INTO orders (id, customer_id, product, amount, status, order_date)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const orders = [
  [1, 1, "Widget A", 299.99, "completed", "2024-01-05"],
  [2, 2, "Widget B", 149.99, "pending", "2024-01-10"],
  [3, 3, "Widget C", 399.99, "completed", "2024-01-15"],
  [4, 4, "Widget D", 199.99, "cancelled", "2024-01-20"],
  [5, 5, "Widget A", 299.99, "completed", "2024-02-01"],
  [6, 6, "Widget B", 149.99, "completed", "2024-02-05"],
  [7, 7, "Widget C", 399.99, "pending", "2024-02-10"],
  [8, 8, "Widget D", 199.99, "completed", "2024-02-14"],
  [9, 1, "Widget E", 499.99, "completed", "2024-02-20"],
  [10, 2, "Widget A", 299.99, "cancelled", "2024-03-01"],
  [11, 3, "Widget B", 149.99, "completed", "2024-03-05"],
  [12, 4, "Widget C", 399.99, "completed", "2024-03-10"],
  [13, 5, "Widget D", 199.99, "pending", "2024-03-15"],
  [14, 6, "Widget E", 499.99, "completed", "2024-03-20"],
  [15, 7, "Widget A", 299.99, "completed", "2024-03-25"],
  [16, 8, "Widget B", 149.99, "completed", "2024-04-01"],
  [17, 1, "Widget C", 399.99, "cancelled", "2024-04-05"],
  [18, 2, "Widget D", 199.99, "completed", "2024-04-10"],
  [19, 3, "Widget E", 499.99, "completed", "2024-04-15"],
  [20, 4, "Widget A", 299.99, "pending", "2024-04-20"],
];

orders.forEach((o) => insertOrder.run(...o));

console.log("Database seeded successfully");
console.log("superadmin / super123  (role: superadmin)");
console.log("sam        / sam123    (role: analyst — revenue, products)");
console.log("sally      / sally123  (role: analyst — revenue, regional)");
console.log("viewer     / viewer123 (role: viewer)");
