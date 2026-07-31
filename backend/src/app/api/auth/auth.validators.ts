import * as Joi from 'joi';
import { validateSchema } from '../../middlewares/validator';

export const authValidators = {
  register: validateSchema(
    Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
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
