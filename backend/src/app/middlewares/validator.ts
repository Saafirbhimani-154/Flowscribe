import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateSchema = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (!error) req[property] = value; // Replace body with stripped/validated value
    
    if (error) {
      const errorMessage = error.details.map(details => details.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }
    
    next();
  };
};
