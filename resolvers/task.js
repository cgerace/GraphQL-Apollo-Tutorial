const { users, tasks } = require('../constants');

const User = require('../database/models/user');
const Task = require('../database/models/task');
const { isAuthenticated, isTaskOwner} = require('./middleware/index');
const { combineResolvers } = require('graphql-resolvers');

module.exports = {
    Query: {
        tasks: combineResolvers(isAuthenticated, async (_, __, { userId }) => {
            try {
                const tasks = await Task.find({ user: userId });
                return tasks;
            } catch (error) {
                console.log("Error is ----->", error);
                throw error;
            }
        }),
        task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }, { userId }) => {
            try {
                const task = Task.findById(id);
                return task;
            } catch (error) {
                console.log("Error is ---->", error);
                throw error;
            }
        }),
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated, async (_, { input }, { email }) => {
            try {
                const user = await User.findOne({ email });
                const task = new Task({...input, user:user.id })
                const result = await task.save()
                user.tasks.push(result.id);
                await user.save();
                return result;
            } catch (error) {
                console.log('Error -------->', error);
                throw error;
            }
        }),
        updateTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, {id, input }) => {
            try {
                const task = await Task.findByIdAndUpdate(id, { ...input }, { new: true });
                return task;
            } catch (error) {
                console.log("Error is ------>", error)
                throw error;
            }
        }),
        deleteTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, {id }, { userId }) => {
            try {
                 const task = await Task.findByIdAndDelete(id);
                 await User.updateOne({_id: userId}, {$pull: { tasks: task.id }});
                 return task;
            } catch (error) {
                console.log("Error is ------>", error)
                throw error;
            }
        })
    },
    Task: {
        user: ({ user }) => {
            return User.findById(user);
        }
    }
}