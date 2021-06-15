const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
      });
    });
  };

  exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
          prods: products,
          pageTitle: 'main page',
          path: '/',
        });
      });
  };

  exports.getCart = (req, res, next) => {
      res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'cart'
      });
  };

  exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'orders'
    });
};

  exports.getCheckout = (req, res, next) => {
      res.render('shop/checkout', {
          path: '/checkout',
          pageTitle: 'checkout'
      })
  };

exports.getProduct = (req, res, next) => {
  product_id = req.params.productId;
  Product.findById(product_id, product => {
    res.render('shop/product-detail', {
      
    });
  })
  
}

