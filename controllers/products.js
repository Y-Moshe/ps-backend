const { Product, Comment } = require('../models'),
      { AWS_URL } = require('../config'),
      { getPopulateQuery, CustomError } = require('../utils');

// GET: /api/v@/products
const getProducts = async (req, res, next) => {
    try {
        const query = getPopulateQuery(req.query, 'category', 'comments')
        const { page, per_page, categoryId } = req.query;
        let condition = { };

        if ( categoryId ) {
            condition = { category: categoryId }
        }

        const paginateResponse = await Product.paginate(condition, {
            page: page || 1,
            limit: per_page || 10,
            populate: query,
            lean: true,
            leanWithId: false
        });

        const status = paginateResponse.totalDocs > 0 ? 200 : 204;
        res.status( status ).json( paginateResponse );
    } catch (error) {
        next( error );
    }
};

// GET: /api/v@/products/random
const get3RandomProducts = async (req, res, next) => {
    try {
        const query = getPopulateQuery(req.query, 'category', 'comments');

        const productsLength = await Product.countDocuments();
        if ( productsLength < 4 ) {
            return res.status( 204 ).json({
                message: 'there\'s no products, at least 4 is required'
            }).end();
        }

        const random = Math.abs(Math.floor(Math.random() * productsLength) - 3);

        const products = await Product.find()
                                      .skip( random ).limit( 3 )
                                      .populate( query ).lean();
        
        res.status( 200 ).json( products );
    } catch (error) {
        next( error );
    }
};

// GET: /api/v@/products/:id
const getProduct = async (req, res, next) => {
    try {
        const query = getPopulateQuery(req.query, 'category', 'comments');
        const { id: _id } = req.params;

        const product = await Product.findById( _id )
                                     .populate( query )
                                     .lean();
        if ( !product ) {
            throw new CustomError(`Could not found the product ${ _id }`, 404);
        }
        
        res.status( 200 ).json( product );
    } catch (error) {
        next( error );
    }
};

// POST: /api/v@/products (Protected)
const addProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            price,
            content,
            categoryId
        } = req.body;
        let { imagePath } = req.body;
        
        if ( imagePath && req.file ) {
            throw new CustomError(`Bad parameters, 'imagePath' or 'image(file)' not both`, 400);
        }

        if ( !imagePath && req.file ) {
            imagePath = AWS_URL.concat('/', req.file.key);
        }

        const product = new Product({
            name,
            description,
            imagePath,
            price,
            content,
            category: categoryId
        });
        await product.save();

        res.status( 201 ).json({
            message: `Product ${ product.name } has been created successfully!`,
            product
        });
    } catch (error) {
        next( error );
    }
};

// PATCH: /api/v@/products/:id (Protected)
const editProduct = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const {
            name,
            description,
            price,
            content,
            categoryId
        } = req.body;
        let { imagePath } = req.body;
        
        if ( imagePath && req.file ) {
            throw new CustomError(`Bad parameters, 'imagePath' or 'image(file)' not both`, 400);
        }

        if ( !imagePath && req.file ) {
            imagePath = AWS_URL.concat('/', req.file.key);
        }

        const product = await Product.findById( _id );

        if ( !product ) {
            throw new CustomError(`Could not found user ${ _id }`, 404);
        }

        if ( name && product.name !== name ) {
            product.name = name;
        }

        if ( description && product.description !== description ) {
            product.description = description;
        }

        if ( imagePath && product.imagePath !== imagePath ) {
            product.imagePath = imagePath;
        }

        if ( price && product.price !== price ) {
            product.price = price;
        }

        if ( content && product.content !== content ) {
            product.content = content;
        }

        if ( categoryId && product.category !== categoryId ) {
            product.category = categoryId;
        }

        await product.save();

        res.status( 200 ).json({
            message: `Product ${ product.name } has been updated successfully!`,
            product
        });
    } catch (error) {
        next( error );
    }
};

// DELETE: /api/v@/products/:id (Protected)
const deleteProduct = async (req, res, next) => {
    try {
        const { id: _id } = req.params;

        const product = await Product.findById( _id ).lean();
        if ( !product ) {
            throw new CustomError(`The product ${ _id } does not exists!`, 404);
        }

        // Deleting any related comment to the product, then the product
        await Comment.deleteMany({ product: { $in: product.comments }});
        await Product.findByIdAndDelete( _id );

        res.status( 200 ).json({
            message: `The product ${ product.name }, ${ _id } - deleted successfully!`
        });
    } catch (error) {
        next( error );
    }
};

module.exports = {
  getProducts,
  get3RandomProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct
};
