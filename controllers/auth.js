const User = require('../models/user');
const bcrypt = require('bcryptjs');

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

exports.postSignup = async (req, res, next) => {
    //store a new user in the database.
    //check if user exists or not.
    //check if unique password.
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    hashedPassword = await bcrypt.hash(userPassword, 12);
    const confirmPassword = req.body.confirmPassword;
    const user = await User.findOne({where: {email: userEmail}});
    if (user === null) {
        await User.create({
            name: userName,
            email: userEmail,
            password: hashedPassword
        });
        return res.redirect('/login');
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}