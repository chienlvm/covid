var sassMiddleware = require('node-sass-middleware');
const express = require('express');
const app = express();
var serveStatic = require('serve-static');
var join = require('path').join;
var port = process.env.PORT || 9999;
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var cors = require('cors');

const puppeteer = require('puppeteer');
const path = require('path');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'entrycovid19',
    pass: '123456a-',
  },
});

const captureScreenshot = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.goto('http://localhost:9999/', { waitUntil: 'networkidle2' });
  await page.pdf({
    path: './viblo-asia.pdf',
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    },
  });
  await browser.close();
};

var myPrefix = '/static';
var destination = join(__dirname, 'public');

// Sass middleware
app.use(
  sassMiddleware({
    /* Options */
    src: join(__dirname, 'public/scss'),
    dest: destination + '/css',
    debug: true,
    outputStyle: 'compressed',
    prefix: myPrefix + '/css',
  })
);

// pdf;

// static middleware
app.use(myPrefix, serveStatic(destination));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
// for API request

// live

// for server side rendering
// home
app.get('/', function (req, res) {
  res.render('pages/index');
});

app.post('/action_page', function (req, res) {
  var email = req.body.email;
  var fullName = req.body.fullname;
  console.log(email, fullName);

  //  captureScreenshot();

  var mailOptions = {
    from: 'entrycovid19@gmail.com',
    to: `${email}`,
    subject: `Thanks ${fullName} health declaratio `,
    text: `Dear ${fullName}!
    thanks you
    ChienLVM`,
    html: '<h1>Chữ kí của bạn</h1>',
    attachments: [
      {
        filename: 'covid-19.png',
        path: './data/fff.png',
      },
    ],
  };

  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
  });
  res.render('pages/success');
});
app.listen(port);
console.log(`server start with port: ${port}`);
