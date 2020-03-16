const express = require('express');
const app = express();
const products = require('../routes/products');


module.exports = function (app) {
  app.use(express.json());
  app.use('/api/shelves/categories/products', products);
}