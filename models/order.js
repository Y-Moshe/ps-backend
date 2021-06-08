const mongoose = require('mongoose'),
      { isValidPhone } = require('./validators'),
      mongoosePaginateV2 = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: 'User id is required in order to bound the order to the user',
        ref: 'User'
    },

    country: {
        type: String,
        required: 'Country is required!',
        trim: true
    },
    city: {
        type: String,
        required: 'City is required!',
        trim: true
    },
    streetAddress: {
        type: String,
        trim: true
    },
    province: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        required: 'Zip code is required!',
        trim: true
    },
    phone: {
        type: String,
        required: 'Phone number is required!',
        validate: {
            validator: isValidPhone,
            message: 'Invalid phone number'
        }
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
    receivedAt: {
        type: Date,
        default: null
    },

    creationDate: {
        type: Date,
        default: new Date()
    }
});

orderSchema.plugin( mongoosePaginateV2 );

module.exports = mongoose.model('Order', orderSchema);
