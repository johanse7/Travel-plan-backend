const joi = require('@hapi/joi');
const { userIdSchema } = require('./users');
const userAirLineFligthsIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}/);
const arlineFligthIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}/);

const createUserAirLineFligthsSchema = {
  userId: userIdSchema,
  arlineFligthId: arlineFligthIdSchema
};

module.exports = {
  userAirLineFligthsIdSchema,
  createUserAirLineFligthsSchema
};


