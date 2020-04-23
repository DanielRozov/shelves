import { Category, validateCategory } from '../models/category';
import { Item } from '../models/item';
import httpStatus from 'http-status'

/**
 * @api {post} /api/items Create a new category.
 * @apiName postCategory
 * @apiGroup Shelves
 * @apiPermission admin
 * 
 * @apiParam {String} name   Category name food/hygiene.
 * @apiParam {String} itemId Unique ID of the Item.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1   200 OK
 *     {
 *       "category": {
 *         "_id": "5e76...*",
 *         "name": "hygiene",
 *         "item": {
 *           "_id": "5e762e...*",
 *           "name": "deodorant"...
 *         },
 *       "__v": 0
 *       }
 *     }
 * 
 * @apiError NameIsRequired       Name is required. 
 * @apiError ItemIdIsRequired     ItemId is required.
 * @apiError AccessDenied         Access denied. No token provided.
 * @apiError TheTokenIsExpiried   The token is expired or invalid.
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "message": "\"name\" is required"
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "message": "\"itemId\" is required"
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {  
 *         "message": "Access denied. No token provided."
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {  
 *         "message": "The token is expired or invalid."
 *     }
 * 
 */
export async function createCategory(req, res) {
  const { name, itemId } = req.body;

  const { error } = validateCategory({ name, itemId });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  let item = await Item.findById(itemId);
  if (!item) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "This category does not exists" });
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
 * @api {put} /api/items/:itemId Update a category.
 * @apiName putCategory
 * @apiGroup Shelves
 * @apiPermission admin
 * 
 * @apiParam {Number} ItemIdToBeChanged      Unique Item ID to be changed.
 * @apiParam {Number} ItemIdWichWillReplace  Unique Item ID which will replace the previous item.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1   200 OK
 *     {
 *       "category": {
 *         "_id": "5e763...*",
 *         "name": "hygiene",
 *         "item": {
 *           "_id": "5e762e4...*",
 *           "name": "deodorant"
 *         },
 *       "__v": 0
 *       },
 *       "message": "Category updated successfully."
 *     }
 * 
 * @apiError ItemIdIsRequired           Item ID required.
 * @apiError AccesDenied                Access denied. No token provided.
 * @apiError TokenIsExpiredOrInvalid    The token is expired or invalid.
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "message": "\"itemId\" is required"
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {  
 *         "message": "Access denied. No token provided."
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {  
 *         "message": "The token is expired or invalid."
 *     }
 * 
 */
export async function updateCategory(req, res) {
  const { 'itemId': itemIdFromParams } = req.params;
  const { name, itemId } = req.body;

  const { error } = validateCategory({ name, itemId });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  let categoryFromParams = await SearchCategoryByItemtId(itemIdFromParams);
  if (!categoryFromParams) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'The category does not exist.' });
  }

  let categoryFromBody = await SearchCategoryByItemtId(itemId);
  if (!categoryFromBody) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'The category does not exist.' });
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
      .json({ message: 'The category does not exist.' });
  }

  return categoryFromParams;
};

/**
 * @api {delete} /api/items/:itemId Delete a category
 * @apiName deleteCategory
 * @apiGroup Shelves
 * @apiPermission admin
 *  
 * @apiParam {Number} id Item unique ID 
 *
 * @apiError ItemIdIsRequired           Item ID required.
 * @apiError AccesDenied                Access denied. No token provided.
 * @apiError TokenIsExpiredOrInvalid    The token is expired or invalid.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1   202 Accepted
 *     {
 *       "category": {
 *         "_id": "5e763...*",
 *         "name": "hygiene",
 *         "item": {
 *           "_id": "5e762e...",
 *           "name": "deodorant"
 *         },
 *       "__v": 0
 *       },
 *       "message": "Category deleted successfully."
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "message": "\"itemId\" is required"
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {  
 *         "message": "Access denied. No token provided."
 *     }
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {  
 *         "message": "The token is expired or invalid."
 *     }
 *
 */
export async function deleteCategoryByItemId(req, res) {
  const { itemId } = req.params;

  let category = await SearchCategoryByItemtId(itemId);
  if (!category) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'The item does not exist.' });
  }
  category = await Category.findByIdAndRemove(category._id);

  return category;
};


/* Helper method, that
searches for all categories: food and hygiene for a given itemId 
and returns category
 */
async function SearchCategoryByItemtId(itemId) {
  const names = await Category.find();

  let category;
  names.forEach((c) => {
    if (c.item._id == itemId) {
      category = c;
    }
  });

  return category;
}