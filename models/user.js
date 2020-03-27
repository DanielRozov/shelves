import mongoose from 'mongoose';
import Joi from 'joi';

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
  }

});

const User = mongoose.model('User', userSchema);

export default function (user) {
  const schema = {
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required()
  }

  return Joi.validate(user, schema);
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

export { userSchema, User };