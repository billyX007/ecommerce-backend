const Joi = require("joi");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: 8,
    max: 36,
    required: true,
  },
});

const User = model("User", userSchema);

const validationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(3).max(36).required(),
});

module.exports = { User, validate: (data) => validationSchema.validate(data) };
