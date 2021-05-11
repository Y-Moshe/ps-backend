const passport = require('passport');
const fs = require('fs');

const { Product, Comment } = require('../models');
const { getPopulateQuery } = require('../utils');
function deleteSavedImage(path, res) {
  // Delete the file only if it's exists!
  if (fs.existsSync(path)) {
    fs.unlink(path, error => {
      if (error) {
        console.log(error);
      }
    });
  }

  if (res) {
    return res.status(401).json({
      message: 'You are not allowed to use this route!'
    });
  }
}

// GET: /api/products
exports.getProducts = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'category', 'comments');
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const category = req.query.category;

  if (!category || !currentPage || !pageSize) {
    return res.status(400).json({
      message: 'Expecting query params to be sent!'
    });
  }

  let query = Product.find({ category });

  // Give the exact amount of products per page, skip previous.
  query.skip(pageSize * (currentPage - 1)).limit(pageSize);

  if (category === 'all') {
    query = Product.find();
  }

  query.populate(populateQuery).then(result => {
    res.status(200).json({
      products: result,
      total: result.length
    });
  }).catch(error => next( error ));
};

// GET: /api/products/random
exports.get3RandomProducts = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'category', 'comments');

  Product.countDocuments().then(count => {
    if (count <= 3) {
      return res.status(204).json({
        message: 'there\'s no products, at least 4 is required'
      });
    }

    let random = Math.floor(Math.random() * count) - 3;
    while(random < 0) {
      random = Math.floor(Math.random() * count) - 3;
    }

    Product.find()
      .skip(random).limit(3).populate(populateQuery)
      .then(result => {
      res.status(200).json({
        products: result
      });
    }).catch(error => next( error ));
  });
};

// GET: /api/products/:id
exports.getProduct = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'category', 'comments');
  const productId = req.params.id;

  Product.findOne({ _id: productId }).populate(populateQuery)
    .then(product => res.status(200).json( product ))
    .catch(error => next( error ));
};

// POST: /api/products (Protected, Admin Route)
exports.addProduct = (req, res, next) => {
  // If the user is not admin quit and remove product image!
  if (!req.user || req.user.role.rank < 2) {
    return deleteSavedImage(req.file.path, res);
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: +req.body.price,
    category: req.body.categoryId,
    content: req.body.content
  });

  product.imagePath = process.env.AWS_URL.concat('/', req.file.key);

  product.save().then(() => {
    res.status(201).json({
      message: 'The Product has been added successfully!'
    });
  }).catch(error => {
    deleteSavedImage(req.file.path, res);
    next(error);
  });
};

// PATCH: /api/products/:id (Protected, Admin Route)
exports.editProduct = (req, res, next) => {
  // If the user is not admin quit and remove product image!
  if (!req.user || req.user.role.rank < 2) {
    return deleteSavedImage(req.file.path, res);
  }

  const productId = req.params.id;
  const oldImagePath = req.body.imagePath;
  let imagePath = oldImagePath;

  if (req.file) {
    imagePath = req.protocol + '://' + req.get('host').concat('/images/', req.file.filename); // for Localhost
    // imagePath = process.env.AWS_URL.concat('/', req.file.key);
  }

  Product.updateOne({ _id: productId }, {
    name: req.body.name,
    description: req.body.description,
    price: +req.body.price,
    categoryId: req.body.categoryId,
    content: req.body.content,
    imagePath: imagePath
   }).then(() => {
    deleteSavedImage(oldImagePath);

    res.status(200).json({
      message: 'The Product has been updated successfully!'
    });
   }).catch(error => {
    deleteSavedImage(req.file.path, res);
    next(error);
   });
};

// DELETE: /api/products/:id (Admin Route)
exports.deleteProduct = (req, res, next) => {
  const productId = req.params.id;
  let imagePath;
  Product.findOne({ _id: productId }).then(product => imagePath = product.imagePath);

  Comment.deleteMany({ product: productId }).then(() => {
    Product.deleteOne({ _id: productId }).then(() => {
      deleteSavedImage(imagePath);

      res.status(200).json({
        message: 'The Product has been deleted successfully!'
      });
    }).catch(error => next( error ));
  }).catch(error => next( error ));
};

// ********************* Comments Ralated controllers *********************

// GET: /api/products/:id/comments
exports.getProductComments = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'user', 'product');
  const productId = req.params.id;

  Comment.find({ product: productId }).populate(populateQuery)
    .then(comments => res.status(200).json( comments ))
    .catch(error => next( error ))
};

// POST: /api/products/:id/comments
exports.addCommentToProduct = (req, res, next) => {
  const { date, text } = req.body;
  const productId = req.params.id;
  const userId = req.user._id;

  new Comment({
    date,
    text,
    user: userId,
    product: productId
  }).save().then(() => {
    res.status(200).json({
      message: 'The Comment has been added successfully!'
    });
  }).catch(err => next( err ));
}
