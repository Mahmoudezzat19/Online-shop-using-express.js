exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        isAuthenticated: req.session.isLoggedIn,
        pageTitle: 'Login'
    });
};

exports.postLogin = (req, res, next) => {
    
   req.session.isLoggedIn = true;
    res.redirect('/');
};