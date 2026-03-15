const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

const dashboardController = require('../controllers/dashboardController');
const ordersController = require('../controllers/ordersController');
const customersController = require('../controllers/customersController');

router.get('/', isAuthenticated, dashboardController.showDashboard);
router.get('/dashboard', isAuthenticated, dashboardController.showDashboard);
router.get('/orders', isAuthenticated, ordersController.showOrders);
router.get('/customers', isAuthenticated, customersController.showCustomers);

module.exports = router;
