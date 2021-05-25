const express = require('express');

const controllers = require('../controllers/products');
const { upload } = require('../functions');
const { authenticate, authorize, Roles } = require('../middlewares');

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

// POST: /api/v@/products (Protected)
routes.post( '', authenticate, authorize( Roles.EDITOR ), upload.single('image'), controllers.addProduct );

// PATCH: /api/v@/products/:id (Protected)
routes.patch( '/:id', authenticate, authorize( Roles.EDITOR ), upload.single('image'), controllers.editProduct );

// DELETE: /api/v@/products/:id (Protected)
routes.delete( '/:id', authenticate, authorize( Roles.ADMINISTRATOR ), controllers.deleteProduct );

/***** Comments Ralated routes *****/

// GET: /api/v@/products/:id/comments
routes.get( '/:id/comments', controllers.getProductComments );

// POST: /api/v@/products/:id/comments (Protected)
routes.post( '/:id/comments', authenticate, controllers.addCommentToProduct );

module.exports = routes;
