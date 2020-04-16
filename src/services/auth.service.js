import { User, userSchema } from '../models/user';
import config from 'config';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

// import express from 'express';
// import asyncMiddleware from '../middleware/async';
// const router = express.Router();

/**
 * @api {post} /api/auth Authentcate user
 * @apiName authPost
 * @apiGroup auth
 *  
 * @apiParam {String} email    Email of the User
 * @apiParam {String} password Password of the User
 * 
 * @apiSuccess {String} token New token genereted of the User
 * 
 * @apiError email is required
 * @apiError password is required
 */
export async function authentcateUser(req, res) {
  const { email, password } = req.body;

  const { error } = validate({ email, password });
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }

  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: 'Invalid email or password.' })
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: 'Invalid email or password.' })
  }

  const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'), { expiresIn: '1h' });
  // res.send(token);
  return token;
};

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required()
  }

  return Joi.validate(req, schema);
}

// export default router;