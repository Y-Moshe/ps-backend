const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginateV2 = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  creationDate: {
    type: Number,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  role: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Role'
  },
  isBanned: {
    type: Boolean,
    default: false
  }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongoosePaginateV2);

module.exports = mongoose.model('User', userSchema);
