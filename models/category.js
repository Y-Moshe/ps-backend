const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: 'Category name is required!',
        minLength: [3, 'Category name too short'],
        trim: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
