const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
const { Color } = require("../models/color");
const { Tag } = require("../models/tag");

router.get("/", async (req, res) => {
  const categories = await Category.find();
  const tags = await Tag.find();
  const colors = await Color.find();

  res.send({ categories, tags, colors });
});

module.exports = router;
