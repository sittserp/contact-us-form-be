const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const transporter = require('./config');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'build', 'src/index.js'));
});

app.get('/ping', (req, res) => {
  return res.send('pong');
});

app.post('/send', (req, res) => {
  try {
    const mailOptions = {
      form: req.body.email,
      to: process.env.email,
      subject: req.body.subject,
      html: `
          <p>You have a new contact request.</p>
          <h3>Contact Details</h3>
          <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Subject: ${req.body.subject}</li>
            <li>Message: ${req.body.name}</li>
        </ul>
            `
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if(err) {
        res.status(500).send({
          success: false,
          message: 'Something went wrong. Try again later'
        });
      } else {
        res.send({
          success: true,
          message: 'Thanks for contacting us! We\'ll get back to you shortly'
        });
      }
    });
  } catch(error) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong. Try again later'
    });
  }
});

const PORT = process.env.PORT || 7891;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});
