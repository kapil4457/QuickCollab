//Token creaton and saving in cookies

const sendToken = async (user, statusCode, res, message) => {
  const token = await user.getJWTTokens();

  //options for cookie

  const option = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: true,
    // signed: true,
    sameSite: "lax",
  };
  res.cookie("token", token, option);
  // console.log(res);
  await res.status(statusCode).cookie("token", token, option).send({
    success: true,
    user,
    token,
    message: message,
  });
};

module.exports = sendToken;
