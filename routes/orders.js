const express = require('express');

const controllers = require('../controllers/orders');
const { checkRole, jwtAuth } = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/orders (Admin Route)
routes.get( '', jwtAuth, checkRole(2), controllers.getOrders );

// GET: /api/v@/orders/:id (Protected)
routes.get( '/:id', jwtAuth, controllers.getOrder );

// POST: /api/v@/orders (Protected)
routes.post( '', jwtAuth, controllers.order );

// PUT: /api/v@/orders/:id (Protected)
routes.put( '/:id', jwtAuth, controllers.putStatus );

module.exports = routes;
