const nodemailer = require("nodemailer");
const {
  resetPasswordTemplate,
  contactEmailTemplateUser,
  contactEmailTemplateServer,
} = require("./emailTemplates");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const resetPasswordMail = async (email, subject, id, user) => {
  try {
    const info = await transporter.sendMail({
      from: '"Content Management System" <demoweb3.0@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: `${subject}`, // Subject line
      html: resetPasswordTemplate(email, user, id, subject), // html body
    });
  } catch (err) {
    console.log(err.message);
  }
};

const contactEmail = async (email, subject, user, body) => {
  try {
    await transporter.sendMail({
      from: '"Content Management System" <demoweb3.0@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: `${subject}`, // Subject line
      html: contactEmailTemplateUser(user, subject, body), // html body
    });
    await transporter.sendMail({
      from: `"Query"<${email}>`, // sender address
      to: "demoweb3.0@gmail.com", // list of receivers
      subject: `${subject}`, // Subject line
      html: contactEmailTemplateServer(user, subject, body, email), // html body
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { resetPasswordMail, contactEmail };
