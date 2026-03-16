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

exports.showSignup = (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("signup", { error: null });
};

exports.handleSignup = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.render("signup", { error: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.render("signup", { error: "Passwords do not match" });
  }
  if (password.length < 6) {
    return res.render("signup", { error: "Password must be at least 6 characters" });
  }

  const existing = userModel.getByUsername(username);
  if (existing) {
    return res.render("signup", { error: "Username already taken" });
  }

  const hashed = await bcrypt.hash(password, 10);
  userModel.createUser(username, hashed, "viewer", []);

  const user = userModel.getByUsername(username);
  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    sections: [],
  };
  res.redirect("/reports");
};

exports.handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/login");
  });
};
