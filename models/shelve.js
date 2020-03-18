import Joi from '@hapi/joi';
import mongoose from 'mongoose';
import { productSchema } from './product';

const shelveSchema = new mongoose.Schema({
  storeCategory: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  productCategory: [{
    type: productSchema,
    required: true
  }],
  expireDate: {
    type: Date,
    required: true,
    // expires: '7d',
    default: Date.now
  }
});

const Shelve = mongoose.model('Shelve', shelveSchema);

export function validateShelve(shelve) {
  const schema = {
    storeCategory: Joi.string().min(4).max(255).required(),
    productCategoryId: Joi.objectId().required()
  }
}

export { shelveSchema, Shelve }; 