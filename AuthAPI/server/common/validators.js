const joi = require('joi');

const loginSchemaObj = {
  email: joi.string().email().required(),
  password: joi.string().min(12).required(),
};

const namesSchemaObj = {
  firstName: joi.string(),
  lastName: joi.string(),
};

const userSchema = joi.object({
  ...loginSchemaObj,
  ...namesSchemaObj,
});

const loginSchema = joi.object(loginSchemaObj);

const namesSchema = joi.object(namesSchemaObj).or('firstName', 'lastName');

module.exports = {
  userSchema,
  loginSchema,
  namesSchema,
};
