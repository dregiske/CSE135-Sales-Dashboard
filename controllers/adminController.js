const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const SECTIONS = ["revenue", "regional", "orders"];

exports.showDashboard = (req, res) => {
  const users = userModel.getAll();
  res.render("admin/index", {
    user: req.session.user,
    users,
    sections: SECTIONS,
  });
};

exports.listUsers = (req, res) => {
  const users = userModel.getAll();
  res.render("admin/index", {
    user: req.session.user,
    users,
    sections: SECTIONS,
  });
};

exports.showNewUser = (req, res) => {
  res.render("admin/user-form", {
    user: req.session.user,
    editUser: null,
    sections: SECTIONS,
    error: null,
  });
};

exports.createUser = async (req, res) => {
  const { username, password, role, sections } = req.body;
  if (!username || !password || !role) {
    return res.render("admin/user-form", {
      user: req.session.user,
      editUser: null,
      sections: SECTIONS,
      error: "All fields are required",
    });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const selectedSections = Array.isArray(sections)
      ? sections
      : sections
        ? [sections]
        : [];
    userModel.createUser(username, hashed, role, selectedSections);
    res.redirect("/admin/users");
  } catch (err) {
    res.render("admin/user-form", {
      user: req.session.user,
      editUser: null,
      sections: SECTIONS,
      error: "Username already exists",
    });
  }
};

exports.showEditUser = (req, res) => {
  const editUser = userModel.getById(req.params.id);
  if (!editUser) return res.redirect("/admin/users");
  editUser.sections = JSON.parse(editUser.sections || "[]");
  res.render("admin/user-form", {
    user: req.session.user,
    editUser,
    sections: SECTIONS,
    error: null,
  });
};

exports.updateUser = async (req, res) => {
  const { role, sections, password } = req.body;
  const id = req.params.id;
  const selectedSections = Array.isArray(sections)
    ? sections
    : sections
      ? [sections]
      : [];
  userModel.updateUser(id, role, selectedSections);
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    userModel.updatePassword(id, hashed);
  }
  res.redirect("/admin/users");
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  if (parseInt(id) === req.session.user.id) {
    return res.redirect("/admin/users");
  }
  userModel.deleteUser(id);
  res.redirect("/admin/users");
};
