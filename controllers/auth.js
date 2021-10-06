const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        isAuthenticated: req.session.isLoggedIn,
        pageTitle: 'Login'
    });
};

exports.postLogin = async (req, res, next) => {
    const user = await User.findByPk(1);

    req.session.user = user;

    console.log("user info stored in the session: ", req.session.user);
    
    req.session.isLoggedIn = true;
    res.redirect('/');
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
}

exports.postSignup = (req, res, next) => {}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}