const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Config File connected
dotenv.config({
  path: __dirname + "/.env",
});
// Connect to the database
const connectDb = require("./database");
connectDb();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(cookieParser());

// Router

module.exports = app;
