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

const validate = (data) =>
  validationSchema.validate(data, { abortEarly: false });

router.post("/", async (req, res) => {
  //Destructuring and validating input data
  const { error: joiErrors } = validate(req.body);
  if (joiErrors) {
    return res.status(400).send({ errors: joiErrorsToObject(joiErrors) });
  }
  //Destructuring and finding the user with email and checking if it is in the db or not
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ error: "User with the given email doesn't exist." });
  }
  //Checking if user password matches or not
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .send({ error: "The given email or password is invalid" });
  }
  //Generating json web token of the user
  const token = user.generateJWTToken();
  res.send({ token });
});

module.exports = router;
