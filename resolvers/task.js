const { users, tasks } = require('../constants');

const User = require('../database/models/user');
const Task = require('../database/models/task');
const { isAuthenticated } = require('./middleware/index');
const { combineResolvers } = require('graphql-resolvers');

module.exports = {
    Query: {
        tasks: () => tasks,
        task: (_, { id }) => tasks.find(task => task.id === id),
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated, async (_, { input }, { email }) => {
            try {
                const user = await User.findOne({ email });
                const task = new Task({...input, user:user.id })
                const result = await task.save()
                user.tasks.push(result.id);
                await user.save();
                console.log('Created Task ---->', result);
                return result;
            } catch (error) {
                console.log('Error -------->', error);
                throw error;
            }
        })
    },
    Task: {
        user: ({ userId }) => {
            return users.find(user => user.id === userId);
        }
    }
}