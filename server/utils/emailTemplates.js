const resetPasswordTemplate = (email, user, id, subject) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body>
    Hii <b>${user.name}</b>,
    <br />
    <p>We recently recieved a request to reset password for your account <b> ${email}</b> on ${new Date()
  .toISOString()
  .substring(0, 10)}.</p>
   <p> Use this link to <a href="http://localhost:8000/reset/password/${id}">reset your password</a>.</p>
    <p>Remember to use a password that is both strong and unique to your Content Management System
    account.<p/>
    <br />
    Thanks and regards,<br />
    <b>Content Management System Support team</b>

    <br />
    <br />
    <br />
    <br />
    <div style="width:100%;border-bottom:1px solid gray" />

    <i style="color:gray">This is a system generated email.Please do not reply to it.</i>
</body>
</html>

`;

module.exports = { resetPasswordTemplate };
