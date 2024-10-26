const { gql } = require("apollo-server-express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Category = require("../models/Category");

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
    products: [Product]!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    orders: [Order]!
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
    addCategory(name: String!, description: String): Category
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

const resolvers = {
  Query: {
    products: async () => {
      return await Product.find().populate("categoryId");
    },
    product: async (_, { _id }) => {
      return await Product.findById(_id).populate("categoryId");
    },
    orders: async () => {
      return await Order.find().populate("userId").populate("products");
    },
    order: async (_, { _id }) => {
      return await Order.findById(_id).populate("userId").populate("products");
    },
    users: async () => {
      return await User.find();
    },
    user: async (_, { _id }) => {
      return await User.findById(_id);
    },
  },
  Mutation: {
    addCategory: async (_, { name, description }) => {
      return await Category.create({ name, description });
    },
    addProduct: async (_, { name, price, description, stock, categoryId }) => {
      return await Product.create({
        name,
        price,
        description,
        stock,
        categoryId,
      });
    },
    updateProduct: async (
      _,
      { _id, name, price, description, stock, categoryId }
    ) => {
      return await Product.findByIdAndUpdate(
        _id,
        { name, price, description, stock, categoryId },
        { new: true }
      );
    },
    deleteProduct: async (_, { _id }) => {
      return await Product.findByIdAndDelete(_id);
    },
    addOrder: async (_, { userId, products }) => {
      return await Order.create({ userId, products });
    },
    addUser: async (_, { name, email }) => {
      return await User.create({ name, email });
    },
  },
  Product: {
    category: async (product) => {
      return await Category.findById(product.categoryId);
    },
  },
  Category: {
    products: async (category) => {
      return await Product.find({ categoryId: category._id });
    },
  },
  User: {
    orders: async (user) => {
      return await Order.find({ userId: user._id });
    },
  },
  Order: {
    userId: async (order) => {
      return await User.findById(order.userId);
    },
    products: async (order) => {
      return await Product.find({ _id: { $in: order.products } });
    },
  },
};

module.exports = { typeDefs, resolvers };
