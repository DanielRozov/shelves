import { getCategories, getItemsByCategory, getItemsByCategoryAndItem } from '../controllers/shelve.controller';
import express from 'express';

const routes = (app) => {

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

  app
    .route('/api/shelves')
    .get(getCategories)

  app
    .route('/api/shelves/:categoryName')
    .get(getItemsByCategory)

  app
    .route('/api/shelves/:categoryName/:itemName')
    .get(getItemsByCategoryAndItem)
}

export default routes;