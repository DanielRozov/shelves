const { Product, validate } = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router();

// const products = [
//   { name: "product1" },
//   { name: "product2" },
//   { name: "product3" }
// ];

router.get('/', (req, res) => {
  res.send(products);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = new Product({ name: req.body.name });
  await product.save();

  res.send(product);
});

module.exports = router;