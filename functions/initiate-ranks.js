const { Role } = require('../models');

const initiate = async () => {
    const role = await Role.findOne({ rank: 1 }).lean();

    if (role) {
        return role._id;
    }

    const roles = [
        {
            rank: 1,
            title: 'Member',
            description: 'The initial user role.'
        },
        {
            rank: 2,
            title: 'Editor',
            description: 'Can edit products, add new categories.'
        },
        {
            rank: 3,
            title: 'Manager',
            description: 'Can set members to editor role, edit and delete product comments.'
        },
        {
            rank: 4,
            title: 'Administrator',
            description: 'A Higher level than Manager, can do the most.'
        },
        {
            rank: 5,
            title: 'S. Administrator',
            description: 'Super Administrator, can do all. should be just one user with such a role!'
        }
    ];

    const results = await Role.insertMany(roles);
    console.log('Roles and Ranks initiated successfully!');

    return results.find( role => role.rank === 1)._id;
};

initiate()
    .then( id => process.env.INITIAL_USER_RANK_ID = id )
    .catch( err => console.error('Failed to initiate Roles: ', err));
