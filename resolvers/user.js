const uuid = require('uuid');

module.exports = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(user => user.id === id)
    },
    User: {
        tasks: (parent) => tasks.filter(task => task.userId === parent.id)
    }
}