const Joi = require("joi");
const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  inStock: {
    type: Number,
    min: 0,
    required: true,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  colors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Color",
    },
  ],
  created_at: { type: Date, default: Date.now(), immutable: true },
  updated_at: { type: Date, default: Date.now() },
});

productSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Product = model("Product", productSchema);

const validationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().label("Product Name"),
  price: Joi.number().min(0).required().label("Product Price"),
  inStock: Joi.number().min(0).required().label("Stock"),
  categories: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
  colors: Joi.array().items(Joi.string()),
});

module.exports = {
  Product,
  validate: (data) => validationSchema.validate(data, { abortEarly: false }),
};
