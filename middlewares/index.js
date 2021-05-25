const authenticate = require('./authenticate'),
      errorHandler = require('./error-handler'),
      validateIds  = require('./validate-ids');

const { authorize, Roles } = require('./authorize');

const {
    CONTACT_TEMPLATE,
    FORGOT_PASSWORD_TEMPLATE,
    VERIFICATION_TEMPLATE,
    emailVerification
} = require('./email-verification');

module.exports = {
    authenticate,
    authorize,
    Roles,
    errorHandler,
    validateIds,

    CONTACT_TEMPLATE,
    FORGOT_PASSWORD_TEMPLATE,
    VERIFICATION_TEMPLATE,
    emailVerification
};
