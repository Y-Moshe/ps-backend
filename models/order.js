const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: 'User id is required in order to bound the order to the user',
    ref: 'User'
  },

  shippingInfo: {
    type: Object,
    required: 'Shipping information is required!'
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  quantities: {
    [Schema.Types.ObjectId]: Number
  },
  status: {
    type: String,
    enum: {
      values: ['Processing', 'Canceled', 'Completed'],
      message: 'Invalid status code'
    },
    default: 'Processing'
  },
  orderDate: {
    type: Number,
    default: new Date()
  },
  acceptedAt: Date,
});

module.exports = mongoose.model('Order', orderSchema);
