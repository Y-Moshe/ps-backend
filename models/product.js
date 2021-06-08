const mongoose = require('mongoose'),
      { isValidLink } = require('./validators'),
      mongoosePaginateV2 = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: 'Product name is required!',
        minLength: [3, 'Product name too short'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imagePath: {
        type: String,
        required: 'Product image link is required!',
        validate: {
            validator: isValidLink,
            message: 'Invalid product image link!'
        }
    },
    price: {
        type: Number,
        required: 'Product price is required!'
    },
    content: {
        type: String,
        trim: true
    },

    category: {
        type: Schema.Types.ObjectId,
        required: 'Category id is required in order to bound the product to the relevant category',
        ref: 'Category'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

    creationDate: {
        type: Date,
        default: new Date()
    }
});

productSchema.plugin( mongoosePaginateV2 );

module.exports = mongoose.model('Product', productSchema);
