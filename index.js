const express = require("express");
require("dotenv").config();
const { connect } = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const register = require("./routes/register");
const login = require("./routes/login");

const app = express();
const port = process.env.PORT || 5000;

connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));
app.use("/api/register", register);
app.use("/api/login", login);

app.listen(port, () => console.log("Listening to port " + port));
