const express = require('express');

const controllers = require('../controllers/categories');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// GET: /api/v@/categories
routes.get( '', controllers.getCategories );

module.exports = routes;
