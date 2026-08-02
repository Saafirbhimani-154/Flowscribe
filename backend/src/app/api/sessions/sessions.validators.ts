import * as Joi from 'joi';
import { validateSchema } from '../../middlewares/validator';
import { SESSIONS_CONSTANTS } from './sessions.constants';

export const sessionsValidators = {
  createSession: validateSchema(
    Joi.object({
      title: Joi.string().max(SESSIONS_CONSTANTS.MAX_TITLE_LENGTH).optional(),
      contextMessage: Joi.string().max(SESSIONS_CONSTANTS.MAX_MESSAGE_LENGTH).optional(),
    }),
    'body'
  ),

  saveResult: validateSchema(
    Joi.object({
      diagrams: Joi.object({
        activity: Joi.string().required(),
        stateMachine: Joi.string().required(),
      }).required(),
      audit: Joi.object({
        gaps: Joi.array().required(),
        edgeCases: Joi.array().required(),
      }).required(),
      schema: Joi.object({
        tables: Joi.array().required(),
      }).required(),
    }),
    'body'
  ),

  addMessage: validateSchema(
    Joi.object({
      content: Joi.string().max(SESSIONS_CONSTANTS.MAX_MESSAGE_LENGTH).required(),
      role: Joi.string().valid('USER', 'ASSISTANT').default('USER'),
      type: Joi.string().valid('TEXT', 'UPLOAD', 'RESULT').default('TEXT'),
    }),
    'body'
  ),
};
