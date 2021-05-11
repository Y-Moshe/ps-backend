const { Order } = require('../models');
const { getPopulateQuery } = require('../utils');

// GET: /api/orders (Admin Route)
exports.getOrders = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'products', 'user');

  Order.find().populate(populateQuery)
    .then(orders => {
    if (orders.length === 0) {
      return res.status(200).json({
        message: 'there is no orders yet.'
      });
    }

    res.status(200).json( orders );
  }).catch(error => next( error ));
};

// GET: /api/orders/:id (Protected)
exports.getOrder = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'products', 'user');
  const orderId = req.params.id;

  Order.findOne({ _id: orderId }).populate(populateQuery)
    .then(order => {

    res.status(200).json( order );
  }).catch(error => next( error ));
};

// POST: /api/orders (Protected)
exports.order = (req, res, next) => {
  const {
    userId,
    date,
    shippingInfo,
    products,
    quantities
  } = req.body;

  const order2Save = new Order({
    user: userId,
    date,
    shippingInfo,
    products,
    quantities,
  });

  order2Save.save().then(() => {

    res.status(200).json({
      message: 'Your Order has been accepted successfully, thank you!'
    });
  }).catch(error => next( error ));
};

// PUT: /api/orders/:id (Protected)
exports.updateState = (req, res, next) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;

  let acceptedAt;
  if (newStatus === 'Accepted') {
    acceptedAt = Date.now();
  }

  Order.findOneAndUpdate({ _id: orderId }, {
    status: newStatus,
    acceptedAt: acceptedAt
  }).then(result => {
    res.status(200).json({
      order: result,
      message: 'Your Order has been updated successfully!'
    });
  }).catch(error => next( error ));
};
