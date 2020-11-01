const { skip } = require('graphql-resolvers');
const Task = require('../../database/models/task');
const { isValidObjectId } = require('../../database/util');

module.exports.isAuthenticated = (_, __, { email }) => {
    console.log('In isAuthenticated, email is----->', email);
    if (!email) {
        throw new Error('Access Denied! Please login to continue');
    }
    return skip;
} 

module.exports.isTaskOwner = async (_, { id }, { userId }) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Task");
    }
    const task = await Task.findById(id);
    if (!task) {
        throw new Error("Task not found");
    }
    else if (task.user.toString() !== userId) {
        throw new Error("Invalid Permissions");
    }
    return skip;
}