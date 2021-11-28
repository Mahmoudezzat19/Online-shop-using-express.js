//this comment from the ubuntu machine
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const csurf = require('csurf');

const session = require('express-session');
const mysql2 = require('mysql2/promise');
const mySQLStore = require('express-mysql-session')(session);

const errorController = require('./controllers/error');

const db = require('./util/database');

//Model objects for database association.
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

//const csurfProtection = csurf();

//views


app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//options object for mysql connection.
const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Mbatsh191718',
    database: 'node-complete'
};

//mysql2 connection pool.
const connection = mysql2.createPool(options);

//mysql sessionStore for the session middleware
const sessionStore = new mySQLStore({}, connection);


//session middleware
app.use(session({
    secret: 'my secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

//app.use(csurfProtection);

//middleware to convert user object into user model.
app.use((req, res, next) => {
    if(req.session.user !== undefined) {
        const sessionUser = User.build({...req.session.user});
        req.session.sessionUser = sessionUser;
    }
    next();
});

//Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// User, product associations
User.hasMany(Product, {constraints: true, onDelete: 'CASCADE'});
Product.belongsTo(User);

//User, Cart associations
User.hasOne(Cart, {constraints: true, onDelete: 'CASCADE'});
Cart.belongsTo(User);

//Cart, Product associations.
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

//User, Order associations.
User.hasMany(Order);
Order.belongsTo(User);

//Order, Product associations.
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

//Database.
db.sync().then(result => {
    const user = User.findByPk(1);
    return user;
}).then(user => {
    if (!user) {
        User.create({name: 'Ragai', email: 'ragai@gmail.com', password: 'ali'});
    }
    return user;
}).then(user => {
    //console.log(user);
    app.listen(3000);
})
.catch(error => {
    console.log(error);
})


