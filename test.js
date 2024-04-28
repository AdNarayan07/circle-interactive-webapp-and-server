const nodemailer = require('nodemailer')
require('dotenv').config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
  });
const {EmailTemplate} = require('./functions/validateSignatureAndNotify.js');

// Example usage
const html = EmailTemplate('Aditya');
  const mailOptions = {
    from: {
        name: "Sphere - Your secure space",
        address: process.env.EMAIL
    },
    to: 'aditya6104narayan@gmail.com',
    subject: 'Test email',
    html
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });