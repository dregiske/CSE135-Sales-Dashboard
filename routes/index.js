const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  requireRole,
  requireSection,
} = require("../middleware/auth");

const dashboardController = require("../controllers/dashboardController");
const ordersController = require("../controllers/ordersController");
const customersController = require("../controllers/customersController");
const reportsController = require("../controllers/reportsController");
const exportController = require("../controllers/exportController");

router.get("/reports", isAuthenticated, reportsController.showReports);
router.post("/reports/comment", isAuthenticated, requireRole(["superadmin", "analyst"]), reportsController.saveComment);
router.get("/reports/export", isAuthenticated, requireRole(["superadmin", "analyst"]), exportController.exportReportsPDF);

router.get(
  "/",
  isAuthenticated,
  requireRole(["superadmin", "analyst"]),
  dashboardController.showDashboard,
);
router.get(
  "/dashboard",
  isAuthenticated,
  requireRole(["superadmin", "analyst"]),
  dashboardController.showDashboard,
);
router.get(
  "/orders",
  isAuthenticated,
  requireRole(["superadmin", "analyst"]),
  ordersController.showOrders,
);
router.get(
  "/customers",
  isAuthenticated,
  requireRole(["superadmin", "analyst"]),
  customersController.showCustomers,
);

module.exports = router;
