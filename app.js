const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const session = require('express-session');
const mysql2 = require('mysql2/promise');
const mySQLStore = require('express-mysql-session')(session);

const errorController = require('./controllers/error');

const db = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Mbatsh191718',
    database: 'node-complete'
};

const connection = mysql2.createPool(options);
const sessionStore = new mySQLStore({}, connection);

//session middleware
app.use(session({
    secret: 'my secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

//adding user where ID == 1 to every request
app.use((req, res, next) => {
    let isLoggedIn = undefined;
    if (req.get('Cookie') !== undefined) isLoggedIn = req.get('Cookie').split('=')[1];
    req.isLoggedIn = isLoggedIn;
    User.findByPk(1).then(user => {
        req.user = user;
        //console.log(user);
        next();
    })
    .catch(error => console.log(error));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// User, product association
User.hasMany(Product, {constraints: true, onDelete: 'CASCADE'});
Product.belongsTo(User);

User.hasOne(Cart, {constraints: true, onDelete: 'CASCADE'});
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

db.sync().then(result => {
    const user = User.findByPk(1);
    return user;
}).then(user => {
    if (!user) {
        User.create({name: 'Ragai', email: 'ragai@gmail.com'});
    }
    return user;
}).then(user => {
    //console.log(user);
    app.listen(3000);
})
.catch(error => {
    console.log(error);
})


