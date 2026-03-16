const express = require("express");
const router = express.Router();
const { isAuthenticated, requireRole } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.use(isAuthenticated, requireRole("superadmin"));

router.get("/", adminController.showDashboard);
router.get("/users", adminController.listUsers);
router.get("/users/new", adminController.showNewUser);
router.post("/users/new", adminController.createUser);
router.get("/users/:id/edit", adminController.showEditUser);
router.post("/users/:id/edit", adminController.updateUser);
router.post("/users/:id/delete", adminController.deleteUser);

module.exports = router;
