const express = require('express');

const controllers = require('../controllers/comments');
const {
  authenticate,
  authorize,
  Roles,
  validateIds
} = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/comments (Protected)
routes.get('', authenticate, authorize( Roles.MANAGER ), validateIds, controllers.getComments);

// GET, PATCH, DELETE: /api/v@/comments/:id
routes.route('/:id')

// GET:
  .get( validateIds, controllers.getComment )

// PATCH: (Protected)
  .patch( validateIds, authenticate, controllers.editComment )

// DELETE: (Protected)
  .delete( validateIds, authenticate, controllers.deleteComment );

module.exports = routes;
