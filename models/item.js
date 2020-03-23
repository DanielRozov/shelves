import mongoose from 'mongoose';
import Joi from 'joi';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }

});

const Item = mongoose.model('Item', itemSchema);

export function validateItem(item) {
  const schema = {
    name: Joi.string().min(3).max(50).required()
  }

  return Joi.validate(item, schema);
}

export { itemSchema, Item };