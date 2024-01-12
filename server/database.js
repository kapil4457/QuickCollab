const mongoose = require("mongoose");

const databasesConnect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log("Error : ", err);
    });
};

module.exports = databasesConnect;
