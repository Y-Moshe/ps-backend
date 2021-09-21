const express = require('express');

const controllers = require('../controllers/orders');
const { authenticate, authorize } = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/orders
routes.get( '', authenticate, authorize( 0 ), controllers.getOrders );

// GET: /api/v@/orders/:id (Protected)
routes.get( '/:id', authenticate, controllers.getOrder );

// POST: /api/v@/orders (Protected)
routes.post( '', authenticate, controllers.order );

// PUT: /api/v@/orders/:id (Protected)
routes.put( '/:id', authenticate, controllers.putStatus );

module.exports = routes;
