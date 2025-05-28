const router = require('express').Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  try {
    const { id, name, price, image, category, description, nutrients, calories, healthBenefits, tags } = req.body;

    // Validate required fields
    if (!id || !name || !price || !image || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if product ID already exists
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product ID already exists' });
    }

    const newProduct = new Product({
      id,
      name,
      price,
      image,
      category,
      description: description || '',
      nutrients: nutrients || [],
      calories: calories || 'N/A',
      healthBenefits: healthBenefits || '',
      tags: tags || [],
    });

    await newProduct.save();
    console.log('✅ Product added to DB:', newProduct);
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error('❌ Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

module.exports = router;