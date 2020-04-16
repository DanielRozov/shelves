import { Item } from '../models/item';
import validateItem from '../models/item';
import httpStatus from 'http-status'

/**
 * @api {get} /api/items Request Items information
 * @apiName GetAllItems
 * @apiGroup Item 
 */
export async function getAllItems() {
  const items = await Item.find();
  return items;
};

/**
 * @api {post} /api/items
 * @apiName CreateItem
 * @apiGroup Item
 *  
 * @apiParam {String} name Mandatory name of the Item
 * 
 * @apiError name is required
 * 
 * @apiPermission Only logged in users can post this.
 * 
 * @apiSuccess {String} name Name of the Item.
 */
export async function createItem(req, res) {
  const { name } = req.body;
  const { error } = validateItem({ name });
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }

  let item = new Item({ name });
  item = await item.save();

  return item;
};

/**
 * @api {put} /api/items/:id 
 * @apiName UpdateItem
 * @apiGroup Item 
 * 
 * @apiParam {Number} id Item unique ID 
 * @apiError name is required
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1 404 Not Found
 *        {
 *          "error": "This product does not exist."
 *        }
 * @apiPermission Only logged in users can put this.
 */
export async function updateItem(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  const { error } = validateItem({ name });
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }

  let item = await Item.find({ _id: id }).limit(1);
  if (!item || item.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatus.NOT_FOUND, message: "This product does not exists" });
  }
  item = await Item.findByIdAndUpdate(id, { name },
    { new: true });

  return item;
};

/**
 * @api {delete} /api/items/:id 
 * @apiName DeleteItem
 * @apiGroup Item
 *
 * @apiPermission Only logged in admin can delete this.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       'error': 'Access denied. No token provided.'
 *     }
 * 
 * @apiParam {Number} id Item unique ID 
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
      .json({ status: httpStatus.NOT_FOUND, message: 'The product does not exist.' });
  }

  item = await Item.findByIdAndRemove(id);
  return item;
};

/**
 * @api {get} /api/items/:id 
 * @apiName GetItem
 * @apiGroup Item
 * @apiPermission Authorized
 * 
 * @apiParam {Number} id The Item unique ID 
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
      .json({ status: httpStatus.NOT_FOUND, message: 'The item does not exist.' });
  }
  return item;
};