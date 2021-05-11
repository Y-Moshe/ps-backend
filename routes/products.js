const express = require('express');

const controllers = require('../controllers/products');
const { upload } = require('../functions');
const { checkRole, jwtAuth } = require('../middlewares');

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

const routes = express.Router();

// GET: /api/v@/products
routes.get( '', controllers.getProducts );

// GET: /api/v@/products/random
routes.get( '/random', controllers.get3RandomProducts );

// GET: /api/v@/products/:id
routes.get( '/:id', controllers.getProduct );

// POST: /api/v@/products (Protected, Admin Route)
routes.post( '', jwtAuth, checkRole(2), upload.single('image'), controllers.addProduct );

// PATCH: /api/v@/products/:id (Protected, Admin Route)
routes.patch( '/:id', jwtAuth, checkRole(2), upload.single('image'), controllers.editProduct );

// DELETE: /api/v@/products/:id (Protected, Admin Route)
routes.delete( '/:id', jwtAuth, checkRole(2), controllers.deleteProduct );

/***** Comments Ralated routes *****/

// GET: /api/v@/products/:id/comments
routes.get( '/:id/comments', controllers.getProductComments );

// POST: /api/v@/products/:id/comments (Protected)
routes.post( '/:id/comments', jwtAuth, controllers.addCommentToProduct );

module.exports = routes;
