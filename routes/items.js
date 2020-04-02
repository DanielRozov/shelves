import auth from '../middleware/auth';
import { Item } from '../models/item';
import validateItem from '../models/item';
import express from 'express';
import asyncMiddleware from '../middleware/async';
import admin from '../middleware/admin';

const router = express.Router();

/**
 * @api {get} / Request Items information
 * @apiName GetItems
 * @apiGroup Item 
 */
router.get('/', asyncMiddleware(async (req, res) => {
  const items = await Item.find();
  res.send(items);
}));

/**
 * @api {post} / 
 * @apiParam {String} name 
 * @apiError name is requires
 * @apiPermission Only logged in users can post this.
 * 
 */
router.post('/', auth, asyncMiddleware(async (req, res) => {
  const { name } = req.body;

  const { error } = validateItem(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let item = new Item({ name });
  item = await item.save();

  res.send(item);
}));

/**
 * @api {put} /:id 
 * @apiParam {Number} id Item unique ID 
 * @apiError name is requires
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1 404
 *        {
 *          "error": "This product does not exist."
 *        }
 * @apiPermission Only logged in users can put this.
 */
router.put('/:id', auth, asyncMiddleware(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const { error } = validateItem({ name });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let item = await Item.find({ _id: id }).limit(1);
  if (!item) {
    return res.status(404).json({ message: "This product does not exists" });
  }
  item = await Item.findByIdAndUpdate(id, { name },
    { new: true });

  res.send(item);
}));

/**
 * @api {delete} /:id 
 * @apiParam {Number} id Item unique ID 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1 404
 *        {
 *          "error": "This product does not exist."
 *        }
 * @apiPermission Only logged in admin can delete this.
 */
router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  let item = await Item.find({ _id: id }).limit(1);
  if (!item) {
    return res.status(404).json({ message: 'The product does not exist.' });
  }
  item = await Item.findByIdAndRemove(req.params.id);

  res.send(item);
}));

/**
 * @api {get} /:id 
 * @apiParam {Number} id Item unique ID 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/1.1 404
 *        {
 *          "error": "This product does not exist."
 *        }
 */
router.get('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  let item = await Item.find({ _id: id }).limit(1);
  if (!item) {
    return res.status(404).json({ message: 'The product does not exist.' });
  }

  res.send(item);
}));

export default router;