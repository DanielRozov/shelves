import { postCategory, putCategory, deleteCategory } from '../controllers/category.controller'
import express from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const routes = (app) => {

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

  app
    .route('/api/items')
    .post([auth, admin], postCategory)

  app
    .route('/api/items/:itemId')
    .put([auth, admin], putCategory)
    .delete([auth, admin], deleteCategory)
}

export default routes;