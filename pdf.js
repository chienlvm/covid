const puppeteer = require('puppeteer')

const captureScreenshot = async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })

  const page = await browser.newPage();
  await page.setViewport({ width: 1680, height: 1050 });


  await page.goto('https://viblo.asia/organization-feature', { waitUntil: 'networkidle2' })
  await page.pdf({
    path: 'storage/formcreate.pdf',
    format: 'A5',
    landscape: true,
    printBackground: true,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    }
  })

  await browser.close()
}

module.exports = captureScreenshot;
