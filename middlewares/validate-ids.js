const { isValidId, CustomError, safeCombine } = require('../utils');

/**
 * This Middleware will validate all req.params and req.query ids for you.
 * It detects the paramter id name by regex, if `id` is appear.
 * For example: productId - that parameter will pass a validation!
 * Any duplicate parameters - Error is occurs and should not be happend!
 * Then, will validate the paramter value using `isValidId` utils!
 */
const validateIds = async (req, res, next) => {
    try {
        const combinedObj = safeCombine(req.params, req.query);
        const idsParams = Object.keys( combinedObj )
                                .filter( key => /id/ig.test( key ));

        const isValid = idsParams.every( key => isValidId( combinedObj[key] ));
        if (!isValid) {
            throw new CustomError('Invalid id paramater!', 400);
        }

        next();
    } catch (error) {
        next( error );
    }
};

module.exports = validateIds;
