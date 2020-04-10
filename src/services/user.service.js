import auth from '../middleware/auth'
import { User, validateUser, userSchema } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import express from 'express';
import asyncMiddleware from '../middleware/async';
import admin from '../middleware/admin';
import httpStatus from 'http-status'

const router = express.Router();

/**
 * @api {get} /api/users Request Users information
 * @apiName GetAllUsers
 * @apiGroup User
 * 
 * @apiSuccess {Number} id Unique id of the User.
 * @apiSuccess {String} username Username of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} password  Password of the User.
 * @apiSuccess {Boolean} isAdmin isAdmin of the user.
 * 
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5e82e5d9e795...",
 *      "username": "user1",
 *      "email": "user1@konkurenta.com",
 *      "password": "$2b$10$smByuSh3oWD..."
 *      "isAdmin": "true/false"
 *    }
 */
export async function getAllUsers() {
  const users = await User.find();
  return users;
};

/**
 * @api {post} /api/users
 * @apiName PostUser
 * @apiGroup User
 * 
 * @apiParam {String} username Mandatory username of the User.
 * @apiParam {String} email Mandatory email of the User.
 * @apiParam {String} password Mandatory password of the User.
 * @apiParam {Boolean} isAdmin Mandatory with value true/false.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username":"user22",
 *        "email":"user22@konkurenta.com",
 *	      "password":"12345",
 *	      "isAdmin":"false"
 *      }
 * 
 * @apiSuccess {String} username Username of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {Boolean} isAdmin isAdmin of the user.
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "User already registred."
 *     }
 */
export async function createUser(req, res) {
  const { username, email, password, isAdmin } = req;

  const { error } = validateUser({ username, email, password, isAdmin });
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

  return user;
}

/**
 * @api {put} /api/users/:id
 * @apiName UpdateUser
 * @apiGroup User
 * 
 * @apiParam {String} username Mandatory username of the User.
 * @apiParam {String} email Mandatory email of the User.
 * @apiParam {String} password Mandatory password of the User.
 * @apiParam {Boolean} isAdmin Mandatory with value true/false.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username":"user22",
 *        "email":"user22@konkurenta.com",
 *	      "password":"12345",
 *	      "isAdmin":"false"
 *      }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "User already registred."
 *     }
 * @apiErrorExample UserNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       'error': 'This user does not exist'
 *     }
 */
export async function updateUseById(req, res) {
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

  res.send(user);
};

/**
 * @api {delete} /api/users/:id
 * @apiName DeleteUser
 * @apiGroup User
 * 
 * @apiSuccess {Number} id Unique id of the User.
 * @apiSuccess {String} username Username of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} password  Password of the User.
 * @apiSuccess {Boolean} isAdmin isAdmin of the user.
 * 
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5e82e5d9e795...",
 *      "username": "user1",
 *      "email": "user1@konkurenta.com",
 *      "password": "$2b$10$smByuSh3oWD..."
 *      "isAdmin": "true/false"
 *    }
 * 
 
 * @apiErrorExample Forbidden:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       'error': 'Authorization failed'
 *     }
 */
export async function deleteUserById(req, res) {
  const { id } = req.params;

  let user = await User.find({ _id: id }).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'This user does not exist.' });
  }

  user = await User.findByIdAndRemove({ _id: id });

  res.send(user);
};

/**
 * @api {get} /api/user/:id Read data of a User
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission Authorized
 *
 * @apiParam {String}  id        The Users-ID.
 *
 * @apiSuccess {String}   id            The Users-ID.
 * @apiSuccess {Date}     username      The Users-username.
 * @apiSuccess {String}   email         The Users-email.
 * @apiSuccess {String}   password      The Users-password.
 * @apiSuccess {Boolean}  isAdmin       The value: true/false.
 *
 * @apiError NoAccessRight  Only authenticated Users can access the data.
 * @apiError UserNotFound   This user does not exist.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Access denied. No token provided."
 *     }
 */
export async function getUserById(req, res) {
  const { id } = req.params;

  let user = await User.find({ _id: id }).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'This user does not exist.' });
  }

  res.send(user);
};

// export default router;