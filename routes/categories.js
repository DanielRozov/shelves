import express from 'express';
import { Category, validateCategory } from '../models/category';
import { Item } from '../models/item';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const category = await Category
      .find({})
      // .populate('-_id', 'item name -_id')
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

router.post('/', async (req, res, next) => {

  let item;
  try {
    item = await Item.findById(req.body.itemId);
  } catch (e) {
    return res.status(404).json({ message: "This product does not exists" });
  }

  const { error } = validateCategory(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    let category = new Category({
      name: req.body.name,  // it is possible to set for foot or hygiene
      item: {
        _id: item.id,
        name: item.name
      }
    });

    await category.save();
    return res.status(201).send(category);
  } catch (e) {
    next(e)
  }
});


router.put('/:itemId', async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let categoryFromParams;
  try {
    categoryFromParams = await findCategoryByItemIdOfAllCategories(req.params.itemId);
    if (!categoryFromParams) {
      return res.status(404), send('The category with the given was not found.');
    }
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ error: 'Not valid ID' });
    } else {
      return res.status(500).send({ error: 'Internal Error' });
    }
  }

  let categoryFromBody;
  try {
    categoryFromBody = await findCategoryByItemIdOfAllCategories(req.body.itemId);
    if (!categoryFromBody) {
      return res.status(404).send('The item with the givsen id was not found');
    }
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ error: 'Not valid ID' });
    } else {
      return res.status(500).send({ error: 'Internal Error' });
    }
  }

  const item = categoryFromBody.item;
  try {
    categoryFromBody = await Category.findByIdAndUpdate(categoryFromBody._id, {
      name: req.body.name,  // it is possible to set for foot or hygiene
      item: {
        _id: item.id,
        name: item.name
      }
    }, { new: true });

    if (!categoryFromBody) {
      return res.status(404).send('The category with the given ID was not found.');

      res.send(categoryFromBody);
    }
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ error: 'Not valid ID' });
    } else {
      return res.status(500).send({ error: 'Internal Error' });
    }
  }
});

router.delete('/:itemId', async (req, res, next) => {
  let category
  try {
    category = await findCategoryByItemIdOfAllCategories(req.params.itemId);
    category = await Category.findByIdAndRemove(category._id);
    
    if (!category) {
      return res.status(404).send('The item with the given ID was not found');
    }

    res.send({ category });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ error: 'Not valid ID' });
    } else {
      return res.status(500).send({ error: 'Internal Error' });
    }
  }
});

// Helper method. 
// Searches for all categories: food and hygiene for a given itemId 
// and returns category
async function findCategoryByItemIdOfAllCategories(itemId) {
  const names = await Category
    .aggregate([{ $match: { 'name': { $regex: /^(food|hygiene)$/ } } }]);

  let category;
  names.forEach((c) => {
    if (c.item._id == itemId) {
      category = c;
    }
  });

  return category;
}

export default router;