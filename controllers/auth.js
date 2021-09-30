exports.getLogin = (req, res, next) => {
    //res.cookie('loggedIn', 'true', { path: '/'});
    //console.log('cookie:' ,req.get('Cookie'));
    //let isLoggedIn = true;;
    //console.log(req.get('Cookie'));
    //f (req.get('Cookie') !== undefined) isLoggedIn = req.get('Cookie').split('=')[1];
    //req.isLoggedIn = isLoggedIn;
    //console.log(isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        isAuthenticated: req.isLoggedIn,
        pageTitle: 'Login'
    });
};

exports.postLogin = (req, res, next) => {
    let isLoggedIn = false;
    if (req.get('Cookie') !== undefined) isLoggedIn = req.get('Cookie').split('=')[1];
    else {
    isLoggedIn = true;
    }
    req.isLoggedIn = isLoggedIn;
    res.setHeader('Set-Cookie', 'loggedIn=true');
    //console.log('postLogin: ',isLoggedIn);
    //req.isLoggedIn = isLoggedIn;
    res.redirect('/');
};