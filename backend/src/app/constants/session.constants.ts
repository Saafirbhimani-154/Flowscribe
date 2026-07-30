// @ts-nocheck

/**
 * @constant SESSION_AGE
 * @description It is a time in seconds in which auth token will
 * expire and user has to refresh token with the help of refresh
 * token provided at the time of login.
 */
export const SESSION_AGE = 1 * 12 * 30 * 24 * 60 * 60;

export const AUTH_TYPES = {
	BASIC: 'Basic',
	BEARER: 'Bearer',
};

/**
 * @constant OTP_EXPIRE_TIME
 * @description A Time after which otp token will be expired
 * @example 60 seconds
 */
export const OTP_EXPIRE_TIME = 60;
