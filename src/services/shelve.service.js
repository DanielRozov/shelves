import { Category } from '../models/category';
import httpStatus from 'http-status'

/* This endpoint is wrapped using an asyncMiddleware function 
to catch an error instead of try-catch block for experiment purposes.*/

/**
* @api {get} /api/shelves/categories Get the Shelves information.
* @apiName GetCategories
* @apiGroup Shelves
* @apiPermission user
*
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
* {
*   "shelves": {
*     "food": {
*       "items": 8,
*       "categories": [
*           "drinks"...     
*       ]
*   },
*   "hygiene": {
*     "items": 5,
*     "categories": [
*      "deodorant"...            
*      ]
*    }
*  }
* }
*/
export async function getAllCategories(req, res) {
  const shelves = {
    food: {
      items: 0,
      categories: []
    },
    hygiene: {
      items: 0,
      categories: []
    }
  }

  const foodCategories = await Category
    .find({ 'name': 'food' })

  foodCategories.forEach(element => shelves.food.categories.push(element.item.name));
  shelves.food.items = shelves.food.categories.length;

  const hygieneCategories = await Category
    .find({ 'name': 'hygiene' })

  hygieneCategories.forEach(element => shelves.hygiene.categories.push(element.item.name));
  shelves.hygiene.items = shelves.hygiene.categories.length;

  return shelves;
};


/**
 * @api {get} /api/shelves/categories/:categoryName   Get a category information.
 * @apiName getCategory
 * @apiGroup Shelves
 * @apiPermission none
 * 
 * @apiParam {String} categoryName: food or hygiene. 
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "items": 8,
 *   "categories": [
 *       "drinks",
 *       "fish"...
 *   ]
 * }
 * 
 * @apiError  CategoryWasNotFound   The given category was not found.
 * @apiError  AccessDenied          Access denied. No token provided.
 * @apiError  TheTokenIsExpiried    The token is expired or invalid.
 * @apiDefine NotFound              This category does not exist.
 * 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1 404 Not Found
 *        { 
 *             "message": "This category does not exist."
 *        }
 * 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1   401 Unauthorized
 *        {
 *             "message": "Access denied. No token provided."
 *        }
 * 
 * * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1   401 Unauthorized
 *        {
 *             "message": "The token is expired or invalid."
 *        }
 */
export async function getItemsByCategoryName(req, res) {
  const { categoryName } = req.params;

  const items = [];
  const category = await Category.find({ name: categoryName });
  if (!category || category.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'This category does non exist.' });
  }

  category.forEach((value) => {
    items.push(value.item.name);
  });

  return items;
};

/**
 * @api {get} /api/shelves/categories/:categoryName/:itemName  Get an item information.
 * @apiName getCategoryItems
 * @apiGroup Shelves
 * @apiPermission none
 * 
 * @apiParam {String} categoryName Mandatory food or hygiene.
 * @apiParam {String} itemName     Mandatory name of the Item. 
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "items": 2,
 *   "products": [
 *      "aftershave"...
 *   ]
 * }
 * 
 * @apiError ItemNotFound       This item does not exist.  
 * @apiError CategoryNotFound   This category does not exist. 
 * 
 * 
 */
export async function getItemsByCategoryNameAndItemName(req, res) {
  const { categoryName, itemName } = req.params;

  const items = [];
  const category = await Category.find({ name: categoryName });
  if (!category) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'This category does not exist.' });
  }

  for (const product of category) {
    if (product.item.name === itemName) {
      items.push(product.item.name);
    }
  }

  if (items.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'This item does not exist' });
  }
  return items;
};