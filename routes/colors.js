const express = require("express");
const router = express.Router();
const { Color, validate } = require("../models/color");
const { joiErrorsToObject } = require("../utils/helper");
const { default: mongoose } = require("mongoose");
const auth = require("../middlewares/auth");

router.get("/", async (req, res) => {
  const colors = await Color.find();
  res.send({ colors });
});

router.post("/", auth, async (req, res) => {
  const { error: joiErrors } = validate(req.body);
  if (joiErrors) {
    return res.status(400).send({ error: joiErrorsToObject(joiErrors) });
  }
  const { name, code } = req.body;
  let color = new Color({
    name,
    code,
  });
  color = await color.save();
  res.send({ color });
});

router.get("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).send({ error: "The given ID is not valid." });
  }
  const color = await Color.findOne({ _id: req.params.id }).select(
    "_id name code"
  );
  if (!color) {
    return res
      .status(404)
      .send({ error: "Color with the given ID was not found." });
  }

  res.send({ color });
});

router.put("/:id", auth, async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).send({ error: "The given ID is not valid." });
  }

  const { error: joiErrors } = validate(req.body);
  if (joiErrors) {
    return res.status(400).send({ error: joiErrorsToObject(joiErrors) });
  }

  let color = await Color.findOne({ _id: req.params.id });
  if (!color) {
    return res
      .status(404)
      .send({ error: "Color with the given ID was not found." });
  }
  Object.keys(req.body).forEach((item) => (color[item] = req.body[item]));
  color = await color.save();
  res.send({ color });
});

router.delete("/:id", auth, async (req, res) => {
  let color = await Color.findOne({ _id: req.params.id });
  if (!color) {
    return res
      .status(404)
      .send({ error: "Color with the given ID was not found." });
  }
  const result = await color.deleteOne();
  res.send(result);
});

module.exports = router;
