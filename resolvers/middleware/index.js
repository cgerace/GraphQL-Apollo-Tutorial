const { skip } = require('graphql-resolvers');

module.exports.isAuthenticated = (_, __, { email }) => {
    console.log('In isAuthenticated, email is----->', email);
    if (!email) {
        throw new Error('Access Denied! Please login to continue');
    }
    return skip;
} 