const bcrypt   = require('bcryptjs'),
      passport = require('passport'),
      jwt      = require('jsonwebtoken');

const {
    PASSWORD_HASH_SALT,
    AWS_URL,
    JWT_SECRET,
    CLIENT_URI
} = require('../config');
const { User }                 = require('../models');
const { Templates, emailSend } = require('../functions');
const { CustomError }          = require('../utils');

const VERIFICATION_TOKEN_EXPIRES_IN = '2h';
const LOGIN_TOKEN_EXPIRES_IN        = '3h';
const LOGIN_TOKEN_REME_EXPIRES_IN   = '3d'; // The remember me option

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
            email
        });
    
        // Hashing the password
        user.password = await bcrypt.hash(password, PASSWORD_HASH_SALT);
    
        // Creating the imagePath (if there's no image, default imagePath is set).
        const uri = req.protocol.concat('://', req.get('host'));
        if (req.file) {
            user.imagePath = AWS_URL.concat('/', req.file.key);
        } else {
            user.imagePath = uri.concat('/assets/images/default.png');
        }
        
        // Save use to Databse.
        await user.save();
        delete user.password;

        const userToken = jwt.sign({ ...user }, JWT_SECRET, { expiresIn: LOGIN_TOKEN_EXPIRES_IN });
        // Sending email verification message
        const verifyToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: VERIFICATION_TOKEN_EXPIRES_IN });
        const url = CLIENT_URI.concat('/auth/verify?token=', verifyToken);
        const templateData = {
            fullName: firstName + ' ' + lastName,
            verifyLink: url
        };

        await emailSend(
            email,
            Templates.VERIFY_EMAIL,
            templateData
        );

        res.status(201).json({
            message: 'An E-Mail message has been sent to your email address, please check your mailbox and verify your email address.',
            user,
            token: userToken,
            expiresIn: LOGIN_TOKEN_EXPIRES_IN
        });
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

    let expiresIn = req.body.reMe ?
        LOGIN_TOKEN_REME_EXPIRES_IN : LOGIN_TOKEN_EXPIRES_IN;
    delete user.password;

    const token = jwt.sign({ ...user }, JWT_SECRET, { expiresIn });

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
            throw new CustomError('Your email is already verified!', 208);
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

// POST: /api/v@/auth/verify/email/resend (Protected)
const resendVerification = async (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.user;
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: VERIFICATION_TOKEN_EXPIRES_IN });
        const url = CLIENT_URI.concat('/auth/verify?token=', token);
        const templateData = {
            fullName: firstName + ' ' + lastName,
            verifyLink: url
        };

        await emailSend(
            email,
            Templates.VERIFY_EMAIL,
            templateData
        );

        res.status(200).json({
            message: 'An E-Mail message has been sent to your email address, please check your mailbox and verify your email address.'
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
        const user = await User.findById( _id )
                               .select('-password')
                               .lean();

        if (!user) {
            throw new CustomError('Could not found the user', 404);
        }

        res.status(200).json( user );
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
        const result = await bcrypt.compare(currentPassword, user.password);
        
        if (!result) {
            throw new CustomError('Incorrect password!', 401);
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT);
    
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
        const email = req.body.email.trim().toLowerCase();
    
        if (email === 'example@demo.com') {
            throw new CustomError('You\'re not allowed to recover demo user password!', 403);
        }
        const user = await User.findOne({ email }).lean();
    
        if (!user) {
            throw new CustomError(`Couldn't found an account with this email address(${email })`, 404);
        }

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: VERIFICATION_TOKEN_EXPIRES_IN });
        const url = CLIENT_URI.concat('/auth/reset-password?token=', token);
        const templateData = {
            fullName: user.firstName + ' ' + user.lastName,
            resetPasswordLink: url,
            contactLink: CLIENT_URI.concat('/contact')
        };

        await emailSend(
            email,
            Templates.PASSWORD_RESET,
            templateData
        );

        res.status(200).json({
            message: 'Your request has been accepted successfully, please check your mailbox and continue this process!'
        });
    } catch (error) {
        next( error );
    }
};

// POST: /api/v@/auth/password/reset
const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, token } = req.body;
        const { _id } = jwt.decode( token );
        const user = await User.findById( _id );

        if (!user) {
            throw new CustomError('Could not found the user', 404);
        }

        const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT);
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
    resendVerification,
    verifyToken,
    changePassword,
    forgotPassword,
    resetPassword
};
