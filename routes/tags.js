const express = require("express");
const router = express.Router();
const { Tag, validate } = require("../models/tag");
const { joiErrorsToObject } = require("../utils/helper");
const { default: mongoose } = require("mongoose");

router.get("/", async (req, res) => {
  const tags = await Tag.find();
  res.send({ tags });
});

router.post("/", async (req, res) => {
  const { error: joiErrors } = validate(req.body);
  if (joiErrors) {
    return res.status(400).send({ error: joiErrorsToObject(joiErrors) });
  }

  const { name } = req.body;

  let tag = new Tag({
    name,
  });

  tag = await tag.save();

  res.send({ tag });
});

router.get("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).send({ error: "The given ID is not valid." });
  }
  const tag = await Tag.findOne({ _id: req.params.id }).select("_id name");
  if (!tag) {
    return res
      .status(404)
      .send({ error: "Tag with the given ID was not found." });
  }

  res.send({ tag });
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

  let tag = await Tag.findOne({ _id: req.params.id });
  if (!tag) {
    return res
      .status(404)
      .send({ error: "Tag with the given ID was not found." });
  }
  Object.keys(req.body).forEach((item) => (tag[item] = req.body[item]));
  tag = await tag.save();
  res.send({ tag });
});

router.delete("/:id", async (req, res) => {
  let tag = await Tag.findOne({ _id: req.params.id });
  if (!tag) {
    return res
      .status(404)
      .send({ error: "Tag with the given ID was not found." });
  }
  const result = await tag.deleteOne();
  res.send(result);
});

module.exports = router;
