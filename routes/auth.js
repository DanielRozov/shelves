import { User } from '../models/user';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import express from 'express';
import asyncMiddleware from '../middleware/async';
const router = express.Router();


router.post('/', asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  const { error } = validate({ email, password });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password.' })
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid email or password.' })
  }

  res.send(true);
}));

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required()
  }

  return Joi.validate(req, schema);
}

export default router;