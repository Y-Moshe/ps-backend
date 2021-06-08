const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
    _id: Number,
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

module.exports = mongoose.model('Role', roleSchema);
