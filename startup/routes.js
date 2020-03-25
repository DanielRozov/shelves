import error from '../middleware/error'
import express from 'express';
import items from '../routes/items';
import categories from '../routes/categories';
import shelves from '../routes/shelves';


export function routes(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/categories/items', items);  // post only items
  app.use('/api/items', categories); // post, put and delete items
  app.use('/api/shelves/categories', shelves); // get (/:itemId) and get (/:categoryName/:itemId/)

  app.use(error);
}