const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator'),
      mongoosePaginateV2 = require('mongoose-paginate-v2');

const {
    isValidEmail,
    isValidLink,
    isValidUserName
} = require('./validators');
const { Roles } = require('../middlewares');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: 'email address is required!',
        validate: {
            validator: isValidEmail,
            message: 'Invalid email address!'
        },
        unique: 'email address is already exists!'
    },
    password: {
        type: String,
        required: 'password is required!'
    },
    firstName: {
        type: String,
        minLength: [3, 'first name is too short']
    },
    lastName: {
        type: String,
        minLength: [3, 'last name is too short'],
    },
    userName: {
        type: String,
        required: 'user name is required!',
        validate: {
            validator: isValidUserName,
            message: 'Invalid user name!'
        },
        unique: 'user name is already exists'
    },
    imagePath: {
        type: String,
        required: 'User image is required!',
        validate: {
            validator: isValidLink,
            message: 'Invalid image link!'
        }
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
        type: Number,
        default: Roles.MEMBER,
        ref: 'Role',
    },

    creationDate: {
        type: Date,
        default: new Date()
    }
});

userSchema.plugin( uniqueValidator );
userSchema.plugin( mongoosePaginateV2 );

module.exports = mongoose.model('User', userSchema);
