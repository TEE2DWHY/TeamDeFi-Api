const nodemailer = require("nodemailer");

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

const message = (verificationToken) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          .container {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Team Defi</h1>
          <p>We are focused on ensuring our users are well optimized with the skills needed to thrive in the financial markets
          <br/> Click this link to verify your email <a href=${process.env.BASE_URL}/api/v1/auth/verify-email?token=${verificationToken}">Verify Email</a>. Thank you
          </p>
        </div>
      </body>
    </html>
    `;
};

module.exports = { sendEmail, message };
