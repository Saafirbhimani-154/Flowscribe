import * as Joi from 'joi';
import { validateSchema } from '../../middlewares/validator';

const SUPPORTED_LANGUAGES = ['en', 'hi', 'es', 'fr', 'de', 'ja', 'zh', 'ar'];
const SUPPORTED_THEMES = ['light', 'dark', 'system'];

export const userProfileValidators = {
  // PATCH /:slugId — update name/email
  updateProfile: validateSchema(
    Joi.object({
      firstName: Joi.string()
        .pattern(/^[a-zA-Z\s'-]+$/)
        .min(2)
        .max(50)
        .optional(),
      lastName: Joi.string()
        .pattern(/^[a-zA-Z\s'-]+$/)
        .min(2)
        .max(50)
        .optional(),
      email: Joi.string()
        .email()
        .optional(),
    }).min(1).messages({
      'object.min': 'At least one field must be provided to update.',
    }),
    'body'
  ),

  // PATCH /:slugId/password
  changePassword: validateSchema(
    Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(8).required(),
      confirmNewPassword: Joi.any()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({ 'any.only': 'Passwords do not match.' }),
    }),
    'body'
  ),

  // PATCH /:slugId/slug — confirm new slug (one-time)
  confirmSlug: validateSchema(
    Joi.object({
      slugId: Joi.string()
        .pattern(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/)
        .min(3)
        .max(30)
        .required()
        .messages({
          'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.',
          'string.min': 'Slug must be at least 3 characters.',
          'string.max': 'Slug must be at most 30 characters.',
        }),
    }),
    'body'
  ),

  // PATCH /:slugId/settings
  updateSettings: validateSchema(
    Joi.object({
      language: Joi.string()
        .valid(...SUPPORTED_LANGUAGES)
        .optional()
        .messages({ 'any.only': `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}` }),
      theme: Joi.string()
        .valid(...SUPPORTED_THEMES)
        .optional()
        .messages({ 'any.only': `Theme must be one of: ${SUPPORTED_THEMES.join(', ')}` }),
      timezone: Joi.string()
        .max(50)
        .optional(),
    }).min(1).messages({
      'object.min': 'At least one preference must be provided.',
    }),
    'body'
  ),

  // GET /v1/auth/check-slug/:slugId — validates slug format in URL params
  checkSlug: validateSchema(
    Joi.object({
      slugId: Joi.string()
        .pattern(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/)
        .min(3)
        .max(30)
        .required()
        .messages({
          'string.pattern.base': 'Invalid slug format.',
        }),
    }),
    'params'
  ),
};
