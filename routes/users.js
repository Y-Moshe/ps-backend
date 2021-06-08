const express = require('express');

const controllers = require('../controllers/users');
const { authenticate, authorize, Roles, validateIds } = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/users (Protected)
routes.get( '', authenticate, authorize( Roles.MANAGER ), controllers.getUsers );

// GET: /api/v@/users/search
routes.get( '/search', controllers.searchUser );

// GET: /api/v@/users/availability
routes.get( '/availability', controllers.checkAvailability );

// GET: /api/v@/users/:id
routes.get( '/:id', validateIds, controllers.getUser );

// PATCH: /api/v@/users/:id (Protected)
routes.patch( '/:id', authenticate, validateIds, authorize( 0 ), controllers.updateUser );

// PATCH: /api/v@/users/:id/role (Protected)
routes.patch( '/:id/role', authenticate, validateIds, authorize( Roles.ADMINISTRATOR ), controllers.updateRole );

/***** Orders Related routes *****/

// GET: /api/v@/users/:id/orders (Protected)
routes.get( '/:id/orders', authenticate, validateIds,
    ( req, res ) => res.redirect( `${req.baseURI}/orders?userId=${req.params.id}` ));

module.exports = routes;
