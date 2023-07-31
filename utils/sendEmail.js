const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = (options) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    let mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error); // Reject the promise with the error
      } else {
        resolve(info); // Resolve the promise with the result
      }
    });
  });
};

module.exports = sendEmail;
