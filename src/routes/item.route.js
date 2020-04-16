import { getItems, postItem, getItem, deleteItem, putItem } from '../controllers/item.controller'
import express from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const routes = (app) => {

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .route('/api/items')
    .get(getItems)
    .post(postItem)

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .route('/api/items/:id')
    .get(getItem)
    .put(putItem)
    .delete(deleteItem)
}


export default routes;