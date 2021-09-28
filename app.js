const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//adding user where ID == 1 to every request
app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        console.log(user);
        next();
    })
    .catch(error => console.log(error));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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
    console.log(user);
    app.listen(3000);
})
.catch(error => {
    console.log(error);
})


