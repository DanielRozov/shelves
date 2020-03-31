import { Item } from '../models/item';
import validateItem from '../models/item';
import express from 'express';
import asyncMiddleware from '../middleware/async';

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const items = await Item.find();
  res.send(items);
}));

router.post('/', asyncMiddleware(async (req, res) => {
  const { name } = req.body;

  const { error } = validateItem(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let item = new Item({ name });
  item = await item.save();

  res.send(item);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const { error } = validateItem({ name });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let item = await Item.find({ _id: id }).limit(1);
  if (!item) {
    return res.status(404).json({ message: "This product does not exists" });
  }
  item = await Item.findByIdAndUpdate(id, { name },
    { new: true });

  res.send(item);
}));

router.delete('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  let item = await Item.find({ _id: id }).limit(1);
  if (!item) {
    return res.status(404).json({ message: 'The product does not exist.' });
  }
  item = await Item.findByIdAndRemove(req.params.id);

  res.send(item);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  let item = await Item.find({ _id: id }).limit(1);
  if (!item) {
    return res.status(404).json({ message: 'The product does not exist.' });
  }

  res.send(item);
}));

export default router;