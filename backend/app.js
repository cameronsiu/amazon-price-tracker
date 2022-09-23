const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');

const app = express();


const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");

app.use(cors())
app.use(express.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', indexRouter);
app.get('/getData', (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  //console.log(req);
  res.json({ msg: "Message delivered!"});
});

app.post('/trackPrice', (req, res) => {
  //console.log(req);
  console.log("BODY IS: ", req.body['URL']);
  //console.log(typeof(req.body));
  const url = req.body['URL'];
  //build(url);
  res.json(req.body);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const service = new chrome.ServiceBuilder('./chromedriver.exe');
async function build(URL) {
  //let driver = await new Builder().forBrowser('chrome').setChromeService(service).build();

  let driver = await new Builder().forBrowser('chrome').setChromeService(service).setChromeOptions(new chrome.Options().headless().addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36")).build();
  //await driver.get('https://www.amazon.ca/LG-27GL83A-B-27-Inch-Led-Lit-14700510/dp/B07YGZL8XF');
  await driver.get(URL);
  //const source = await driver.getPageSource();
  //console.log(source);
  //const price_promise = await driver.wait(until.elementLocated(By.className('a-price-whole')), 30000, 'Timed out after 30 seconds', 5000);
  const price_promise = await driver.findElement(By.className('a-price-whole'));
  const price_text = await price_promise.getText();
  console.log(price_text);
  const price_fraction_promise = await driver.findElement(By.className('a-price-fraction'));
  const price_fraction_text = '.' + (await price_fraction_promise.getText());
  console.log(price_fraction_text);
  const int_price = parseFloat(price_text + price_fraction_text);
  console.log(int_price);
  
  await driver.quit();
};


const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb+srv://csiu02:1221@cluster0.558obql.mongodb.net/?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



module.exports = app;
