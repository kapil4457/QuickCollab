const nodemailer = require("nodemailer");
const { resetPasswordTemplate } = require("./emailTemplates");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const sendMail = async (email, subject, id, user) => {
  try {
    console.log(email);
    const info = await transporter.sendMail({
      from: '"Content Management System" <demoweb3.0@example.com>', // sender address
      to: `${email}`, // list of receivers
      subject: `${subject}`, // Subject line
      html: resetPasswordTemplate(email, user, id, subject), // html body
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = sendMail;
