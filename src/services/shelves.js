import express from 'express';
import { Category } from '../models/category';
import asyncMiddleware from '../middleware/async';

const router = express.Router();

// This endpoint is wrapped using an asyncMiddleware function 
// to catch an error instead of try-catch block for experiment purposes.
/**
 * @api {get} / Request AllCategories information
 * @apiName GetAllCategories
 * @apiGroup Categorie
 */
router.get('/', asyncMiddleware(async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
}));

/**
 * @api {get} /categories/:categoryName Request Category information
 * @apiParam {String} categoryName: food or hygiene
 */
router.get('/categories/:categoryName', asyncMiddleware(async (req, res) => {
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

/**
 * @api {get} /categories/:categoryName/:itemName Request GetAllItemsByItemName information
 * @apiParam {String} categoryName: food or hygiene
 * @apiParam {String} itemName
 */
router.get('/categories/:categoryName/:itemName', async (req, res) => {
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