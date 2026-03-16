const db = require("./db");

exports.getAll = () => {
  return db.prepare("SELECT id, username, role, sections FROM users").all();
};

exports.getById = (id) => {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
};

exports.getByUsername = (username) => {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
};

exports.createUser = (username, hashedPassword, role, sections) => {
  return db
    .prepare(
      "INSERT INTO users (username, password, role, sections) VALUES (?, ?, ?, ?)",
    )
    .run(username, hashedPassword, role, JSON.stringify(sections || []));
};

exports.updateUser = (id, role, sections) => {
  return db
    .prepare("UPDATE users SET role = ?, sections = ? WHERE id = ?")
    .run(role, JSON.stringify(sections || []), id);
};

exports.deleteUser = (id) => {
  return db.prepare("DELETE FROM users WHERE id = ?").run(id);
};

exports.updatePassword = (id, hashedPassword) => {
  return db
    .prepare("UPDATE users SET password = ? WHERE id = ?")
    .run(hashedPassword, id);
};
