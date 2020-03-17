import express from 'express';
const app = express();
import products from '../routes/products';


export function routes(app) {
  app.use(express.json());
  app.use('/api/shelves/categories/products', products);
}