import express from 'express';
import { Category } from '../models/category';
import { Item } from '../models/item';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find();
    if (!categories) {
      return res.status(404).send('Categories was not found');
    }
    res.send(categories);
  } catch (e) {
    next(e);
  }
});

router.get('/:categoryName', async (req, res, next) => {
  const categoryName = req.params.categoryName;
  validateCategoryName(categoryName);

  let items = [];
  try {
    const agg = await Category
      .aggregate([
        { $match: { name: categoryName } }
      ]);

    agg.forEach((value) => {
      items.push(value.item.name);
    });

    if (typeof items == 'undefined' || items.length == 0) {
      return res
        .status(404)
        .send(`This shelve is empty or not exist`);
    }
    res.send(items);
  } catch (e) {
    next(e);
  }
});

router.get('/:categoryName/:itemName', async (req, res, next) => {
  let categoryName = req.params.categoryName;
  validateCategoryName(categoryName);

  let itemName = req.params.itemName;
  validateItemName(itemName);

  let items = [];
  try {
    const agg = await Category
      .aggregate([
        { $match: { name: categoryName } }
      ]);

    for (const cat of agg) {
      if (cat.item.name == itemName) {
        items.push(cat.item.name);
      }
    }
    if (typeof items == 'undefined' || items.length == 0) {
      return res
        .status(404)
        .send(`The given item: ${itemName} does not belong to category: ${categoryName}`);
    }
    res.send(items);
  } catch (e) {
    next(e);
  }
});

function validateCategoryName(name) {
  const regex = '/^(food|hygiene)$/ig';
  const isCategory = name.match(regex);
  if (isCategory) {
    return res.status(400).send(`Category: ${name} does not exist`);
  }
}

function validateItemName(name) {
  const regex = '/^(fruits|meat|fish|drinks|bread|tampon|deodorant|antiprespirant|aftershave|shampoo)$/ig';
  const isItem = (name.match(regex));
  if (isItem) {
    return res.status(400).send(`Item: ${name} does not exist`);
  }
}

// Helper method. 
// Searches for all categories: food and hygiene for a given categoryName 
// and returns array of categories
async function findCategoryByCategoryName(categoryName) {
  const names = await Category
    .aggregate([{ $match: { 'name': { $regex: /^(food|hygiene)$/ } } }]);

  let category;
  names.forEach((c) => {
    if (c.item.name == categoryName) {
      category = c;
    }
  });

  return category;
}
export default router;