const Joi = require("joi");
const { Schema, model } = require("mongoose");

const colorSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 },
  code: { type: String, required: true, min: 3, max: 10 },
  created_at: { type: Date, default: Date.now(), immutable: true },
  updated_at: { type: Date, default: Date.now() },
});

colorSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Color = model("Color", colorSchema);

const validationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().label("Color name"),
  code: Joi.string().min(3).max(10).required().label("Color code"),
});

module.exports = {
  Color,
  validate: (data) => validationSchema.validate(data),
};
