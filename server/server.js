const app = require("./app");
app.listen(8000, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
