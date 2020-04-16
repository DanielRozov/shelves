import { getAllItems, createItem, getItemById, deleteItemById, updateItem } from '../services/item.service';
import httpStatus from 'http-status';
import asyncMiddleware from '../middleware/async';

const getItems = asyncMiddleware(async (req, res) => {
  try {
    const items = await getAllItems();
    return res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, items: items, message: "Succesfully Items Retrieved" });
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
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
      .json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: e.message });
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
      .json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: e.message });
  }
});

const getItem = asyncMiddleware(async (req, res) => {
  try {
    const item = await getItemById(req, res);
    return res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, item: item, message: "Item successfully retrived." });
  } catch (e) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
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
      .json({ status: httpStatus.BAD_REQUEST, message: e.message });
  }
});

export {
  getItems,
  postItem,
  getItem,
  deleteItem,
  putItem
};