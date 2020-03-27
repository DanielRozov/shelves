import { User } from '../models/user';
import validateUser from '../models/user';
import bcrypt from 'bcrypt';
import express from 'express';
import asyncMiddleware from '../middleware/async';

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const users = await User.find();
  res.send(users);
}));

router.post('/', asyncMiddleware(async (req, res) => {
  const { username, email, password } = req.body;

  const { error } = validateUser({ username, email, password });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already registred.' })
  }

  user = new User({ username, email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  res.send({ username, email });
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
  const { username, email } = req.body;
  const { id } = req.params;

  const { error } = validateUser({ username, email });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.find({ _id: id }).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'This user does not exist.' });
  }

  user = await User.findByIdAndUpdate(id, { username, email },
    { new: true });

  res.send(user);
}));


router.delete('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  let user = await User.find({ _id: id }).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'This user does not exist.' });
  }

  user = await User.findByIdAndRemove({ _id: id });

  res.send(user);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  let user = await User.find({ _id: id }).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'This user does not exist.' });
  }

  res.send(user);
}));

export default router;