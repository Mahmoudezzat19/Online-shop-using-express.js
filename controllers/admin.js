const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
      isAuthenticated: req.session.isLoggedIn,
    editing: false
  });
};

//title, imageUrl, price, description, 
//create new product from admin
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    UserId: req.user.id
  }).then(result => {
    console.log('product from admin created successfully');
  }).catch(error => {
    console.log(error);
  })

  res.redirect('/');
};

//fetch product with Id == prodId
exports.getEditProduct = (req, res, next) => {
  editMode = req.query.edit;
  if (!editMode) res.redirect('/admin/products');
  const productId = req.params.productId;
  console.log(productId);
  req.user.getProducts( {where: { id: productId } }).then(products => {
    const product = products[0];
    if (!product) res.redirect('/');
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isAuthenticated: req.isLoggedIn
    });
  }).catch(error => console.log(error)); 
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  const updated_product = {
    id: prodId,
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImageUrl,
    description: updatedDesc,
    userId: req.user.id
  }
  Product.update(updated_product, {
    where: {
      id: prodId
    }
  }).then(result => {
    res.redirect('/admin/products');
  }).catch(error => console.log(error));
  
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn
    });
  }).catch(error => {
    console.log(error);
  })
  //res.redirect('/admin');
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({
    where: {id: prodId}
  }).then(result => res.redirect('/admin/products'))
    .catch(error => console.log(error));
};
