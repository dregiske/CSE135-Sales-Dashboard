const customerModel = require('../models/customerModel');
const orderModel = require('../models/orderModel');

exports.showDashboard = (req, res) => {
    const totalRevenue = orderModel.getTotalRevenue();
    const totalOrders = orderModel.getTotalOrders();
    const totalCustomers = customerModel.getTotalCustomers();
    const pendingOrders = orderModel.getPendingOrders();

    const monthlyRevenue = orderModel.getMonthlyRevenue();
    const ordersByStatus = orderModel.getOrdersByStatus();
    const revenueByRegion = orderModel.getRevenueByRegion();

    res.render('dashboard', {
	user: req.session.user,

	totalRevenue,
	totalOrders,
	totalCustomers,
	pendingOrders,

	monthlyRevenue: JSON.stringify(monthlyRevenue),
	ordersByStatus: JSON.stringify(ordersByStatus),
	revenueByRegion: JSON.stringify(revenueByRegion)
    });
};
