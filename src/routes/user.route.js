import { getUsers, postUser, getUser, updateUser, deleteUser } from '../controllers/user.controller';
import express from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const routes = (app) => {
  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .route('/api/users')
    .post(postUser)
    .get(getUsers)

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .route('/api/users/:id')
    .get(getUser)
    .put([auth, admin], updateUser)
    .delete([auth, admin], deleteUser)
}

export default routes;