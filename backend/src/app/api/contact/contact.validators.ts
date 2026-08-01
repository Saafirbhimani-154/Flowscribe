import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 2 characters long.',
    'string.max': 'Name cannot exceed 50 characters.'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Please provide a valid email address.'
  }),
  message: Joi.string().trim().min(10).max(500).required().messages({
    'string.empty': 'Message is required.',
    'string.min': 'Message must be at least 10 characters long.',
    'string.max': 'Message cannot exceed 500 characters.'
  })
});

export const validateContact = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = contactSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    res.status(400).json({ 
      success: false, 
      errors: error.details.map(err => err.message) 
    });
    return;
  }
  
  next();
};
