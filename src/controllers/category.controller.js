import { createCategory, updateCategory, deleteCategoryByItemId } from '../services/category.service';
import httpStatus from 'http-status';
import asyncMiddleware from '../middleware/async'

const postCategory = asyncMiddleware(async (req, res) => {
  try {
    const category = await createCategory(req, res);
    return res.json({ category });
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: e.message });
  }
});

const putCategory = asyncMiddleware(async (req, res) => {
  try {
    const category = await updateCategory(req, res);
    return res.json({ category: category, message: 'Category updated successfully.' });
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: e.message });
  }
});

const deleteCategory = asyncMiddleware(async (req, res) => {
  try {
    const category = await deleteCategoryByItemId(req, res);
    return res
      .status(httpStatus.ACCEPTED)
      .json({ category: category, message: 'Category deleted successfully.' });
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: e.message });
  }
});

export {
  postCategory,
  putCategory,
  deleteCategory
};