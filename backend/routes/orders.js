const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST route to create a new order
router.post('/create', async (req, res) => {
  try {
    const { user, product, quantity, totalPrice, address } = req.body;

    // Validate required fields
    if (!user || !product || !quantity || !totalPrice || !address) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    // Additional validation for quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Quantity must be a positive integer' });
    }

    // Create new order
    const order = new Order({
      user,
      product,
      quantity,
      totalPrice,
      address,
      status: 'pending',
      createdAt: new Date(),
    });

    // Save order to MongoDB
    await order.save();

    // Log success message with address details to terminal
    console.log(`Order successfully created! Order ID: ${order._id}, User: ${user}, Product: ${product.name}, Quantity: ${quantity}, Total Price: $${totalPrice}, Address: ${address.fullName}, ${address.addressLine1}, ${address.addressLine2 ? address.addressLine2 + ', ' : ''}${address.city}, ${address.state}, ${address.zipCode}, ${address.country}, Phone: ${address.phone}`);

    res.status(201).json({ 
      status: 'success', 
      message: 'Your order has been placed successfully!', 
      orderId: order._id 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ status: 'error', message: 'Server error while creating order' });
  }
});

module.exports = router;