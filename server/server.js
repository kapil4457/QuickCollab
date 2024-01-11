const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Shutting down due to unhandled Promise Rejection ");
  process.exit(1);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error  :${err.message}`);
  console.log("Shutting down due to unhandled Promise Rejection ");
  server.close(() => {
    process.exit(1);
  });
});
