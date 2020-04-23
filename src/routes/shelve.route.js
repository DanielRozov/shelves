import { getCategories, getItemsByCategory, getItemsByCategoryAndItem } from '../controllers/shelve.controller';
import express from 'express';
import auth from '../middleware/auth';

const routes = (app) => {

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

  app
    .route('/api/shelves/categories')
    .get(auth, getCategories)

  app
    .route('/api/shelves/categories/:categoryName')
    .get(auth, getItemsByCategory)

  app
    .route('/api/shelves/categories/:categoryName/:itemName')
    .get(auth, getItemsByCategoryAndItem)
}

export default routes;