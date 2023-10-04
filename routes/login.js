const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { joiErrorsToObject } = require("../utils/helper");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const validationSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

const validate = (data) => validationSchema.validate(data);

router.post("/", async (req, res) => {
  const { error: joiErrors } = validate(req.body);

  if (joiErrors) {
    return res.status(400).send({ errors: joiErrorsToObject(joiErrors) });
  }

  const { password, email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ error: "User with the given email doesn't exist." });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .send({ error: "The given email or password is invalid" });
  }

  res.send({ user: { name: user.name, email: user.email } });
});

module.exports = router;
