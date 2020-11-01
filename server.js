const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const { connection } = require('./database/util');
const { verifyUser } = require('./helper/context');

// set env variables
dotEnv.config();

const app = express();

//db connectivity
connection();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        await verifyUser(req);
        return {
            email: req.email,
            userId: req.loggedInUserId,
        }
    }
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
    res.send({message : 'Hello'});
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
})