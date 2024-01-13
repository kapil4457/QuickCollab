//Token creaton and saving in cookies

const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTTokens();

  //options for cookie

  const option = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    user,
    token,
    message: message,
  });
};

module.exports = sendToken;
