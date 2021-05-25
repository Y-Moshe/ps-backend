const { CustomError } = require('../utils');

const Roles = {
    MEMBER: 1,
    EDITOR: 2,
    MANAGER: 3,
    ADMINISTRATOR: 4,
    S_ADMINISTRATOR: 5
};

/**
 * This Middleware checks user access authorization by his role and rank.
 * @requires `authenticate` middleware to be used before!
 * @param {number} requiredRankLevel The required rank level, use `Roles` constant.
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

            // allow
            next();
        }
    } catch (error) {
        next( error );
    }
};

module.exports = {
    Roles,
    authorize: middleware
};
