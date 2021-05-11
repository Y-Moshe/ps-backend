const express = require('express');

const controllers = require('../controllers/users');
const { upload } = require('../functions');
const { checkRole, jwtAuth } = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/users (Protected, Admin Route)
routes.get( '', jwtAuth, checkRole(2), controllers.getUsers );

// GET: /api/v@/users/search
routes.get( '/search', controllers.search );

// GET: /api/v@/users/:id
routes.get( '/:id', controllers.getUser );

// GET: /api/v@/users/availability
routes.get( '/availability', controllers.checkAvailability );

// PATCH: /api/v@/users/:id (Protected)
routes.patch( '/:id', jwtAuth, upload.single('image'), controllers.updateUser );

// PATCH: /api/v@/users/:id/role (Admin Route)
routes.patch( '/:id/role', jwtAuth, checkRole(2), controllers.changeRole );

// PUT: /api/v@/users/:id/ban (Admin Route)
routes.put( '/:id/ban', jwtAuth, checkRole(2), controllers.banUser );

// PUT: /api/v@/users/:id/unban (Admin Route)
routes.put( '/:id/unban', jwtAuth, checkRole(2), controllers.unBanUser );

/***** Orders Related routes *****/

// GET: /api/v@/users/:id/orders (Protected)
routes.get( '/:id/orders', jwtAuth, controllers.getUserOrders );

module.exports = routes;
