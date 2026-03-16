const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.showLogin = (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("login", { error: null });
};

exports.handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("login", { error: "All fields are required" });
  }

  const user = userModel.getByUsername(username);
  if (!user) {
    return res.render("login", { error: "Invalid username or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.render("login", { error: "Invalid username or password" });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    sections: JSON.parse(user.sections || "[]"),
  };

  if (user.role === "viewer") return res.redirect("/reports");
  if (user.role === "superadmin") return res.redirect("/admin");
  res.redirect("/dashboard");
};

exports.handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/login");
  });
};
