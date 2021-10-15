const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Cart = require('../models/cart');
const { findOrCreate } = require('../models/product');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        isAuthenticated: req.session.isLoggedIn,
        pageTitle: 'Login'
    });
};  

exports.postLogin = async (req, res, next) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const user = await User.findOne({where: {email: userEmail}});
    if (user) {
        const password = await bcrypt.compare(userPassword, user.password);
        if (password) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return res.redirect('/');
        }
    }
    res.redirect('/login');
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
}

exports.postSignup = async (req, res, next) => {
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    hashedPassword = await bcrypt.hash(userPassword, 12);
    const confirmPassword = req.body.confirmPassword;
    const user = await User.findOne({where: {email: userEmail}});
    if (user === null) {
        const new_user = await User.create({
            name: userName,
            email: userEmail,
            password: hashedPassword
        });
        
        const cart = await Cart.create({UserId: new_user.id});
          console.log('cart: ', cart);
        return res.redirect('/login');
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}