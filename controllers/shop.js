const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const Order = require('../models/order');
const { findOrCreate } = require('../models/product');

// view /products
exports.getProducts = (req, res, next) => {
  console.log('products page authentication: ', req.isLoggedIn);
  console.log('products page cookies',req.get('Cookie'));
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    });
  }).catch(error => {
    console.log(error);
  })
};

// view /product/productId
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    }); 
  }).catch(error => console.log(error));
};

// view main page
exports.getIndex = (req, res, next) => {
  console.log('shop page authentication: ', req.session.isLoggedIn);
  console.log('shop page cookies',req.get('Cookie'));
  Product.findAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated: req.session.isLoggedIn
    });
  }).catch(error => {
    console.log(error);
  })
};

//get all products in the cart related to the user 
exports.getCart = async (req, res, next) => {
  const [cart, created] = await Cart.findOrCreate({
    where: {
      UserId: req.session.sessionUser.id, 
    },
    defaults: {
      UserId: req.session.sessionUser.id
    }
  });
  const products = await cart.getProducts();
  let total_price = 0;
  for (let i = 0; i < products.length; i++) total_price = total_price + products[i].price * products[i].CartItem.quantity;
  cart.getProducts().then(cartProducts => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts,
      totalPrice: total_price,
      isAuthenticated: req.session.isLoggedIn
    });
  }).catch(error => console.log(error));
};

//add new or existed product to cart.
exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;
  console.log('product Id in the index page: ', productId);
  let new_quantity = 1;
  //console.log('user cart: ', req.session.sessionUser);
  const fetchedCart = await req.session.sessionUser.getCart();
  const cartProduct = await fetchedCart.getProducts({where: {id: productId}});
  const product = cartProduct.length > 0 && cartProduct[0];
  const fetchedProduct = await Product.findByPk(productId);

  if (product) {
    new_quantity = product.CartItem.quantity;
    new_quantity = new_quantity + 1;
  }
  fetchedCart.addProduct(fetchedProduct, {
    through: {quantity: new_quantity}
  })
  res.redirect('/cart');
};

//Delete Product by ID.
exports.postCartDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const fetchedCart = await req.session.sessionUser.getCart();
  const cartItems = await fetchedCart.getProducts({where: {id: productId}});
  cartItem = cartItems[0];
  await cartItem.destroy();
  res.redirect('/');
};
//TODO

//create order
exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    //put cart-products into order-items;
    const new_order = await req.session.user.createOrder({statues: false});
    await new_order.addProducts(products.map(product => {
      product.OrderItem = {quantity: product.CartItem.quantity};
      return product;
    }));
    await cart.setProducts(null);
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
}

//todo
exports.getOrders = async (req, res, next) => {
  const orders = await req.session.sessionUser.getOrders();
  console.log('orders:::: ', orders);
  res.render('shop/orders', {
    orders: orders,
    path: '/orders',
    pageTitle: 'Your Orders',
    isAuthenticated: req.session.isLoggedIn
  });
};

//TODO
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.session.isLoggedIn
  });
};
