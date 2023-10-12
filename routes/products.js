const express = require("express");
const router = express.Router();
const { Product, validate } = require("../models/product");
const { joiErrorsToObject } = require("../utils/helper");
const { default: mongoose } = require("mongoose");

router.get("/", async (req, res) => {
  const products = await Product.find().populate({
    path: "categories",
    select: ["_id", "name"],
  });
  console.log(products[0].categories[0]);
  res.send({
    products: products,
  });
});

router.post("/", async (req, res) => {
  const { error: joiErrors } = validate(req.body);

  if (joiErrors) {
    return res.status(400).send({ error: joiErrorsToObject(joiErrors) });
  }

  const { name, price, inStock, categories, tags } = req.body;

  if (categories.length) {
    let error = {};
    categories.forEach((item, i) => {
      const isIDValid = mongoose.Types.ObjectId.isValid(item);
      if (!isIDValid) {
        error = { [i]: `Given ID at ${i} is not a valid ID` };
      }
    });
    if (Object.keys(error).length) {
      return res.status(400).send({ categories: error });
    }
  }

  let product = new Product({
    name,
    price,
    inStock,
    categories,
    tags,
  });

  product = await product.save();

  res.send({ product });
});

router.get("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).send({ error: "The given ID is not valid." });
  }
  const product = await Product.findOne({ _id: req.params.id })
    .populate({
      path: "categories",
      select: ["name", "_id"],
    })
    .select("_id name price inStock categories tags");
  if (!product) {
    return res
      .status(404)
      .send({ error: "Product with the given ID was not found." });
  }

  res.send({ product });
});

router.put("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).send({ error: "The given ID is not valid." });
  }

  const { error: joiErrors } = validate(req.body);
  if (joiErrors) {
    return res.status(400).send({ error: joiErrorsToObject(joiErrors) });
  }

  let product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    return res
      .status(404)
      .send({ error: "Product with the given ID was not found." });
  }
  const { categories } = req.body;
  if (categories.length) {
    let error = {};
    categories.forEach((item, i) => {
      const isIDValid = mongoose.Types.ObjectId.isValid(item);
      if (!isIDValid) {
        error = { [i]: `Given ID at ${i} is not a valid ID` };
      }
    });
    if (Object.keys(error).length) {
      return res.status(400).send({ categories: error });
    }
  }

  Object.keys(req.body).forEach((item) => (product[item] = req.body[item]));
  product = await product.save();
  res.send({ product });
});

router.delete("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).send({ error: "The given ID is not valid." });
  }

  let product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    return res
      .status(404)
      .send({ error: "Product with the given ID was not found." });
  }
  const result = await product.deleteOne();
  res.send(result);
});

module.exports = router;
