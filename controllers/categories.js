const { Category } = require('../models');

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().lean();
        const status = categories.length > 0 ? 200 : 204;

        res.status( status ).json( categories );
    } catch (error) {
        next( error );
    }
};

module.exports = {
    getCategories
}
