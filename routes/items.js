import { Item, itemSchema, validateItem } from '../models/item';
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Item
    .find()
  //  .sort('productCategory')
  //.populate('-_id') // exclude an id from the query
  //.select('name');

  console.log(items);
  res.send(items);
});

router.post('/', async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let item = new Item({ name: req.body.name });
  item = await item.save();

  res.send(item);
});

router.put('/:id', async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let item;

  try {
    item = await Item.find({ _id: req.params.id }).limit(1);
  } catch (e) {
    return res.status(404).json({ message: "This item does not exists" });
  }

  // product = await Product.findById(req.body.id);
  // if (!product) {
  //   return res.status(400).send('Invalid product');
  // }

  try {
    item = await Product.findByIdAndUpdate(req.params.id, { name: req.body.name },
      { new: true });
  } catch (e) {
    return res.status(404).send('The product with the given ID was not found.');
  }

  res.send(item);
});

router.delete('/:id', async (req, res) => {
  const item = await Product.findByIdAndRemove(req.params.id);

  if (!item) {
    return res.status(404).send('The item with the given ID was not found.');
  }

  res.send(item);
});

router.get('/:id', async (req, res) => {
  let item;

  try {
    item = await Product.find({ _id: req.params.id }).limit(1);
  } catch (e) {
    return res.status(404).json({ message: "This product does not exists" });
  }

  res.send(item);
});

export default router;