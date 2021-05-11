const passport = require('passport');

/**
 * just a shortcut for passport.authenticate('jwt', { session: false })
 */
module.exports = passport.authenticate('jwt', { session: false });
