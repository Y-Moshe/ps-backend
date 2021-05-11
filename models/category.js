const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema =  Schema({
  name: {
    type: String,
    required: 'Category name is required!',
    minLength: [3, 'Category name too short'],
    trim: true
  }
});

module.exports = mongoose.model('Category', categorySchema);
