import * as Joi from 'joi';

const subscription = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    newsletterId: Joi.string()
      .required(),
    dateOfBirth: Joi.date()
      .required(),
    consented: Joi.bool()
      .required(),
    firstName: Joi.string(),
    gender: Joi.string()
  })
};

const unique = {
  params: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    newsletterId: Joi.string()
      .required(),
  })
};

export default { subscription, unique };
