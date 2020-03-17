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

router.get('/', async (req, res) => {
  const products = await Product.find().sort('name');
  res.send(products);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = new Product({ name: req.body.name });
  await product.save();

  res.send(product);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(req.params.id, { name: req.body.name },
    { new: true });

  if (!product) return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if(!product) return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
} );

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(!product) return res.status(404).send('The product with the given ID was not found');

  res.send(product);
});

module.exports = router;