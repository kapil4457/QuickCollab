const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("node:http");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");

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

// Router
const user = require("./routes/userRoutes");
const project = require("./routes/projectRoutes");
const converastion = require("./routes/conversationRoutes");
const message = require("./routes/messageRoutes");
const cloudinary = require("./routes/cloudinaryRoutes");
const jobs = require("./routes/jobRoutes");
const { isAuthenticatedUser } = require("./middleware/auth");
const { getSockets } = require("./utils/helper");

app.use("/api/v1/", user);
app.use("/api/v1/", project);
app.use("/api/v1/", converastion);
app.use("/api/v1/", message);
app.use("/api/v1/", cloudinary);
app.use("/api/v1/", jobs);

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

//Exception Handeling
process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Shutting down due to unhandled Promise Rejection ");
  process.exit(1);
});

// conversationId , array of socketId
let Conversations = new Map();
io.use((socket, next) => {
  let convIds = socket.handshake.auth.token ? socket.handshake.auth.token : [];
  for (let convId of convIds) {
    if (Conversations.has(convId)) {
      Conversations.get(convId).push(socket.id);
    } else {
      Conversations.set(convId, [socket.id]);
    }
  }
  next();
});
// Events in  socket.io
io.on("connection", (socket) => {
  console.log("a user connected : ", socket.id);
  const user = {
    _id: "123",
    name: "name",
  };
  // userSocketIDs.set(data.id.toString(), socket.id);
  // console.log("userSocketIDs : ", userSocketIDs);
  // socket.on("connection", async (data) => {
  //   console.log(data);
  // });

  socket.on("typing", async ({ conversationId, senderName, senderId }) => {
    // console.log("typing emitted");
    const sender = socket.id;
    let members = Conversations.get(conversationId);

    for (let ele of members) {
      if (ele?.toString() !== sender?.toString()) {
        io?.to(ele.toString())?.emit("typing_from_server", {
          senderName,
          senderId: senderId,
          conversationId,
        });
      }
    }
  });
  socket.on("new_message", async (data) => {
    io.to(usersSockets).emit("new_message_alert", {
      roomId: data.roomId,
    });
  });
  socket.on("disconnect", () => {
    const newMap = new Map();
    console.log("User disconnected");
    for (let conv of Conversations) {
      if (conv[0].includes(socket.id)) {
        let newMembers = conv[1].filter((item) => {
          if (item.toString() !== socket.id.toString()) {
            return item;
          }
          newMap.set(conv[0], newMembers);
        });
      }
      Conversations = newMap;
    }
    // userSocketIDs.delete(user._id.toString());
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

// module.exports = { userSocketIDs };
