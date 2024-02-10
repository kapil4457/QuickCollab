const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("node:http");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
// Config File connected

dotenv.config({
  path: __dirname + "/.env",
});

app.use(
  cors({
    // allowedHeaders: ["Content-Type", "Authorization"],
    origin: [
      "http://127.0.0.1:3000",
      process.env.FRONT_END_URL,
      "http://localhost:3000",
    ],
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    // maxAge: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })
);

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
// Connect to the database
const connectDb = require("./database");
connectDb();

// middlewares
// app.use(cors());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Creating socket io server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://127.0.0.1:3000",
      process.env.FRONT_END_URL,
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Router
const user = require("./routes/userRoutes");
const project = require("./routes/projectRoutes");
const converastion = require("./routes/conversationRoutes");
const message = require("./routes/messageRoutes");
const cloudinary = require("./routes/cloudinaryRoutes");
const jobs = require("./routes/jobRoutes");
const { isAuthenticatedUser } = require("./middleware/auth");

app.use("/api/v1/", user);
app.use("/api/v1/", project);
app.use("/api/v1/", converastion);
app.use("/api/v1/", message);
app.use("/api/v1/", cloudinary);
app.use("/api/v1/", jobs);

//Exception Handeling
process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Shutting down due to unhandled Promise Rejection ");
  process.exit(1);
});

// Events in  socket.io
io.on("connection", (socket) => {
  console.log("a user connected : ", socket.id);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });
  socket.on("typing-message", ({ roomId }) => {
    socket.to(roomId).emit("recieve-message");
  });
});

// Listening to the server

server.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error  :${err.message}`);
  console.log("Shutting down due to unhandled Promise Rejection ");
});
