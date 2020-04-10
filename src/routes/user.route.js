import { getUsers, postUser, getUser, updateUser, deleteUser } from '../controllers/user.controller';
import express from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin'

const routes = (app) => {
  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .route('/users')
    .post(postUser)
    .get(getUsers);

  app
    .route('/users/:id')
    .get(getUser)
    .put(auth, updateUser)
    .delete([auth, admin], deleteUser)
}

export default routes;