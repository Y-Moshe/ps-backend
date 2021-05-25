const express = require('express');

const controllers = require('../controllers/comments');
const { authenticate, authorize, Roles } = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/comments (Protected)
routes.get('', authenticate, authorize( Roles.MANAGER ), controllers.getComments);

// GET, PATCH, DELETE: /api/v@/comments/:id
routes.route('/:id')

// GET:
  .get( controllers.getComment )

// PATCH: (Protected)
  .patch( authenticate, controllers.editComment )

// DELETE: (Protected)
  .delete( authenticate, controllers.deleteComment );

module.exports = routes;
