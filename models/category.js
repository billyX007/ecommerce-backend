const Joi = require("joi");
const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 },
  created_at: { type: Date, default: Date.now(), immutable: true },
  updated_at: { type: Date, default: Date.now() },
});

categorySchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Category = model("Category", categorySchema);

const validationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().label("Category Name"),
});

module.exports = {
  Category,
  validate: (data) => validationSchema.validate(data),
};
