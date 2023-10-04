const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const { joiErrorsToObject } = require("../utils/helper");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error: joiErrors } = validate(req.body);
  if (joiErrors) {
    return res.status(400).send({ errors: joiErrorsToObject(joiErrors) });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .send({ error: "User with the given email is already registered" });
  }
  const { name, email, password } = req.body;
  user = new User({
    name,
    email,
    password,
  });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;

  user = await user.save();
  const { _id, name: userName, email: userEmail } = user;

  res.send({ _id, name: userName, email: userEmail });
});

module.exports = router;
