const express = require('express');

const controllers = require('../controllers/auth');
const { upload } = require('../functions');
const { authenticate } = require('../middlewares');

const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// POST: /api/v@/auth/signup
routes.post( '/signup', upload.single('image'), controllers.createUser );

// POST: /api/v@/auth/login
routes.post( '/login', controllers.loginUser );

// POST: /api/v@/auth/verify/email
routes.post( '/verify/email', controllers.verifyEmail );

// POST: /api/v@/auth/verify/email/resend (Protected)
routes.post( '/verify/email/resend', authenticate, controllers.resendVerification );

// POST: /api/v@/auth/verify/token
routes.post( '/verify/token', controllers.verifyToken );

// POST: /api/v@/auth/password/change (Protected)
routes.post( '/password/change', authenticate, controllers.changePassword );

// POST: /api/v@/auth/password/recover
routes.post( '/password/recover', controllers.recoverPassword );

// POST: /api/v@/auth/password/reset
routes.post( '/password/reset', controllers.resetPassword );

/***** Socials integrations *****/

// POST: /api/v@/auth/google
// routes.post( '/google', controllers.googleAuth );

module.exports = routes;
