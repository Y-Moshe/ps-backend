const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: 'Comment text is required',
    minLength: [3, 'Category name too short']
  },
  lastEdit: {
    type: Date,
    default: 0
  },
  creationDate: {
    type: Date,
    default: new Date()
  },

  user: {
    type: Schema.Types.ObjectId,
    required: 'User id is required in order to bound the comment to the user',
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    required: 'Product id is required in order to bound the comment to the product',
    ref: 'Product'
  }
});

module.exports = mongoose.model('Comment', commentSchema);
