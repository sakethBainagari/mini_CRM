const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address'
      }),
    password: Joi.string().min(6).max(100).required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'string.max': 'Password cannot exceed 100 characters'
      })
  }),

  login: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address'
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Password is required'
      })
  })
};

// Customer validation schemas
const customerSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required()
      .messages({
        'string.empty': 'Customer name is required',
        'string.min': 'Customer name must be at least 2 characters',
        'string.max': 'Customer name cannot exceed 100 characters'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address'
      }),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).allow('')
      .messages({
        'string.pattern.base': 'Please enter a valid phone number'
      }),
    company: Joi.string().max(100).allow('')
      .messages({
        'string.max': 'Company name cannot exceed 100 characters'
      })
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100)
      .messages({
        'string.min': 'Customer name must be at least 2 characters',
        'string.max': 'Customer name cannot exceed 100 characters'
      }),
    email: Joi.string().email()
      .messages({
        'string.email': 'Please enter a valid email address'
      }),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).allow('')
      .messages({
        'string.pattern.base': 'Please enter a valid phone number'
      }),
    company: Joi.string().max(100).allow('')
      .messages({
        'string.max': 'Company name cannot exceed 100 characters'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  })
};

// Lead validation schemas
const leadSchemas = {
  create: Joi.object({
    customerId: Joi.string().hex().length(24).required()
      .messages({
        'string.empty': 'Customer ID is required',
        'string.hex': 'Invalid customer ID format',
        'string.length': 'Invalid customer ID'
      }),
    title: Joi.string().min(2).max(200).required()
      .messages({
        'string.empty': 'Lead title is required',
        'string.min': 'Lead title must be at least 2 characters',
        'string.max': 'Lead title cannot exceed 200 characters'
      }),
    description: Joi.string().max(1000).allow('')
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    status: Joi.string().valid('New', 'Contacted', 'Converted', 'Lost').default('New')
      .messages({
        'any.only': 'Status must be one of: New, Contacted, Converted, Lost'
      }),
    value: Joi.number().min(0).max(999999999).allow(null)
      .messages({
        'number.min': 'Value cannot be negative',
        'number.max': 'Value cannot exceed 999,999,999'
      })
  }),

  update: Joi.object({
    title: Joi.string().min(2).max(200)
      .messages({
        'string.min': 'Lead title must be at least 2 characters',
        'string.max': 'Lead title cannot exceed 200 characters'
      }),
    description: Joi.string().max(1000).allow('')
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    status: Joi.string().valid('New', 'Contacted', 'Converted', 'Lost')
      .messages({
        'any.only': 'Status must be one of: New, Contacted, Converted, Lost'
      }),
    value: Joi.number().min(0).max(999999999).allow(null)
      .messages({
        'number.min': 'Value cannot be negative',
        'number.max': 'Value cannot exceed 999,999,999'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = {
  userSchemas,
  customerSchemas,
  leadSchemas,
  validate
};
