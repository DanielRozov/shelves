import { getAllUsers, createUser, getUserById, updateUseById, deleteUserById } from '../services/user.service';
import status from 'http-status';
import asyncMiddleware from '../middleware/async';


const getUsers = asyncMiddleware(async (req, res) => {
  try {
    const users = await getAllUsers();
    return res
      .status(status.OK)
      .json({ status: status.OK, users: users, message: "Succesfully Users Retrieved" });
  } catch (e) {
    return res.status(status.BAD_REQUEST).json({ status: status.BAD_REQUEST, message: e.message });
  }

});

const postUser = asyncMiddleware(async (req, res) => {
  try {
    await createUser(req.body, res);
    return res
      .status(status.CREATED)
      .json({ message: 'Succesfully created' })
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ status: status.INTERNAL_SERVER_ERROR, message: 'Something failed' });
  }
});

const getUser = asyncMiddleware(async (req, res) => {
  try {
    await getUserById(req, res);
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ status: status.INTERNAL_SERVER_ERROR, message: 'Something failed' });
  }
});

const updateUser = asyncMiddleware(async (req, res) => {
  try {
    await updateUseById(req, res);
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ status: status.INTERNAL_SERVER_ERROR, message: 'Something failed' });
  }
});

const deleteUser = asyncMiddleware(async (req, res) => {
  try {
    await deleteUserById(req, res);
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ status: status.INTERNAL_SERVER_ERROR, message: 'Something failed' });
  }
})

export {
  getUsers,
  postUser,
  getUser,
  updateUser,
  deleteUser
}