const { CustomError } = require('../utils');

/**
 * A Middleware to apply on request season.
 * The middleware will reject any request with a lower user rank than the specified.
 * Same rank will pass!
 * @requires `jwt-auth` middleware to be used before!
 * @param {number} requiredRankLevel The required rank level.
 * @returns express middleware
 */
const middleware = ( requiredRankLevel ) => (req, res, next) => {
  try {
    if (!req.user) {
      throw new CustomError('Seems like you\'re not logged in!', 401);
    }

    // Reject any lower level
    if (req.user.role.rank < requiredRankLevel) {
      throw new CustomError('Sorry, You\'r not allowed to visit this route!', 403);
    } else {

      // allowed
      next();
    }
  } catch (error) {
    next( error );
  }
};

module.exports = middleware;
