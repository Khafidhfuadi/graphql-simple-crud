const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    price: Float!
    description: String
    stock: Int!
    category: Category
  }

  type Order {
    _id: ID!
    userId: User!
    products: [Product]!
    createdAt: String!
  }

  type Category {
    _id: ID!
    name: String!
    description: String
  }

  type User {
    _id: ID!
    name: String!
    email: String!
  }

  type Query {
    products: [Product]
    product(_id: ID!): Product
    orders: [Order]
    order(_id: ID!): Order
    categories: [Category]
    category(_id: ID!): Category
    users: [User]
    user(_id: ID!): User
  }

  type Mutation {
    addProduct(
      name: String!
      price: Float!
      description: String
      stock: Int!
      categoryId: ID!
    ): Product
    updateProduct(
      _id: ID!
      name: String
      price: Float
      description: String
      stock: Int
      categoryId: ID
    ): Product
    deleteProduct(_id: ID!): Product
    addOrder(userId: ID!, products: [ID]!): Order
    addUser(name: String!, email: String!): User
  }
`;

module.exports = typeDefs;
