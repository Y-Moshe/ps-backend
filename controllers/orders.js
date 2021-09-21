const { Order, User } = require('../models'),
      { CLIENT_URI } = require('../config'),
      { getPopulateQuery, CustomError } = require('../utils'),
      { Roles } = require('../middlewares'),
      { emailSend, Templates } = require('../functions');

// GET: /api/v@/orders (Protected)
const getOrders = async (req, res, next) => {
    try {
        const query = getPopulateQuery(req.query, 'products', 'user');
        const { userId, page, per_page } = req.query;
        let condition = { user: userId };

        // This route accessible to any authenticated user, but if the userId
        // is not provided via query params, then only Manager can access to get all orders.
        if ( !userId && user.userLevel < Roles.MANAGER ) {
            throw new CustomError('Sorry, You\'r not allowed to visit this route!', 403);
        }

        const paginateResponse = await User.paginate(condition, {
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

// GET: /api/v@/orders/:id (Protected)
const getOrder = async (req, res, next) => {
    try {
        const query = getPopulateQuery(req.query, 'products', 'user');
        const { id: _id } = req.params;

        const order = Order.findById( _id )
                           .populate( query )
                           .lean();
        if ( !order ) {
            throw new CustomError(`Could not found order ${ _id }`, 404);
        }

        res.status( 200 ).json( order );
    } catch (error) {
        next( error );
    }
};

// POST: /api/v@/orders (Protected)
const order = async (req, res, next) => {
    try {
        const {
            _id,
            email,
            userName,
            firstName,
            lastName
        } = req.user;
        const {
          country,
          city,
          streetAddress,
          province,
          zipCode,
          phone,
          products,
          quantities
        } = req.body;
        
        const order = new Order({
            user: _id,
            country,
            city,
            streetAddress,
            province,
            zipCode,
            phone,
            products,
            quantities
        });

        await order.save();
        await User.findByIdAndUpdate( _id, { $addToSet: { orders: order_id }});
        const templateData = {
            orderId: order._id,
            fullName: firstName + ' ' + lastName,
            totalPrice: calcTotalPrice( products, quantities ),
            address: `${ streetAddress } ${ city }, ${ zipCode }, ${ country } ${ province } Phone: ${ phone }`,
            products: products.map( product => ({
                _id: product._id,
                name: product.name,
                description: product.description,
                imagePath: product.imagePath,
                price: product.price
            })),
            websiteLink: CLIENT_URI
        }

        await emailSend(
            email,
            Templates.ORDER,
            templateData
        );

        res.status( 201 ).json({
            order,
            message: `Thank you ${ userName }! Your order has been accepted!`
        })
    } catch (error) {
        next( error );
    }
};

// PUT: /api/v@/orders/:id (Protected)
const putStatus = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const { status } = req.body;

        const order = await Order.findById( _id );

        if ( !order ) {
            throw new CustomError(`Could not found the order ${ _id }`, 404);
        }

        if ( status === 'Accepted' ) {
            order.receivedAt = new Date();
        }

        order.status = status;
        await order.save();

        res.status( 200 ).json({
            order,
            message: `Order ${ _id } has updated successfully!`
        });
    } catch (error) {
        next( error );
    }
};

function calcTotalPrice( products, quantities ) {
    let total = 0;
    for (const product in products) {
        total += (product.price) * quantities[product._id];
    }

    return total;
}

module.exports = {
  getOrders,
  getOrder,
  order,
  putStatus
};
