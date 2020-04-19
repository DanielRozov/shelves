import { Item } from '../models/item';
import validateItem from '../models/item';
import httpStatus from 'http-status'

/**
 * @api {get} /api/items Request Get Items information.
 * @apiName GetAllItems
 * @apiGroup Item 
 * @apiPermission none
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "items": 12,
 *   "categories": [
 *      "bread",
 *      "drinks"...,
 *   ]
 * }
 */
export async function getAllItems() {
  const items = await Item
    .find({}, { _id: 0 })
    .sort({ name: 1 });
  let categories = [];
  items.forEach(element => (categories.push(element.name)));
  return categories;
};

/**
 * @api {get} /api/categories/items/:id Get Item information.
 * @apiName GetItem
 * @apiGroup Item
 * @apiPermission none
 * 
 * @apiParam {Number} id The Item unique ID.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "item": [
 *     {
 *        "_id": "5e96...*",
 *        "name": "milk",
 *        "__v": 0
 *     }
 *   ],
 *   "message": "Item successfully retrived."
 * }
 *  
 * @apiError NotFound This item does not exist. 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1 404 Not Found
 *        { 
 *          "status": 404,
 *          "message": "This item does not exist."
 *        }
 */
export async function getItemById(req, res) {
  const { id } = req.params;

  let item = await Item.find({ _id: id }).limit(1);
  if (!item || item.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'The item does not exist.' });
  }
  return item;
};

/**
 * @api {post} /api/categories/items Create a new item.
 * @apiName CreateItem
 * @apiGroup Item
 * @apiPermission admin
 *  
 * @apiParam {String} name Name of the Item is required.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 * {
 *   "item": {
 *     "_id": "5e9c...*",
 *     "name": "milk",
 *     "__v": 0
 *   },
 *   "message": "Succesfully created"
 * }
 *
 * @apiError NameIsRequired     Name is required.
 * @apiError Unauthorized       Access denied. No token provided.  
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1  400 Bad Request
 *    {
 *      "message": "\"name\" is required"
 *    }
 * 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1   401 Unauthorized
 *        {
 *             "message": "Access denied. No token provided."
 *        }
 */
export async function createItem(req, res) {
  const { name } = req.body;
  const { error } = validateItem({ name });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  let item = new Item({ name });
  item = await item.save();

  return item;
};

/**
 * @api {put} /api/categories/items/:id  Update an item.
 * @apiName UpdateItem
 * @apiGroup Item 
 * @apiPermission admin
 * 
 * @apiParam {Number} id Item unique ID. 
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 202 Accepted
 * {
 *   "item": {
 *      "_id": "5e9c2e366...*",
 *      "name": "drinks",
 *      "__v": 0
 *  },
 *  "message": "Item succesfully updated"
 * }
 * 
 * @apiError NameIsRequired     Name is required.
 * @apiError Unauthorized       Access denied. No token provided.  
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1  400 Bad Request
 *    {
 *      "message": "\"name\" is required"
 *    }
 * 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1   401 Unauthorized
 *        {
 *             "message": "Access denied. No token provided."
 *        }
 */
export async function updateItem(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  const { error } = validateItem({ name });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  let item = await Item.find({ _id: id }).limit(1);
  if (!item || item.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "This product does not exists." });
  }
  item = await Item.findByIdAndUpdate(id, { name },
    { new: true });

  return item;
};

/**
 * @api {delete} /api/categories/items/:id  Delete an item.
 * @apiName DeleteItem
 * @apiGroup Item
 * @apiPermission admin
 * 
 * @apiParam {Number} id Item unique ID 
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1  200 OK
 * {
 *   "item": {
 *     "_id": "5e96...*",
 *     "name": "milk",
 *     "__v": 0
 *   },
 *   "message": "Item successfully deleted."
 * }
 * 
 * @apiError Unauthorized   Access denied. No token provided.
 * @apiError NotFound       This item does not exist.
 * 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1   401 Unauthorized
 *        {
 *             "message": "Access denied. No token provided."
 *        }
 * 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1 404 Not Found
 *        { 
 *          "status": 404,
 *          "message": "This item does not exist."
 *        }
 */
export async function deleteItemById(req, res) {
  const { id } = req.params;

  let item = await Item.find({ _id: id }).limit(1);
  if (!item || item.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'The product does not exist.' });
  }

  item = await Item.findByIdAndRemove(id);
  return item;
};