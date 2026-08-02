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
        activity: Joi.string().allow('', null).optional(),
        stateMachine: Joi.string().allow('', null).optional(),
      }).optional(),
      audit: Joi.object({
        gaps: Joi.array().optional(),
        edgeCases: Joi.array().optional(),
      }).optional(),
      schema: Joi.object({
        sql: Joi.string().allow('', null).optional(),
      }).optional(),
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
