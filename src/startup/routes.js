import error from '../middleware/error'
import express from 'express';
import items from '../services/items';
import categories from '../services/categories';
import shelves from '../services/shelves';
import users from '../services/user.service';
import auth from '../services/auth'


export function routes(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/categories/items', items);  // post only items
  app.use('/api/items', categories); // post, put and delete categories and items
  app.use('/api/shelves/', shelves); // get (/:itemId) and get (/:categoryName/:itemId/)
  app.use('/api/users', users); // get, get(/:id), post, put(/:id), delete(/:id)
  app.use('/api/auth', auth); // post

  app.use(error);
}