const { isValidId, CustomError } = require('../utils');

/**
 * This middleware will validate all req.params ids for you.
 * It detects if the paramter's name / key is contain "id" using regex.
 * And Then, will validate the paramter value with `isValidId` utils!
 */
const validateIds = async (req, res, next) => {
  try {
      const idsEntry = Object.keys(req.params).filter(key => /id/ig.test(key));
      const test = idsEntry.every(key => isValidId(req.params[key]));

      if (!test) {
          throw new CustomError('Invalid id paramater!', 400);
      }
      next();
  } catch (error) {
      next( error );
  }
};

module.exports = validateIds;
