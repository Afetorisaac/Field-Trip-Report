import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    role: Joi.string().valid('requester', 'dept_head', 'procurement', 'admin').optional(),
    department: Joi.string().optional()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  createRequest: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        estimatedPrice: Joi.number().min(0).required(),
        unit: Joi.string().optional()
      })
    ).min(1).required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    notes: Joi.string().optional()
  }),
  
  approveReject: Joi.object({
    rejectionReason: Joi.string().optional()
  }),
  
  createPO: Joi.object({
    supplier: Joi.object({
      name: Joi.string().required(),
      contact: Joi.string().optional(),
      email: Joi.string().email().optional(),
      address: Joi.string().optional()
    }).required(),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
        unit: Joi.string().optional()
      })
    ).min(1).required(),
    tax: Joi.number().min(0).optional(),
    deliveryDate: Joi.date().optional(),
    notes: Joi.string().optional()
  })
};
