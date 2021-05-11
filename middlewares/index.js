const checkRole    = require('./check-role'),
      errorHandler = require('./error-handler'),
      jwtAuth      = require('./jwt-auth'),
      validateIds  = require('./validate-ids');

const {
    CONTACT_TEMPLATE,
    FORGOT_PASSWORD_TEMPLATE,
    VERIFICATION_TEMPLATE,
    emailVerification
} = require('./email-verification');

module.exports = {
    checkRole,
    errorHandler,
    jwtAuth,
    validateIds,

    CONTACT_TEMPLATE,
    FORGOT_PASSWORD_TEMPLATE,
    VERIFICATION_TEMPLATE,
    emailVerification
};
