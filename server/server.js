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
const user = require("./routes/userRoutes");
const project = require("./routes/projectRoutes");
// const conversation = require("./routes/conversationRoutes");
// const message = require("./routes/messageRoutes");

app.use("/api/v1/", user);
app.use("/api/v1/", project);
// app.use("/api/v1/", conversation);
// app.use("/api/v1/", message);
//Exception Handeling
process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Shutting down due to unhandled Promise Rejection ");
  process.exit(1);
});

// Listening to the server
app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error  :${err.message}`);
  console.log("Shutting down due to unhandled Promise Rejection ");
});
