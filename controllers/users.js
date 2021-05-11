const { getPopulateQuery } = require('../utils');
const { User, Order } = require('../models');

// GET: /api/v@/users (Admin Route)
const getUsers = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'role', 'orders');
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;

  User.paginate({}, {
      page: currentPage,
      limit: pageSize,
      populate: populateQuery
    }).then(results => {

    res.status(200).json( results );
  }).catch(error => next( error ));
};

// GET: /api/v@/users/search
const searchUser = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'role', 'orders');
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const searchQuery = req.query.q;

  const regEx = new RegExp(searchQuery, 'ig');

  User.paginate({ userName: regEx }, {
      page: currentPage,
      limit: pageSize,
      populate: populateQuery
    }).then(results => {

    res.status(200).json( results );
  }).catch(error => next( error ));
};

// GET: /api/v@/users/:id
const getUser = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'role', 'orders');
  const userId = req.params.id;

  User.findOne({ _id: userId }).populate(populateQuery)
    .then(user => {
    if (!user) {
      return res.status(404).json({ message: 'User was not found!' });
    }

    res.status(200).json( user );
  }).catch(error => next( error ));
};

// GET: /api/v@/users/check/username
const checkAvailability = (req, res, next) => {
  const { userName } = req.body;

  User.findOne({ userName }).then(user => {
    // if user wasn't found send 404 Error
    if (!user) {
      return res.status(404).end();
    }

    res.status(200).json( user );
  }).catch(error => next( error ));
};

// PATCH: /api/v@/users/:id/role
const updateUser = (req, res, next) => {
  const _id = req.user._id;

  const changes = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName
  };

  User.findOneAndUpdate({ _id },  { ...changes }).then(() => {
    res.status(200).json({
      message: 'Changes saved successfully!',
      ...changes
    });
  }).catch(error => next( error ));
};

// PATCH: /api/v@/users/:id/role
const changeRole = (req, res, next) => {
  const { _id, role } = req.body;

  User.updateOne({ _id }, { role })
    .then(() => res.status(200).end()).catch(error => next( error ));
};

// PUT: /api/v@/users/ban
const banUser = (req, res, next) => {
  const _id = req.body._id;

  User.updateOne({ _id }, { isBanned: true })
    .then(() => res.status(200).end()).catch(error => next( error ));
};

// PUT: /api/v@/users/unban
const unBanUser = (req, res, next) => {
  const _id = req.body._id;

  User.updateOne({ _id }, { isBanned: false })
    .then(() => res.status(200).end()).catch(error => next( error ));
};

// GET: /api/v@/users/:id/orders (Protected)
const getUserOrders = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'products', 'user');
  const userId = req.params.id;

  Order.find({ user: userId }).populate(populateQuery)
    .then(orders => {
    if (orders.length === 0) {
      return res.status(200).json({
        message: 'there is no orders yet.'
      });
    }

    res.status(200).json( orders );
  }).catch(error => next( error ));
};

module.exports = {
  getUsers,
  searchUser,
  getUser,
  checkAvailability,
  updateUser,
  changeRole,
  banUser,
  unBanUser,
  getUserOrders
};
