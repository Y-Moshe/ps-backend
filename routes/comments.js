const express = require('express');
const passport = require('passport');

const controllers = require('../controllers/comments');
const { checkRole, jwtAuth } = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/comments (Protected, Admin Route)
routes.get('', jwtAuth, checkRole(2), controllers.getComments);

// GET, PATCH, DELETE: /api/v@/comments/:id
routes.route('/:id')

// GET:
  .get( controllers.getComment )

// PATCH: (Protected)
  .patch( jwtAuth, controllers.editComment )

// DELETE: (Protected)
  .delete( jwtAuth, controllers.deleteComment );

module.exports = routes;
