import express from 'express';
import { Category, validateCategory } from '../models/category';
import { Item } from '../models/item';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res, next) => {
  let shelves;
  let foodItems = [];
  let hygieneItems = [];
  try {
    shelves = await Category
    .find({name: 'food'})
    .populate('name.item -_id')
    .select('item.name');

    console.log(shelves);
    res.send(shelves);
  } catch (e) {
    next(e);
  }
});

router.get('/:categoryName', async (req, res) => {
  try {
    const category = await Category
      .find({})
      .populate('-_id', 'item name -_id')
      .select('item name')
    if (!category) {
      return res.status(404).send({ error: 'Not Found' });
    }
    console.log({ category });
    res.send(category);
  } catch (e) {
    next(e);
  }
});

router.get('/:categoryName/items', async (res, req, next) => {

});


// Helper method. 
// Searches for all categories: food and hygiene for a given categoryName 
// and returns array of categories
async function findCategoryByItemIdOfAllCategories(categoryName) {
  const names = await Category
    .aggregate([{ $match: { 'name': { $regex: /^(food|hygiene)$/ } } }]);

  let category;
  names.forEach((c) => {
    if (c.item._id == categoryName) {
      category = c;
    }
  });

  return category;
}
export default router;