import express from 'express';
import { Category } from '../models/category';
import httpStatus from 'http-status'

const router = express.Router();

/* This endpoint is wrapped using an asyncMiddleware function 
to catch an error instead of try-catch block for experiment purposes.*/

/**
* @api {get} /api/shelves Provides information about items belonging to all categories.
* @apiName GetCategories
* @apiGroup Category
* @apiPermission none
*
*
*
*/
export async function getAllCategories(req, res) {
  const categories = await Category.find();
  if (categories.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: 'The category does not exist.' });
  }
  return categories;
};

/**
 * @api {get} /categories/:categoryName   Provides information about items belonging to a certain category(food or hygiene).
 * @apiName getCategory
 * @apiGroup Category
 * @apiPermission none
 * 
 * @apiParam {String} categoryName: food or hygiene
 * 
 * @apiError CategoryWasNotFound   The given category was not found. 
 */
export async function getItemsByCategoryName(req, res) {
  const { categoryName } = req.params;

  let items = [];
  const category = await Category.find({ name: categoryName });
  if (!category || category.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: 'The given category was not found.' });
  }

  category.forEach((value) => {
    items.push(value.item.name);
  });

  return items;
};

/**
 * @api {get} /categories/:categoryName/:itemName Provides information about items of the same category and with the same name.
 * @apiName getCategoryItems
 * @apiGroup Category
 * @apiPermission none
 * 
 * @apiParam {String} categoryName: food or hygiene
 * @apiParam {String} itemName
 * 
 * @apiError CategoryWasNotFound   The given category was not found. 
 * @apiError ItemWasNotFound   The given item was not found. 
 */
export async function getItemsByCategoryNameAndItemName(req, res) {
  const { categoryName, itemName } = req.params;

  let items = [];

  const category = await Category.find({ name: categoryName });
  if (!category) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: 'The given category was not found' });
  }

  for (const product of category) {
    if (product.item.name === itemName) {
      items.push(product.item.name);
    }
  }

  if (items.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: 'The given item does not exist' });
  }
  return items;
};

export default router;