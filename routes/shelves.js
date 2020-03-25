import express from 'express';
import { Category } from '../models/category';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (ex) {
    next(ex);
  }
});

router.get('/:categoryName', async (req, res) => {
  const { categoryName } = req.params;

  let items = [];
  try {
    const category = await Category.find({ name: categoryName });

    category.forEach((value) => {
      items.push(value.item.name);
    });

    res.send(items);
  } catch (e) {
    return res.status(404).send(`The given category does not exist.`);
  }
});

router.get('/:categoryName/:itemName', async (req, res) => {
  const { categoryName, itemName } = req.params;

  let items = [];
  try {
    const category = await Category.find({ name: categoryName });

    for (const product of category) {
      if (product.item.name === itemName) {
        items.push(product.item.name);
      }
    }

    res.send(items);
  } catch (e) {
    return res.status(404).send('The given item or category does not exist.', e);
  }
});

export default router;