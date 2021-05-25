const { Role } = require('../models');
const { Roles } = require('../middlewares');

const initiate = async () => {
    const role = await Role.findOne({ rank: 1 }).lean();

    if (role) {
        return role._id;
    }

    const roles = [
        {
            rank: Roles.MEMBER,
            title: 'Member',
            description: 'The initial user role, can make orders, update account details.'
        },
        {
            rank: Roles.EDITOR,
            title: 'Editor',
            description: 'Can edit, add products and categories.'
        },
        {
            rank: Roles.MANAGER,
            title: 'Manager',
            description: 'Can view all orders, comments.'
        },
        {
            rank: Roles.ADMINISTRATOR,
            title: 'Administrator',
            description: 'Can delete products, set user roles and ban users.'
        },
        {
            rank: Roles.S_ADMINISTRATOR,
            title: 'S. Administrator',
            description: 'Super Administrator, can do all. should be just one user with such a role!'
        }
    ];

    const results = await Role.insertMany( roles );
    console.log('Roles and Ranks initiated successfully!');

    return results.find( role => role.rank === 1)._id;
};

initiate()
    .then( id => process.env.INITIAL_USER_RANK_ID = id )
    .catch( err => console.error('Failed to Initiate Roles: ', err) );
