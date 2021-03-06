import { getAllUsers, createUser, getUserById, updateUseById, deleteUserById } from '../services/user.service';
import status from 'http-status';
import asyncMiddleware from '../middleware/async';

const getUsers = asyncMiddleware(async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json({ users });
  } catch (e) {
    return res.status(status.BAD_REQUEST).json({ message: e.message });
  }
});

const postUser = asyncMiddleware(async (req, res) => {
  try {
    const user = await createUser(req, res);
    return res
      .status(status.CREATED)
      .json({ user: user, message: 'User created successfully.' })
  } catch (e) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
});

const getUser = asyncMiddleware(async (req, res) => {
  try {
    const user = await getUserById(req, res);
    res.status(status.FOUND).json({ user })
  } catch (e) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
});

const updateUser = asyncMiddleware(async (req, res) => {
  try {
    const user = await updateUseById(req, res);
    return res
      .status(status.ACCEPTED)
      .json({ user: user, message: 'User updated successfully' });
  } catch (e) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
});

const deleteUser = asyncMiddleware(async (req, res) => {
  try {
    const user = await deleteUserById(req, res);
    return res
      .status(status.OK)
      .json({ user: user, message: 'User deleted successfully.' })
  } catch (e) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
})

export {
  getUsers,
  postUser,
  getUser,
  updateUser,
  deleteUser
}