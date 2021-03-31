const mongoose = require('mongoose');

const { username, password } = require('./config.js');
const { productSchema } = require('../models/productModel');
const { userSchema } = require('../models/userModel');

const uri = `mongodb+srv://${username}:${password}@cluster0.5tig9.mongodb.net/products?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then()
  .catch(console.log);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('connected', () => console.log('Connection Successful'));

module.exports = {
  Product: mongoose.model('Product', productSchema),
  User: mongoose.model('User', userSchema),
};
