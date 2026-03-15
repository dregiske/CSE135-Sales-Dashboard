const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.showLogin = (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('login', { error: null });
};

exports.handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
	return res.render('login', { error: 'All fields are required' });
    }

    const user = userModel.getByUsername(username);
    if(!user) {
	return res.render('login', { error: 'Invalid username or password'});
    }

    const match_pass = await bcrypt.compare(password, user.password);
    if(!match_pass) {
	return res.render('login', { error: 'Invalid username or password' });
    }

   req.session.user = { id: user.id, username: user.username };
   res.redirect('/dashboard');
};

exports.handleLogout = (req, res) => {
    req.session.destroy((err) => {
	if(err) console.log(err);
	res.redirect('/login');
    });
};
