const express = require('express');
const Customer = require('../models/customer');
const Lead = require('../models/lead');
const { auth, userOrAdmin } = require('../middleware/auth');
const { customerSchemas, validate } = require('../middleware/validation');

const router = express.Router();

// Get customers with pagination and search
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search ? { name: new RegExp(search, 'i'), ownerId: req.user._id } : { ownerId: req.user._id };
    const customers = await Customer.find(query).limit(limit * 1).skip((page - 1) * limit);
    const total = await Customer.countDocuments(query);

    res.json({
      success: true,
      customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCustomers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Get customer by id with leads
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer || customer.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
        errors: [{ field: 'id', message: 'Customer does not exist or access denied' }]
      });
    }

    const leads = await Lead.find({ customerId: req.params.id });
    res.json({
      success: true,
      customer,
      leads
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer details',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Add customer
router.post('/', auth, validate(customerSchemas.create), async (req, res) => {
  try {
    const customer = new Customer({ ...req.body, ownerId: req.user._id });
    await customer.save();
    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      customer
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists',
        errors: [{ field: 'email', message: 'Email is already in use' }]
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to add customer',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Update customer
router.put('/:id', auth, validate(customerSchemas.update), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer || customer.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
        errors: [{ field: 'id', message: 'Customer does not exist or access denied' }]
      });
    }
    res.json({
      success: true,
      message: 'Customer updated successfully',
      customer
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists',
        errors: [{ field: 'email', message: 'Email is already in use' }]
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer || customer.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
        errors: [{ field: 'id', message: 'Customer does not exist or access denied' }]
      });
    }

    await Lead.deleteMany({ customerId: req.params.id });
    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Customer and associated leads deleted successfully'
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

module.exports = router;
