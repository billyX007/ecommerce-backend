const Joi = require("joi");
const { Schema, model } = require("mongoose");

const tagSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 },
  created_at: { type: Date, default: Date.now(), immutable: true },
  updated_at: { type: Date, default: Date.now() },
});

tagSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Tag = model("Tag", tagSchema);

const validationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().label("Tag"),
});

module.exports = {
  Tag,
  validate: (data) => validationSchema.validate(data),
};
