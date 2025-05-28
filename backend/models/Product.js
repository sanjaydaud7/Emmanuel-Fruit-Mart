// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  nutrients: { type: [String], default: [] },
  calories: { type: String, default: 'N/A' },
  healthBenefits: { type: String, default: '' },
  tags: { type: [String], default: [] }
});

module.exports = mongoose.model('Product', productSchema);