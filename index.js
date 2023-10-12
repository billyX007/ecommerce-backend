const express = require("express");
require("dotenv").config();
const { connect } = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const register = require("./routes/register");
const login = require("./routes/login");
const products = require("./routes/products");
const categories = require("./routes/categories");
const tags = require("./routes/tags");
const colors = require("./routes/colors");

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.JWT_PRIVATE_KEY) {
  console.log("JWT Private key is not set up in the environment variables.");
  process.exit(1);
}

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
app.use("/api/products", products);
app.use("/api/categories", categories);
app.use("/api/colors", colors);
app.use("/api/tags", tags);

app.listen(port, () => console.log("Listening to port " + port));
