const Product = require('../models/product');

// get request to show the edit-product page with query parameter edit = false
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

// post request to add product
exports.postAddProduct  = (req, res, next) => {
  const product_title = req.body.title;
  const product_price = req.body.price;
  const product_description = req.body.description;
  const product_imageUrl = req.body.imageUrl;

  Product.create({
    title: product_title,
    description: product_description,
    price: product_price,
    imageUrl: product_imageUrl
  })
  .then(result => {
    console.log(result);
    res.redirect('/admin');
  })
  .catch(err => {
    console.log(err);
  });

}

// Edit product with params = prodId and query parameter edit = false.
// if prodId is not found in the Database the response with redirect to '/'.
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
  .then(product => {
    if (typeof product === 'undefined') {
      return res.redirect('/');
    } else {
      res.render('admin/edit-product', {
        pageTitle: product.title,
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    }
  })
  .catch(err => {
    console.log(err);
  })
};

// post request to edit product with parameter prodId
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  Product.update({
    title: updatedTitle,
    price: updatedPrice,
    description: updatedDesc,
    imageUrl: updatedImageUrl
  }, {
    where: {
      id: prodId
    }
  }).then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  })
};

// get request to get all products to admin/products
exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => {
    console.log(err);
  })
};

// post request to delete a product with pk = prodId
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({
    where: {
      id: prodId
    }
  })
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch((err) => {
    console.log(err);
  })
};
