const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  rank: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String
});

module.exports = mongoose.model('Role', roleSchema);
