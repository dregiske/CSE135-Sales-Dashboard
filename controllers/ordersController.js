const orderModel = require('../models/orderModel');

exports.showOrders = (req, res) => {
    const orders = orderModel.getAll();
    res.render('orders', {
	user: req.session.user,
	orders
    });
};
