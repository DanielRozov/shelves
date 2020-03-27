import mongoose from 'mongoose';
import Joi from 'joi';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }

});

const User = mongoose.model('User', userSchema);

export default function (user) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required()
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