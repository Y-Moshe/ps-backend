const { CustomError } = require('../utils');

const Roles = {
    MEMBER: 1,
    EDITOR: 2,
    MANAGER: 3,
    ADMINISTRATOR: 4,
    S_ADMINISTRATOR: 5
};

/**
 * This Middleware checks user access authorization by his role.
 * req.userLevel is set as number for anyuse.
 * @requires `authenticate` Middleware to be used before!
 * @param {number} requiredRoleLevel The required role level, use `Roles` constant or set 0 to allow for all.
 * @returns express middleware
 */
const middleware = ( requiredRoleLevel ) => (req, res, next) => {
    try {
        if (!req.user) {
            throw new CustomError('Seems like you\'re not logged in!', 401);
        }
        const { role } = req.user;
        const currentUserRole = typeof role === 'number' ? role : req.user.role._id;
        req.userLevel = currentUserRole;

        // Reject any lower level
        if ( currentUserRole < requiredRoleLevel ) {
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
