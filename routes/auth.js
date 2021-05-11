const express = require('express');

const {
    FORGOT_PASSWORD_TEMPLATE,
    VERIFICATION_TEMPLATE,
    emailVerification
} = require('../middlewares/email-verification');
const controllers = require('../controllers/auth');
const { upload } = require('../functions');
const { jwtAuth } = require('../middlewares');


const routes = express.Router();

// Protected route is a route that require a valid token to be sent via HTTP Header!
// Short words, User must be logged in.
// v@ = dynamic version base on package.json, example: /api/v2/users

// POST: /api/v@/auth/signup
routes.post( '/signup', upload.single('image'), controllers.createUser, emailVerification( VERIFICATION_TEMPLATE ));

// POST: /api/v@/auth/login
routes.post( '/login', controllers.loginUser );

// POST: /api/v@/auth/verify/email
routes.post( '/verify/email', controllers.verifyEmail );

// POST: /api/v@/auth/verify/email/resend (Protected)
routes.post( '/verify/email/resend', jwtAuth, emailVerification( VERIFICATION_TEMPLATE ));

// POST: /api/v@/auth/verify/token
routes.post( '/verify/token', controllers.verifyToken );

// POST: /api/v@/auth/password/change (Protected)
routes.post( '/password/change', jwtAuth, controllers.changePassword );

// POST: /api/v@/auth/password/forgot
routes.post( '/password/forgot', controllers.forgotPassword, emailVerification( FORGOT_PASSWORD_TEMPLATE ));

// POST: /api/v@/auth/password/reset
routes.post( '/password/reset', controllers.resetPassword );

/***** Socials integrations *****/

// POST: /api/v@/auth/google
// routes.post( '/google', controllers.googleAuth );

module.exports = routes;
