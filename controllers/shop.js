const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const Order = require('../models/order');
const { findOrCreate } = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(error => {
    console.log(error);
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  }).catch(error => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(error => {
    console.log(error);
  })
};

//get all products in the cart related to the user 
exports.getCart = async (req, res, next) => {
  const [cart, created] = await Cart.findOrCreate({
    where: {
      UserId: req.user.id, 
    },
    defaults: {
      UserId: req.user.id
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
      totalPrice: total_price
    });
  }).catch(error => console.log(error));
};

//todo refactor and understand
exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;
  let new_quantity = 1;
  const fetchedCart = await req.user.getCart();
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

exports.postCartDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const fetchedCart = await req.user.getCart();
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
    const new_order = await req.user.createOrder({statues: false});
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

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders();
  res.render('shop/orders', {
    orders: orders,
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

//TODO
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
