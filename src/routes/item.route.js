import { getItems, postItem, getItem, deleteItem, putItem } from '../controllers/item.controller'
import express from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const routes = (app) => {

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .route('/api/categories/items')
    .get(getItems)
    .post([auth, admin], postItem)

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .route('/api/categories/items/:id')
    .get(getItem)
    .put([auth, admin], putItem)
    .delete([auth, admin], deleteItem)
}


export default routes;