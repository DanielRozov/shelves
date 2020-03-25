import express from 'express';
import { Category } from '../models/category';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (ex) {
    return res.status(500).send('Something failed', ex);
  }
});

router.get('/:categoryName', async (req, res) => {
  const { categoryName } = req.params;

  console.log(categoryName);
  if (!categoryName) {
    return res.status(404).send(`The given category:  ${categoryName} does not exist.`);
  }

  let items = [];
  try {
    const category = await Category.find({ name: categoryName });

    category.forEach((value) => {
      items.push(value.item.name);
    });

    res.send(items);
  } catch (e) {
    return res.status(404).send('This shelve is empty or does not exist', e);
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