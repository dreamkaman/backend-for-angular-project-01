const { Schema, model } = require('mongoose');

const Joi = require('joi');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

const registerJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
  token: Joi.string(),
});

const User = model('user', userSchema);

module.exports = {
  User,
  schemas: {
    registerJoiSchema,
  },
};
