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
const home = require('./router/home');

// pdf
const PDFDocument = require('pdfkit');
const fs = require('fs');
// base 64
var base64 = require('base-64');

var isSubmit = false;

// mail
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
  isSubmit = true;
  res.render('pages/index');
});
// submit
app.post('/action_page', function (req, res) {
  var email = req.body.email;
  var fullName = req.body.fullname;
  var signature = req.body.signature;

  // for pdf
const doc = new PDFDocument(
  {
    size: [300, 300],
    margins : { // by default, all are 72
      top: 10,
      bottom:10,
      left: 10,
      right: 10
    }
  }
);
  var buffer = Buffer.from(signature.split(',')[1] || '', 'base64');
  var date = new Date();
  var nameFile = `form_${fullName}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}_${date.getTime()}.pdf`
  doc.pipe(fs.createWriteStream(`./data/form_${fullName}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}_${date.getTime()}.pdf`));
  doc
    .font('./font/PALAT32.ttf')
    .fontSize(14)
    .text(`Thanks you ${fullName} has submitec`, 10, 100);

  doc.image(buffer, 0, 100, {
    fit: [100, 300],
    align: 'center',
    valign: 'center'
  });
  doc.end();

  //  captureScreenshot();

  var mailOptions = {
    from: 'entrycovid19@gmail.com',
    to: `${email}`,
    subject: `Thanks ${fullName} health declaratio `,
    text: `Dear ${fullName}!
    thanks you
    ChienLVM`,
    html: `<h1>Thanks you ${fullName} submit heat</h1>`,
    attachments: [
      {
        filename: `${nameFile}`,
        path: `./data/${nameFile}`,
      },
    ],
  };

  console.log('co vao day ko');
  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    res.redirect('pages');
  }
  });
  // res.render('pages/success');

});

app.get('/pages', home.index);


app.listen(port);
console.log(`server start with port: ${port}`);
