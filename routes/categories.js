import auth from '../middleware/auth';
import express from 'express';
import { Category, validateCategory } from '../models/category';
import { Item } from '../models/item';
import asyncMiddleware from '../middleware/async';
import admin from '../middleware/admin';

const router = express.Router();

/**
 * @api {post} / 
 * @apiName HandleCategories
 * @apiParam {String} name 
 * @apiParam {String} itemId
 * @apiError name is requires
 * @apiError itemId is requires
 * @apiPermission Only logged in admin can post this.
 * 
 */
router.post('/', [auth, admin], asyncMiddleware(async (req, res, next) => {
  const { name, itemId } = req.body;

  const { error } = validateCategory({ name, itemId });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let item = await Item.findById(itemId);
  if (!item) {
    return res.status(404).json({ message: "This product does not exists" });
  }

  let category = new Category({
    name: name,  // can set the category for food or hygiene
    item: {
      _id: item.id,
      name: item.name
    }
  });

  await category.save();
  res.status(201).send(category);
}));

/**
 * @api {put} /:itemId
 * @apiParam {Number} id Item unique ID 
 * @apiError name is requires
 * @apiError itemId is requires
 * 
 * @apiPermission Only logged in admin can put this.
 */
router.put('/:itemId', [auth, admin], asyncMiddleware(async (req, res) => {
  const { 'itemId': itemIdFromParams } = req.params;
  const { name, itemId } = req.body;

  const { error } = validateCategory({ name, itemId });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let categoryFromParams = await SearchCategoryByProductId(itemIdFromParams);
  if (!categoryFromParams) {
    return res.status(404).json({ message: 'The category does not exist.' });
  }

  let categoryFromBody = await SearchCategoryByProductId(itemId);
  if (!categoryFromBody) {
    return res.status(404).json({ message: 'The category does not exist.' });
  }

  const item = categoryFromBody.item;
  categoryFromParams = await Category.findByIdAndUpdate(categoryFromParams._id, {
    name: name,  // it is possible to set for foot or hygiene
    item: {
      _id: item.id,
      name: item.name
    }
  }, { new: true });

  if (!categoryFromParams) {
    return res.status(404).json({ message: 'The category does not exist.' });
  }

  res.send(categoryFromParams);
}));

/**
 * @api {delete} /:itemId
 * @apiParam {Number} id Item unique ID 
 * @apiError name is requires
 * @apiError itemId is requires
 * 
 * @apiPermission Only logged in admin can delete this.
 */
router.delete('/:itemId', [auth, admin], asyncMiddleware(async (req, res) => {
  const { itemId } = req.params;

  let category = await SearchCategoryByProductId(itemId);
  if (!category) {
    return res.status(404).json({ message: 'The category does not exist.' });
  }
  category = await Category.findByIdAndRemove(category._id);

  res.send(category);
}));

// Helper method, that
// searches for all categories: food and hygiene for a given itemId 
// and returns category
async function SearchCategoryByProductId(itemId) {
  const names = await Category.find();

  let category;
  names.forEach((c) => {
    if (c.item._id == itemId) {
      category = c;
    }
  });

  return category;
}

export default router;