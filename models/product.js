const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
});

const Product = mongoose.model('Item', productSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string().min(3).max(50).required()
  }

  return Joi.validate(product, schema);
}

exports.productSchema = productSchema;
exports.Product = Product;
exports.validate = validateProduct;