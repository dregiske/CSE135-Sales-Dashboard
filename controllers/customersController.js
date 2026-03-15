const customerModel = require('../models/customerModel');

exports.showCustomers = (req, res) => {
    const customers = customerModel.getAll();
    res.render('customers', {
	user: req.session.user,
	customers
    });
};
