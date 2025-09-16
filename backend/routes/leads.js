const express = require('express');
const Lead = require('../models/lead');
const Customer = require('../models/customer');
const { auth, userOrAdmin } = require('../middleware/auth');
const { leadSchemas, validate } = require('../middleware/validation');

const router = express.Router();

// Get all leads for user
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find().populate('customerId');
    const filtered = leads.filter(lead => lead.customerId && lead.customerId.ownerId.toString() === req.user._id.toString());
    res.json({
      success: true,
      leads: filtered
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Get leads for a customer
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer || customer.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
        errors: [{ field: 'customerId', message: 'Customer does not exist or access denied' }]
      });
    }

    const leads = await Lead.find({ customerId: req.params.customerId });
    res.json({
      success: true,
      leads
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads for customer',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Add lead
router.post('/', auth, validate(leadSchemas.create), async (req, res) => {
  try {
    const { customerId } = req.body;

    // Verify customer ownership
    const customer = await Customer.findById(customerId);
    if (!customer || customer.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
        errors: [{ field: 'customerId', message: 'Customer does not exist or access denied' }]
      });
    }

    const lead = new Lead(req.body);
    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead added successfully',
      lead
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to add lead',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Update lead
router.put('/:id', auth, validate(leadSchemas.update), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
        errors: [{ field: 'id', message: 'Lead does not exist' }]
      });
    }

    // Verify customer ownership
    const customer = await Customer.findById(lead.customerId);
    if (!customer || customer.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Access denied',
        errors: [{ field: 'id', message: 'Access denied to this lead' }]
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead: updatedLead
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
        errors: [{ field: 'id', message: 'Lead does not exist' }]
      });
    }

    // Verify customer ownership
    const customer = await Customer.findById(lead.customerId);
    if (!customer || customer.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Access denied',
        errors: [{ field: 'id', message: 'Access denied to this lead' }]
      });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

module.exports = router;
