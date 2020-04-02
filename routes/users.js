import auth from '../middleware/auth'
import { User, validateUser } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import express from 'express';
import asyncMiddleware from '../middleware/async';
import admin from '../middleware/admin';

const router = express.Router();

/**
 * @api {get} / Request Users information
 * @apiName GetUsers
 * @apiGroup User
 */
router.get('/', asyncMiddleware(async (req, res) => {
  const users = await User.find();
  res.send(users);
}));

/**
 * @api {post} / 
 * @apiParam {String} username
 * @apiParam {String} email
 * @apiParam {String} password
 */
router.post('/', asyncMiddleware(async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  const { error } = validateUser({ username, email, password });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already registred.' })
  }

  user = new User({ username, email, password, isAdmin });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'), { expiresIn: '1h' });
  res.header('x-auth-token', token).send({ username, email, isAdmin });
}));

/**
 * @api {put} /:id
 * @apiParam {Number} id User unique ID
 * @apiPermission Only logged in users can put this.
 */
router.put('/:id', auth, asyncMiddleware(async (req, res) => {
  const { username, email, password } = req.body;
  const { id } = req.params;

  const { error } = validateUser({ username, email, password });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.find({ _id: id }).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'This user does not exist.' });
  }

  user = await User.findByIdAndUpdate(id, { username, email, password },
    { new: true });

  res.send({ user });
}));

/**
 * @api {delete} /:id
 * @apiParam {Number} id User unique ID
 * @apiPermission Only logged in admin can delete this.
 */
router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  let user = await User.find({ _id: id }).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'This user does not exist.' });
  }

  user = await User.findByIdAndRemove({ _id: id });

  res.send(user);
}));

/**
 * @api {get} /:id Request User by ID information
 * @apiParam {Number} id User unique ID
 */
router.get('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  let user = await User.find({ _id: id }).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'This user does not exist.' });
  }

  res.send(user);
}));

export default router;