const bcrypt = require('bcryptjs'),
      passport = require('passport'),
      jwt = require('jsonwebtoken');

const {
    INITIAL_USER_RANK_ID,
    PASSWORD_HASH_SALT,
    AWS_URL,
    JWT_SECRET
} = require('../config');
const { User } = require('../models');
const { CustomError } = require('../utils');

// POST: /api/v@/auth/signup
const createUser = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            userName,
            email,
            password
        } = req.body;
    
        const user = new User({
            firstName,
            lastName,
            userName,
            email,
            role: INITIAL_USER_RANK_ID,
            creationDate: new Date()
        });
    
        // Hashing the password
        user.password = bcrypt.hashSync(password, PASSWORD_HASH_SALT);
    
        // Creating the imagePath (if there's no image, default imagePath is set).
        const uri = req.protocol + '://' + req.get('host');
        if (req.file) {
            user.imagePath = AWS_URL.concat('/', req.file.key);
        } else {
            user.imagePath = uri.concat('/assets/images/default.png');
        }
        
        // Saving the user to Database and calling next middlewere to send email verfication message.
        
        req.user = await user.save();
        next();
    } catch (error) {
        next( error );
    }
};

// POST: /api/v@/auth/login
const loginUser = (req, res, next) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
    // Any error case that can occur.
    if (error) {
        return next( error );
    }

    // Password or email are incorrect!
    if (!user) {
        return res.status(401).json( info );
    }

    let expiresIn = '3h';
    if (req.body.reMe) {
        expiresIn = '3d';
    }


    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn });

    res.status(200).json({
        token: token,
        expiresIn,
        user
    });
    })(req, res);
};

// POST: /api/v@/auth/verify/email
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        const decodedToken = jwt.verify(token, JWT_SECRET);

        const user = await User.findOne({ email: decodedToken.email });
        if (!user) {
            throw new CustomError('Could not found the user', 404);
        }

        if (user.isVerified) {
            throw new CustomError('Your email already verified!', 208);
        }
        user.isVerified = true;
        await user.save();

        res.status(200).json({
            message: 'Your email have been verified successfully!',
            user
        });
    } catch (error) {
        next( error );
    }
};

// POST: /api/v@/auth/verify/token
const verifyToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        const { _id } = jwt.verify(token, JWT_SECRET);

        const user = await User.findOne({ _id }).lean();
        if (!user) {
            throw new CustomError('Could not found the user', 404);
        }

        res.status(200).json({ token, user });
    } catch (error) {
        next( error );
    }
};

// POST: /api/v@/auth/password/change (Protected)
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { _id } = req.user;
    
        const user = await User.findById( _id );

        if (!user) {
            throw new CustomError('Could not found the user!', 404);
        }

        if (user.email.toLowerCase() === 'example@demo.com') {
            throw new CustomError('You\'re not allowed to change demo user password!', 403);
        }
    
        // comparing aginst the old password
        const result = bcrypt.compareSync(currentPassword, user.password);
        
        if (!result) {
            throw new CustomError('Incorrect password!', 401);
        }
    
        const hashedPassword = bcrypt.hashSync(newPassword, PASSWORD_HASH_SALT);
    
        user.password = hashedPassword;
        await user.save();
    
        res.status(200).json({
            message: 'The password has been changed successfully!'
        });
    } catch (error) {
        next( error );
    }
};

// POST: /api/v@/auth/password/forgot
const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email.toLowerCase();
    
        if (email === 'example@demo.com') {
            throw new CustomError('You\'re not allowed to recover demo user password!', 403);
        }
        const user = await User.findOne({ email }).lean();
    
        if (!user) {
            throw new CustomError(`Couldn't found an account with this email address(${email })`, 404);
        }
        // required for the next() middlewere
        req.user = user;

        next();
    } catch (error) {
        next( error );
    }
};

// POST: /api/v@/auth/password/reset
const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, userId } = req.body;
    
        const user = await User.findById( userId );

        if (!user) {
            throw new CustomError('Could not found the user', 404);
        }

        const hashedPassword = bcrypt.hashSync(newPassword, PASSWORD_HASH_SALT);
        user.password = hashedPassword;
        await user.save();
    
        res.status(200).json({
            message: 'The password has been updated successfully!'
        });
    } catch (error) {
        next( error );
    }
};

module.exports = {
    createUser,
    loginUser,
    verifyEmail,
    verifyToken,
    changePassword,
    forgotPassword,
    resetPassword
};
