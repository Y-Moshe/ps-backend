const express = require('express');

const controllers = require('../controllers/users');
const { upload } = require('../functions');
const { authenticate, authorize, Roles } = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/users (Protected)
routes.get( '', authenticate, authorize( Roles.MANAGER ), controllers.getUsers );

// GET: /api/v@/users/search
routes.get( '/search', controllers.searchUser );

// GET: /api/v@/users/:id
routes.get( '/:id', controllers.getUser );

// GET: /api/v@/users/availability
routes.get( '/availability', controllers.checkAvailability );

// PATCH: /api/v@/users/:id (Protected)
routes.patch( '/:id', authenticate, upload.single('image'), controllers.updateUser );

// PATCH: /api/v@/users/:id/role (Protected)
routes.patch( '/:id/role', authenticate, authorize( Roles.ADMINISTRATOR ), controllers.changeRole );

// PUT: /api/v@/users/:id/ban (Protected)
routes.put( '/:id/ban', authenticate, authorize( Roles.ADMINISTRATOR ), controllers.banUser );

// PUT: /api/v@/users/:id/unban (Protected)
routes.put( '/:id/unban', authenticate, authorize( Roles.ADMINISTRATOR ), controllers.unBanUser );

/***** Orders Related routes *****/

// GET: /api/v@/users/:id/orders (Protected)
routes.get( '/:id/orders', authenticate, controllers.getUserOrders );

module.exports = routes;
