import * as Joi from 'joi';
import { validateSchema } from '../../middlewares/validator';

export const authValidators = {
  register: validateSchema(
    Joi.object({
      firstName: Joi.string()
        .pattern(/^[a-zA-Z\s'-]+$/) // S-7: Allowlist — no script tags or special chars
        .min(2)
        .max(50)
        .required(),
      lastName: Joi.string()
        .pattern(/^[a-zA-Z\s'-]+$/)
        .min(2)
        .max(50)
        .required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(), // m-3: 8 chars minimum (up from 6)
      confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match'
      }),
    }),
    'body'
  ),

  login: validateSchema(
    Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    'body'
  )
};
