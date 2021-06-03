const { getPopulateQuery, CustomError } = require('../utils');
const { User, Role } = require('../models');
const { isValidEmail, isValidUserName } = require('../models/validators');

const GET_ALLOWED_PROPS = '_id firstName lastName userName role imagePath creationDate';

// GET: /api/v@/users (Protected)
const getUsers = async (req, res, next) => {
    try {
        const populateQuery = getPopulateQuery(req.query, 'role', 'orders');
        const { page, per_page } = req.query;

        const paginateResponse = await User.paginate({}, {
            page: page || 1,
            limit: per_page || 10,
            populate: populateQuery,
            select: '-password',
            lean: true,
            leanWithId: false
        });

        const status = paginateResponse.totalDocs > 0 ? 200 : 204;
        res.status( status ).json( paginateResponse );
    } catch (error) {
        next( error );
    }
};

// GET: /api/v@/users/search
const searchUser = async (req, res, next) => {
    try {
        const populateQuery = getPopulateQuery(req.query, 'role');
        const { page, per_page, by, query } = req.query;

        if ( !by?.trim() || !query?.trim() ) {
            throw new CustomError('Missing required parameters!', 400);
        }

        const regex = new RegExp(query?.trim(), 'ig');
        const isAllowed = ['firstName', 'lastName', 'userName'].includes(by.trim());

        if ( !isAllowed ) {
            throw new CustomError('Invalid search by parameter!', 400);
        }
        
        const paginateResponse = await User.paginate({ [ by ]: regex }, {
            page: page || 1,
            limit: per_page || 10,
            populate: populateQuery,
            select: GET_ALLOWED_PROPS,
            lean: true,
            leanWithId: false
        });

        const status = paginateResponse.totalDocs > 0 ? 200 : 204;
        res.status( status ).json( paginateResponse );
    } catch (error) {
        next( error );
    }
};

// GET: /api/v@/users/:id
const getUser = async (req, res, next) => {
    try {
        const { id: _id } = req.params;

        const user = await User.findById( _id )
                               .populate( 'role' )
                               .select( GET_ALLOWED_PROPS )
                               .lean();
        if (!user) {
            throw new CustomError('Could not found the user', 404);
        }
        
        res.status( 200 ).json( user );
    } catch (error) {
        next( error );
    }
};

// GET: /api/v@/users/availability
const checkAvailability = async (req, res, next) => {
    try {
        const { email, user_name } = req.query;
        
        if ( email && user_name ||
            !email && !user_name ) {
            throw new CustomError('Bad usage of parameters! email or user_name', 400);
        }

        if ( email && !isValidEmail( email )) {
            throw new CustomError('Invalid email address!', 400);
        }

        if ( user_name && !isValidUserName( user_name )) {
            throw new CustomError('Invalid user name!', 400);
        }

        let condition = { };
        let errMsg = '';

        if ( email ) {
            condition = { email };
            errMsg = `There's an account association with ${ email }!`;
        } else if ( user_name ) {
            condition = { userName: user_name };
            errMsg = `The user name ${ user_name } is taken!`;
        }

        const user = await User.findOne( condition ).lean();
        const isAvailable = user ? false : true;

        if ( !isAvailable ) {
            throw new CustomError( errMsg, 401 );
        }
        
        res.status( 200 ).send( isAvailable );
    } catch (error) {
        next( error );
    }
};

// PATCH: /api/v@/users/:id (Protected)
const updateUser = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const {
            firstName,
            lastName,
            userName
        } = req.body;

        const user = await User.findById( _id ).select( GET_ALLOWED_PROPS );

        if ( !user ) {
            throw new CustomError('Could not found the user', 404);
        }

        // If id from the token and req.params are not matchs
        // Allow only if authenticate user(from the token) has a higher role!
        if ( _id !== req.user._id && req.userLevel <= user.role ) {
            throw new CustomError('You are not allowed to do that!', 401);
        }

        if ( firstName && user.firstName !== firstName ) {
            user.firstName = firstName;
        }

        if ( lastName && user.lastName !== lastName ) {
            user.lastName = lastName;
        }

        if ( userName && user.userName !== userName ) {
            user.userName = userName;
        }

        await user.save();

        res.status( 200 ).json({
            message: `Account of user ${ user.userName } has been updated successfully!`,
            user
        });
    } catch (error) {
        next( error );
    }
};

// PATCH: /api/v@/users/:id/role (Protected)
const updateRole = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const role = +req.body.role;

        if ( typeof role !== 'number' ) {
            throw new CustomError('Invalid role level!', 400);
        }

        const user = await User.findById( _id );

        if ( !user ) {
            throw new CustomError('Could not found the user', 404);
        }

        // If id from the token and req.params are not matchs
        // Allow only if authenticate user(from the token) has a higher role!
        if ( _id !== req.user._id && req.userLevel <= user.role ) {
            throw new CustomError('You are not allowed to do that!', 401);
        }

        // User cannot set other user to role that higher or equal to him!
        if ( role >= req.userLevel ) {
            throw new CustomError('You cannot set role that higher than yours or same', 401);
        }

        user.role = role;
        await user.save();
        const roleObj = await Role.findById( role );

        res.status( 200 ).json({
            message: `The user ${ user.userName } Role updated successfully!`,
            role: roleObj
        });
    } catch (error) {
        next( error );
    }
};

module.exports = {
  getUsers,
  searchUser,
  getUser,
  checkAvailability,
  updateUser,
  updateRole
};
