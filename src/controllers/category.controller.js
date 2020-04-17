import { createCategory, updateCategory, deleteCategoryById } from '../services/category.service';
import httpStatus from 'http-status';
import asyncMiddleware from '../middleware/async'

const postCategory = asyncMiddleware(async (req, res) => {
  try {
    const category = await createCategory(req, res);
    return res
      .status(httpStatus.CREATED)
      .json({ status: httpStatus.CREATED, category: category, message: 'Category created successfully.' });
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
  }
});

const putCategory = asyncMiddleware(async (req, res) => {
  try {
    const category = await updateCategory(req, res);
    return res
      .status(httpStatus.ACCEPTED)
      .json({ status: httpStatus.ACCEPTED, category: category, message: 'Category updated successfully.' });
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
  }
});

const deleteCategory = asyncMiddleware(async (req, res) => {
  try {
    const category = await deleteCategoryById(req, res);
    return res
      .status(httpStatus.ACCEPTED)
      .json({ status: httpStatus.ACCEPTED, category: category, message: 'Category deleted successfully.' });
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
  }
});

export {
  postCategory,
  putCategory,
  deleteCategory
};