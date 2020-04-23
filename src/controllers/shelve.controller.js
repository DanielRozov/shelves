import { getAllCategories, getItemsByCategoryName, getItemsByCategoryNameAndItemName } from '../services/shelve.service';
import httpStatus from 'http-status';
import asyncMiddleware from '../middleware/async'

const getCategories = asyncMiddleware(async (req, res) => {
  try {
    let shelves = await getAllCategories(req, res);
    shelves.food.categories = uniqueArray(shelves.food.categories);
    shelves.hygiene.categories = uniqueArray(shelves.hygiene.categories);

    return res.json({ shelves })
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: e.message });
  }
});

const getItemsByCategory = asyncMiddleware(async (req, res) => {
  try {
    let categories = await getItemsByCategoryName(req, res);
    const items = categories.length;
    categories = uniqueArray(categories);

    return res.json({ items, categories })
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: e.message });
  }
});

const getItemsByCategoryAndItem = asyncMiddleware(async (req, res) => {
  try {
    let products = await getItemsByCategoryNameAndItemName(req, res);
    const items = products.length;
    products = uniqueArray(products);

    return res.json({ items, products });
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: e.message });
  }
});

function uniqueArray(oldArray) {
  let uniqueArray = new Set();
  oldArray.forEach(element => uniqueArray.add(element));
  return uniqueArray;
}

export {
  getCategories,
  getItemsByCategory,
  getItemsByCategoryAndItem
}