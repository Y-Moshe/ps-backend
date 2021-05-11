const { Comment } = require('../models');
const { getPopulateQuery } = require('../utils');

// GET: /api/comments
exports.getComments = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'user', 'product');

  Comment.find().populate(populateQuery)
    .then(comments => res.status(200).json( comments ))
    .catch(error => next( error ))
};

// GET: /api/comments/:id
exports.getComment = (req, res, next) => {
  const populateQuery = getPopulateQuery(req.query, 'user', 'product');
  const commentId = req.params.id;

  Comment.findOne({ _id: commentId }).populate(populateQuery)
    .then(comment => res.status(200).json( comment ))
    .catch(error => next( error ))
};

// PATCH: /api/comments/:id
exports.editComment = (req, res, next) => {
  const commentId = req.params.id;

  Comment.findOne({ _id: commentId }).populate('user')
    .then(comment => {
    const currentUserRole = req.user.role.rank;
    const commentUserRole = comment.user.role.rank;

    // If the same user who comment the msg request to edit, allow.
    // or if a higher rank user request to edit, allow.
    if (comment.user._id === req.user._id
        || currentUserRole > commentUserRole) {
      Comment.updateOne({ _id: commentId }, {
        text: req.body.text,
        lastEdit: req.body.lastEdit,
        isEdit: true
      }).then(() => {
        return res.status(200).json({
          message: 'The Comment has been Edited successfully!'
        });
      }).catch(err => next( err ));

    } else {
      return res.status(401).json({
        message: 'You are not allowd to manipulate this Comment!'
      });
    }
  }).catch(err => next( err ));
};

// DELETE: /api/comments/:id
exports.deleteComment = (req, res, next) => {
  const commentId = req.params.id;

  Comment.findOne({ _id: commentId }).populate('user')
    .then(comment => {
    const currentUserRole = req.user.role.rank;
    const commentUserRole = comment.user.role.rank;

    // If the same user who comment the msg request to delete, allow.
    // or if a higher rank user request to delete, allow.
    if (comment.user._id === req.user._id
        || currentUserRole > commentUserRole) {
      Comment.deleteOne({ _id: commentId }).then(() => {
        return res.status(200).json({
          message: 'The Comment has been deleted successfully!'
        });
      }).catch(err => next( err ));

    } else {
      return res.status(401).json({
        message: 'You are not allowd to manipulate this Comment!'
      });
    }
  }).catch(err => next( err ));
};
