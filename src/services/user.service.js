import { User, validateUser, generateHashPassword } from '../models/user';
import jwt from 'jsonwebtoken';
import config from 'config';
import httpStatus from 'http-status';

/**
 * @api {get} /api/users Get the Users information.
 * @apiName GetAllUsers
 * @apiGroup User
 * @apiPermission none
 * 
 * @apiSuccess {Number}  id Unique  Mandatory ID of the User.
 * @apiSuccess {String}  username   Mandatory Username of the User.
 * @apiSuccess {String}  email      Mandatory Email of the User.
 * @apiSuccess {String}  password   Mandatory Password of the User.
 * @apiSuccess {Boolean} isAdmin    Mandatory isAdmin of the user.
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
  const users = await User
    .find({}, { password: 0 })
    .sort({ isAdmin: -1 });
  return users;
};

/**
 * @api {post} /api/users Create a new User.
 * @apiName PostUser
 * @apiGroup User
 * @apiPermission none
 * 
 * @apiParam {String}  username  Mandatory username of the User.
 * @apiParam {String}  email     Mandatory email of the User.
 * @apiParam {String}  password  Mandatory password of the User.
 * @apiParam {Boolean} isAdmin   Optional with value true/false.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username":"user22",
 *        "email":"user22@konkurenta.com"
 *      }
 * 
 * @apiSuccess {String} username  Username of the User.
 * @apiSuccess {String} email     Email of the User.
 * @apiSuccess {Boolean} password Password of the user.
 * 
 * @apiError usernameIsRequired Username is required.
 * @apiError emailIsRequired    Email is required.
 * @apiError emailIsRequired    Password is required.
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
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 400 Bad Request
 *      {
 *          "message": "\"password\" is required"
 *      }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "User allready registred."
 *     }
 */
export async function createUser(req, res) {
  const { username, email, password, isAdmin } = req.body;

  const { error } = validateUser({ username, email, password, isAdmin });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'User allready registred.' })
  }

  user = new User({ username, email, password, isAdmin });
  user.password = await generateHashPassword(user.password);
  await user.save();

  const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'), { expiresIn: '1h' });
  res.header('x-auth-token', token).send({ username, email, isAdmin });

  return user;
}

/**
 * @api {put} /api/users/:id Update an User.
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission admin
 * 
 * @apiParam {String} username Mandatory unique username of the User.
 * @apiParam {String} email    Mandatory unique email of the User.
 * @apiParam {String} password Mandatory password of the User.
 * @apiParam {Boolean} isAdmin Optional with value true/false.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username":"user*",
 *        "email":"user*@konkurenta.com",
 *	      "password":"12345",
 *	      "isAdmin":"false"
 *      }
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "user": {
 *       "isAdmin": true,
 *       "_id": "5e9590707...*",
 *       "username": "user*",
 *       "email": "user*@konkurenta.com",
 *       "password": "$2b$10$5...*",
 *       "__v": 0
 *   },
 *   "message": "User updated successfully"
 * }
 * 
 * @apiError AccessDenied                 Access denied. No token provided.   
 * @apiError TokenIsExpiried              Token is expired or invalid.   
 * @apiError NotFound                     This user does not exist.
 * @apiError DuplicateKeyErrorCollection  Duplicate key error collection...
 * @apiError CastToObjectIdFailedForValue Cast to ObjectId failed for value...
 * 
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1  401 Unauthorized
 *       {
 *          "message": "Access denied. No token provided."
 *       }
 * 
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1  401 Unauthorized
 *       {
 *          "message": "Token is expired or invalid."
 *       }
 * 
 *  @apiErrorExample {json} Error-Response:
 *        HTTP/1.1 404 Not Found
 *         {
 *           "message": "This user does not exist."
 *         }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Serever Error
 *     {
 *        "message": "E11000 duplicate key error collection: shelves.users index: email_1 dup key: { email: \"user*@konkurenta.com\" }"
 *     }
 * @apiErrorExample UserNotFound:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "Cast to ObjectId failed for value \"5e9590...*\" at path \"_id\" for model \"User\""
 *     }
 */
export async function updateUseById(req, res) {
  const { username, email, password, isAdmin } = req.body;
  const { id } = req.params;

  const { error } = validateUser({ username, email, password });
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  let user = await User.find({ _id: id }).limit(1);
  if (!user || user.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'This user does not exist.' });
  }

  user.password = await generateHashPassword(user.password);

  user = await User.findByIdAndUpdate(id, { username, email, password, isAdmin },
    { new: true });

  return user;
};

/**
 * @api {delete} /api/users/:id Delete an User.
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
 *      "username": "user*",
 *      "email": "user*@konkurenta.com",
 *      "password": "$2b$10$smByuSh3oWD..."
 *      "isAdmin": "true/false"
 *    }
 * 
 * @apiError AccessDenied     Access denied. No token provided.   
 * @apiError TokenIsExpiried  Token is expired or invalid.
 * @apiError NotFound         This user does not exist.
 * 
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1  401 Unauthorized
 *       {
 *          "message": "Access denied. No token provided."
 *       }
 * 
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1  401 Unauthorized
 *       {
 *          "message": "Token is expired or invalid."
 *       }
 * 
 * @apiErrorExample Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       'message': 'This user does not exist.'
 *     }
 */
export async function deleteUserById(req, res) {
  const { id } = req.params;

  let user = await User.find({ _id: id }).limit(1);
  if (!user || user.length === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'This user does not exist.' });
  }

  user = await User.findByIdAndRemove({ _id: id });
  return user;
};

/**
 * @api {get} /api/users/:id Get an User information.
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission none
 *
 * @apiParam {String}  id        The Users-ID.
 * 
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "user": {
 *       "isAdmin": false,
 *       "_id": "5e9c...*",
 *       "username": "user*",
 *       "email": "user*@konkurenta.com",
 *       "password": "$2b$1...*",
 *       "__v": 0
 *     },
 *     "message": "User deleted successfully."
 *   }
 * 
 * @apiError UserNotFound   This user does not exist.
 *
 */
export async function getUserById(req, res) {
  const { id } = req.params;

  let user = await User
    .find({ _id: id }, { password: 0 });
  if (!user || user.length === 0) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'This user does not exist.' });
  }

  return user;
};

// async function generateHashPassword(password) {
//   const salt = await bcrypt.genSalt(10);
//   password = await bcrypt.hash(password, salt);
//   return password;
// }