import mongoose from 'mongoose';
import Joi, { bool, boolean } from 'joi';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1014
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.boolean().default(false)
  }

  return Joi.validate(user, schema);
}

async function generateHashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  return password;
}
// export default function (user) {
//   const schema = Joi.object({
//     username: Joi.string()
//       .alphanum()
//       .min(3)
//       .max(50)
//       .required(),
//     email: Joi.string()
//       .email({
//         minDomainSegments: 2,
//         tlds: { allow: ['com', 'net'] }
//       })
//   });

//   schema.validate({ user, schema });
// }

export { userSchema, User, validateUser, generateHashPassword };