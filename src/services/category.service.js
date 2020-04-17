import auth from '../middleware/auth';
import { Category, validateCategory } from '../models/category';
import { Item } from '../models/item';
import asyncMiddleware from '../middleware/async';
import admin from '../middleware/admin';
import httpStatus from 'http-status'


/**
 * @api {post} /api/items
 * @apiName postCategory
 * @apiGroup Category
 * @apiPermission admin
 * 
 * @apiParam {String} name   Category name food/hygiene
 * @apiParam {String} itemId Unique ID of the Item
 * 
 * @apiError name is required 
 * @apiError itemId is required
 * 
 * @apiError Unauthorized       Access denied. No token provided.
 * @apiError CategoryNotFound   This category does not exists. 
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "status": 400,
 *        "message": "Invalid token."
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "status": 401,
 *        "message": "Access denied. No token provided."
 *     }
 * 
 */
export async function createCategory(req, res) {
  const { name, itemId } = req.body;

  const { error } = validateCategory({ name, itemId });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: error.details[0].message });
  }

  let item = await Item.findById(itemId);
  if (!item) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: "This category does not exists" });
  }

  let category = new Category({
    name: name,  // can set the category for food or hygiene
    item: {
      _id: item.id,
      name: item.name
    }
  });

  await category.save();
  return category;
};

/**
 * @api {put} /api/items/:itemId
 * @apiName putCategory
 * @apiGroup Category
 * @apiPermission admin
 *
 * @apiDescription In this case "apiUse" is define and used.
 * 
 * @apiParam {Number} id Unique Item ID to be changed.
 * @apiParam {Number} id Unique Item ID which will replace the previous item.
 * 
 * @apiError name   is requires
 * @apiError itemId is requires
 * 
 * @apiError Unauthorized  Access denied. No token provided.
 * 
 * @apiUse CreateCategoryError
 */
export async function updateCategory(req, res) {
  const { 'itemId': itemIdFromParams } = req.params;
  const { name, itemId } = req.body;

  const { error } = validateCategory({ name, itemId });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: error.details[0].message });
  }

  let categoryFromParams = await SearchCategoryByProductId(itemIdFromParams);
  if (!categoryFromParams) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: 'The category does not exist.' });
  }

  let categoryFromBody = await SearchCategoryByProductId(itemId);
  if (!categoryFromBody) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: 'The category does not exist.' });
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
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: 'The category does not exist.' });
  }

  return categoryFromParams;
};

/**
 * @api {delete} /api/items/:itemId
 * @apiName deleteCategory
 * @apiGroup Category
 * @apiPermission admin
 *
 * @apiDescription In this case "apiUse" is define and used.
 *  
 * @apiParam {Number} id Item unique ID 
 *
 * @apiUse CreateCategoryError
 */
export async function deleteCategoryById(req, res) {
  const { itemId } = req.params;

  let category = await SearchCategoryByProductId(itemId);
  if (!category) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: 'The item does not exist.' });
  }
  category = await Category.findByIdAndRemove(category._id);

  return category;
};


/* Helper method, that
searches for all categories: food and hygiene for a given itemId 
and returns category
 */
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