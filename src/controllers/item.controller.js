import { getAllItems, createItem, getItemById, deleteItemById, updateItem } from '../services/item.service';
import httpStatus from 'http-status';
import asyncMiddleware from '../middleware/async';

const getItems = asyncMiddleware(async (req, res) => {
  try {
    const categories = await getAllItems();
    return res.json({ items: categories.length, categories });
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: e.message });
  }
});

const postItem = asyncMiddleware(async (req, res) => {
  try {
    const item = await createItem(req, res);
    return res
      .status(httpStatus.CREATED)
      .json({ item: item, message: 'Succesfully created' });
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message });
  }
});


const putItem = asyncMiddleware(async (req, res) => {
  try {
    const item = await updateItem(req, res);
    return res
      .status(httpStatus.ACCEPTED)
      .json({ item: item, message: 'Item succesfully updated' });
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message });
  }
});

const getItem = asyncMiddleware(async (req, res) => {
  try {
    const item = await getItemById(req, res);
    return res.json({ item: item, message: "Item successfully retrived." });
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: e.message });
  }
});

const deleteItem = asyncMiddleware(async (req, res) => {
  try {
    const item = await deleteItemById(req, res);
    return res
      .status(httpStatus.OK)
      .json({ item: item, message: "Item successfully deleted." });
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: e.message });
  }
});

export {
  getItems,
  postItem,
  getItem,
  deleteItem,
  putItem
};