/**
 * Get a string to be used for mongoose.populate method
 * Based on the req.query object that coming from the request query params.
 * @param queryParams should be req.query
 * @param fields the populate fields, 'user', 'category', 'product' ..etc
 * should be a field with "ref" option set at the model schema
 * @returns if req.query is like { user: 1, products: 0, category: 1 } returns: 'user category'
 */
function getPopulateQuery(queryParams, ...fields) {
    let queryString = '';

    Object.keys(queryParams).forEach(paramaterName => {
        if (Number(queryParams[paramaterName]) === 1 && fields.includes(paramaterName)) {
            queryString = queryString.concat(' ', paramaterName);
        }
    });

    return queryString.trim();
}

module.exports = getPopulateQuery;
  