const { userSocketIDs } = require("../server");
const getSockets = (users = []) => {
  console.log(users);
  return users.map((user) => {
    if (userSocketIDs?.has(user._id))
      return userSocketIDs?.get(user._id.toString());
  });
};

module.exports = { getSockets };
