var sassMiddleware = require('node-sass-middleware');
const express = require('express');
const app = express();
var serveStatic = require('serve-static');
var join = require('path').join;
var port = process.env.PORT || 9999;
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var cors = require('cors');
var atob = require('atob');

const puppeteer = require('puppeteer');
const path = require('path');
const home = require('./router/home');

// pdf
const PDFDocument = require('pdfkit');
const fs = require('fs');

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

// url for template 1: Zm9ybWNvdmlkXzE= => decode: formcovid1
const form1 = "formcovid_1";
const form2 = "formcovid_2";
const form3 = "formcovid_3";
// for home page
app.get('/', function (req, res) {
  res.render('pages/index',  { type: 999 });
});

// for tempate
app.get('/template/:template', function (req, res) {
  var template = atob(req.params.template);
  if (template === form1) {
    res.render('pages/index', { type: 1 });
  } else if (template === form2) {
    res.render('pages/index', { type: 2 });
  } else if (template === form3) {
    res.render('pages/index', { type: 3 });
  } else {
    res.render('pages/error');
  }
});
// submit
app.post('/action_page', function (req, res) {
  var name = req.body.content_1;
  var describe = req.body.content_2;
  var signature = req.body.signature;
  var fullContent = name + describe;
  var email = req.body.email;
  var fullName = 'chienlm';

  // for pdf
  const doc = new PDFDocument({
    size: [595, 842],
    margins: {
      // by default, all are 72
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
  });
  //  for pdf
  var buffer = Buffer.from(signature.split(',')[1] || '', 'base64');
  var date = new Date();
  var nameFile = `form_${fullName}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}_${date.getTime()}.pdf`;
  doc.pipe(
    fs.createWriteStream(
      `./data/form_${fullName}_${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDay()}_${date.getTime()}.pdf`
    )
  );
  doc.image('img/backgroupTop.png', 0, -300, {
    fit: [595, 842],
    align: 'center',
    valign: 'center',
  });
  var tmp = fullContent.split(/\r?\n/);
  tmp.forEach((data, index) => {
    if (index === 0) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(data.slice(0, name.length), 10, 200, {
          width: 500,
          continued: true,
          align: 'justify',
          font: 'Helvetica-Bold',
        })
        .font('Times-Roman')
        .text(data.slice(name.length), {
          width: 500,
          continued: true,
          align: 'justify',
        })
        .moveDown(0.5);
    } else {
      doc
        .font('Times-Roman')
        .fontSize(10)
        .text(data.trim(), {
          width: 500,
          align: 'justify',
        })
        .moveDown(0.5);
    }
  });
  doc
    .font('Helvetica-Bold')
    .text(
      `USA, ${new Date(Date.now()).toLocaleString().split(',')[0]}`,
      100,
      810,
      {
        align: 'right',
      }
    );
  doc
    .image(buffer, 10, 690, { width: 250 })
    .rect(5, 670, 300, 170)
    .stroke()
    .font('Helvetica-Bold')
    .text('Da ky', 10, 650);
  doc.end();
// end make pdf

  // for email
  var mailOptions = {
    from: 'entrycovid19@gmail.com',
    to: `${atob(email.split("").reverse().join(""))}`,
    subject: `Thanks your health declaratio `,
    text: `Dear chien!
    ${describe}
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

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('pages');
    }
  });
});

// for redirect
app.get('/pages', home.index);

// for error console
app.use(function (err, req, res, next) {
  res.status(500).render('pages/error');
})
// for 404
app.use(function(req, res, next){
  res.status(404).render('pages/error');
});

app.listen(port);
console.log(`server start with port: ${port}`);
