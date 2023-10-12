const express = require("express");
const router = express.Router();
const { Category, validate } = require("../models/category");
const { joiErrorsToObject } = require("../utils/helper");
const { default: mongoose } = require("mongoose");

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send({ categories });
});

router.post("/", async (req, res) => {
  const { error: joiErrors } = validate(req.body);
  if (joiErrors) {
    return res.status(400).send({ error: joiErrorsToObject(joiErrors) });
  }

  const { name } = req.body;

  let category = new Category({
    name,
  });

  category = await category.save();

  res.send({ category });
});

router.get("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).send({ error: "The given ID is not valid." });
  }
  const category = await Category.findOne({ _id: req.params.id }).select(
    "_id name"
  );
  if (!category) {
    return res
      .status(404)
      .send({ error: "Category with the given ID was not found." });
  }

  res.send({ category });
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

  let category = await Category.findOne({ _id: req.params.id });
  if (!category) {
    return res
      .status(404)
      .send({ error: "Category with the given ID was not found." });
  }
  Object.keys(req.body).forEach((item) => (category[item] = req.body[item]));
  category = await category.save();
  res.send({ category });
});

router.delete("/:id", async (req, res) => {
  let category = await Category.findOne({ _id: req.params.id });
  if (!category) {
    return res
      .status(404)
      .send({ error: "Category with the given ID was not found." });
  }
  const result = await category.deleteOne();
  res.send(result);
});

module.exports = router;
