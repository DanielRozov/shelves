import { User } from '../models/user';
import config from 'config';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

/**
 * @api {post} /api/auth Authentcate user.
 * @apiName AuthPost
 * @apiGroup Auth
 *  
 * @apiParam {String} email    Mandatory email of the User.
 * @apiParam {String} password Mandatory password of the User.
 * 
 * @apiSuccess {String} token New token genereted of the User.
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 202 Accepted
 *  {
 *   "token": "eyJhbGciO...*"
 *  }
 * 
 * @apiError EmailIsRequired     Email is required.
 * @apiError PasswordIsRequired  Password is required.
 * @apiError BadRequest          Invalid email or password.
 * 
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 400 Bad Request
 *      {
 *          "message": "\"username\" is required"
 *      }
 * 
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 400 Bad Request
 *      {
 *          "message": "\"email\" is required"
 *      }
 * 
 *  @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "Invalid email or password."
 *     }
 */
export async function authentcateUser(req, res) {
  const { email, password } = req.body;

  const { error } = validate({ email, password });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Invalid email or password.' })
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Invalid email or password.' })
  }

  const token = jwt
    .sign({ _id: user._id, isAdmin: user.isAdmin },
      config.get('jwtPrivateKey'), { expiresIn: '1h' });
  return token;
};

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required()
  }

  return Joi.validate(req, schema);
}