const orderModel = require('../models/orderModel');
const reportCommentModel = require('../models/reportCommentModel');

exports.showReports = (req, res) => {
    const monthlyRevenue = orderModel.getMonthlyRevenue();
    const ordersByStatus = orderModel.getOrdersByStatus();
    const revenueByRegion = orderModel.getRevenueByRegion();

    const comments = {
        revenue: reportCommentModel.getComment('revenue'),
        orders: reportCommentModel.getComment('orders'),
        regional: reportCommentModel.getComment('regional'),
    };

    res.render('reports', {
        user: req.session.user,
        monthlyRevenue: JSON.stringify(monthlyRevenue),
        ordersByStatus: JSON.stringify(ordersByStatus),
        revenueByRegion: JSON.stringify(revenueByRegion),
        monthlyRevenueTable: monthlyRevenue,
        ordersByStatusTable: ordersByStatus,
        revenueByRegionTable: revenueByRegion,
        comments,
    });
};

exports.saveComment = (req, res) => {
    const { section, comment } = req.body;
    const allowed = ['revenue', 'orders', 'regional'];
    if (!allowed.includes(section)) {
        return res.status(400).send('Invalid section');
    }
    reportCommentModel.upsertComment(section, comment, req.session.user.username);
    res.redirect('/reports#' + section);
};
