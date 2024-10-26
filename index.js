const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema/schema");

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

const PORT = process.env.PORT || 4000;
const MONGODB_URI = "mongodb://localhost:27017/";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    server.start().then(() => {
      server.applyMiddleware({ app });
      app.listen(PORT, () => {
        console.log(
          `Server is running on http://localhost:${PORT}${server.graphqlPath}`
        );
      });
    });
  })
  .catch((err) => console.error(err));
