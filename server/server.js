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
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(cookieParser());
// app.use(express.json({ limit: "5mb", extended: true }));
// app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Router
const user = require("./routes/userRoutes");
const project = require("./routes/projectRoutes");
const converastion = require("./routes/conversationRoutes");
const message = require("./routes/messageRoutes");
const cloudinary = require("./routes/cloudinaryRoutes");
// const conversation = require("./routes/conversationRoutes");
// const message = require("./routes/messageRoutes");

app.use("/api/v1/", user);
app.use("/api/v1/", project);
app.use("/api/v1/", converastion);
app.use("/api/v1/", message);
app.use("/api/v1/", cloudinary);
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

// {
//   "asset_id": "6aa0eafeb975dffcc15c46d0771c3698",
//   "public_id": "profile_pics/bg8kcggbawzrsswaszdp",
//   "version": 1705412011,
//   "version_id": "b2eaa4df0ba756e53199c8539999bf6e",
//   "signature": "729f6d00df79c1240e97a91249fca6abe1e9bb85",
//   "width": 800,
//   "height": 480,
//   "format": "jpg",
//   "resource_type": "image",
//   "created_at": "2024-01-16T13:33:31Z",
//   "tags": [],
//   "bytes": 34985,
//   "type": "upload",
//   "etag": "81a2c5b98ba6ea290e8dc9e2136ffcba",
//   "placeholder": false,
//   "url": "http://res.cloudinary.com/dpeldzvz6/image/upload/v1705412011/profile_pics/bg8kcggbawzrsswaszdp.jpg",
//   "secure_url": "https://res.cloudinary.com/dpeldzvz6/image/upload/v1705412011/profile_pics/bg8kcggbawzrsswaszdp.jpg",
//   "folder": "profile_pics",
//   "access_mode": "public",
//   "original_filename": "Findme"
// }
