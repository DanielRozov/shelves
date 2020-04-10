import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
const myObjectId = JoiObjectId(Joi);
import mongoose from 'mongoose';
import { itemSchema } from './item';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    maxlength: 255
  },
  item: {
    type: itemSchema,
    required: true
  }
});

const Category = mongoose.model('Category', categorySchema);

export function validateCategory(category) {
  const schema = {
    name: Joi.string().min(4).max(255).required(),
    itemId: myObjectId().required()
  }

  return Joi.validate(category, schema);
}

export { categorySchema, Category }; 