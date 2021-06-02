const { Role } = require('../models');
const { Roles } = require('../middlewares');

const initiate = async () => {
    const numberOfRoles = Object.keys( Roles ).length;
    const dbNumberOfRoles = await Role.countDocuments();

    // If Roles exists on DB and no changes are made, skip all.
    if ( dbNumberOfRoles === numberOfRoles ) {
        return;
    }

    const roles = [
        {
            _id: Roles.MEMBER,
            title: 'Member',
            description: 'The initial user role, can make orders, update account details.'
        },
        {
            _id: Roles.EDITOR,
            title: 'Editor',
            description: 'Can edit, add products and categories.'
        },
        {
            _id: Roles.MANAGER,
            title: 'Manager',
            description: 'Can view all orders, comments.'
        },
        {
            _id: Roles.ADMINISTRATOR,
            title: 'Administrator',
            description: 'Can delete products and set user roles.'
        },
        {
            _id: Roles.S_ADMINISTRATOR,
            title: 'S. Administrator',
            description: 'Super Administrator, can do all. should be just one user with such a role!'
        }
    ];

    // If removed or added
    if ( numberOfRoles !== roles.length ) {
        throw new Error('Changes on Roles constant detected! but haven\'t been implemented at initiate-roles.js!');
    }

    if ( dbNumberOfRoles > 0 && dbNumberOfRoles !== numberOfRoles ) {
        console.log('Changes on Roles detected, preparing to re-initialization');
        await Role.deleteMany();
    }

    await Role.insertMany( roles );

    return 'Roles initialized successfully!';
};

initiate()
    .then( msg => msg && console.log( msg ))
    .catch( err => console.error('Failed to Initiate Roles: ', err ));
