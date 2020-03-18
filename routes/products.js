import { Product, validateProduct } from '../models/product';
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find().sort('name').select({ name: 1 });
  res.send(products);
});

router.post('/', async (req, res) => {

  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let product = new Product({ name: req.body.name });
  product = await product.save();

  res.send(product);
});

router.put('/:id', async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let product;

  // try {
  //   product = await Product.find({ _id: req.params.id }).limit(1);
  // } catch (e) {
  //   return res.status(404).json({ message: "This product does not exists" });
  // }

  product = await Product.findById(req.body.id);
  if (!product) {
    return res.status(400).send('Invalid product');
  }

  try {
    product = await Product.findByIdAndUpdate(req.params.id, { name: req.body.name },
      { new: true });
  } catch (e) {
    return res.status(404).send('The product with the given ID was not found.');
  }

  res.send(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) {
    return res.status(404).send('The product with the given ID was not found.');
  }

  res.send(product);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).send('The product with the given ID was not found');
  }

  res.send(product);
});

export default router;