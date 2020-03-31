import express from 'express';
import { Category } from '../models/category';
import asyncMiddleware from '../middleware/async';

const router = express.Router();

// This endpoint is wrapped using an asyncMiddleware function 
// to catch an error instead of try-catch block for experiment purposes.
router.get('/', asyncMiddleware(async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
}));

router.get('/:categoryName', asyncMiddleware(async (req, res) => {
  const { categoryName } = req.params;

  let items = [];
  const category = await Category.find({ name: categoryName });
  if (!category) {
    return res.status(404).send('The given category was not found');
  }

  category.forEach((value) => {
    items.push(value.item.name);
  });

  res.send(items);
}));

router.get('/:categoryName/:itemName', async (req, res) => {
  const { categoryName, itemName } = req.params;

  let items = [];
  try {
    const category = await Category.find({ name: categoryName });
    if (!category) {
      return res.status(404).send('The given category was not found');
    }

    for (const product of category) {
      if (product.item.name === itemName) {
        items.push(product.item.name);
      }
    }

    res.send(items);
  } catch (ex) {
    return res.status(500).send('Something failed.', ex);
  }
});

export default router;