const Joi = require('joi');
const mongoose = require('mongoose');
const { productSchema } = require('./product');

const Category = mongoose.model('Category', new mongoose.Schema({
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  product: {
    type: productSchema,
    required: true
  }
}));


function validateProduct(category) {
  const schema = {
    numberInStock: Joi.number().min(0).max(255).required(),
    productId: Joi.objectId().required()
  }

  return Joi.validate(category, schema);
}

exports.Food = Category;
exports.validate = validateProduct;