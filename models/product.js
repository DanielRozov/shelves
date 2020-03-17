import mongoose from 'mongoose';
import Joi from 'joi';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
});

const Product = mongoose.model('Item', productSchema);

export function validateProduct(product) {
  const schema = {
    name: Joi.string().min(3).max(50).required()
  }

  return Joi.validate(product, schema);
}

export { productSchema, Product };