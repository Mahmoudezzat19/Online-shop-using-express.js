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

    //const sessionUser = User.build({...user});
    //req.session.sessionUser = sessionUser;
    req.session.user = user;

    console.log("user info stored in the session: ", req.session.user);
    
    req.session.isLoggedIn = true;
    res.redirect('/');
};