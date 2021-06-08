const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    text: {
        type: String,
        required: 'Comment text is required',
        minLength: [3, 'The Comment is too short'],
        trim: true
    },
    lastEdit: {
        type: Date,
        default: null
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
    },

    creationDate: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Comment', commentSchema);
