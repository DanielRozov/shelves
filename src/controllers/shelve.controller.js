import { getAllCategories, getItemsByCategoryName, getItemsByCategoryNameAndItemName } from '../services/shelve.service';
import httpStatus from 'http-status';
import asyncMiddleware from '../middleware/async'

const getCategories = asyncMiddleware(async (req, res) => {
  try {
    const categories = await getAllCategories(req, res);
    return res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, categories: categories, message: 'Categories retrived successfully.' })
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
  }
});

const getItemsByCategory = asyncMiddleware(async (req, res) => {
  try {
    const categories = await getItemsByCategoryName(req, res);
    const items = categories.length;
    return res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, items: items, categories: categories, message: 'Categories retrived successfully.' })
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
  }
});

const getItemsByCategoryAndItem = asyncMiddleware(async (req, res) => {
  try {
    const categories = await getItemsByCategoryNameAndItemName(req, res);
    const items = categories.length;
    return res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, items: items, categories: categories, message: 'Categories retrived successfully.' })
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
  }
});

export {
  getCategories,
  getItemsByCategory,
  getItemsByCategoryAndItem
}