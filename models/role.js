const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const roleSchema = new Schema({
  rank: {
    type: Number,
    required: 'Rank level is required!',
    unique: 'Should only be one role with that rank number!'
  },
  title: {
    type: String,
    required: 'Title is required!',
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});
roleSchema.plugin( uniqueValidator );

module.exports = mongoose.model('Role', roleSchema);
