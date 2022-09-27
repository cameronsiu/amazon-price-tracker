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

let debug = 0;
app.get('/getData', async (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  //console.log(req);
  debug += 1;
  console.log(debug);
  const prods = await run().catch(console.dir);
  res.json({ msg: "Message delivered!", products: prods});
  
});

app.post('/trackPrice', async (req, res) => {
  //console.log(req);
  console.log("BODY IS: ", req.body['URL']);
  //console.log(typeof(req.body));
  const url = req.body['URL'];
  const price = await build(url);
  const name = url.split('https://www.amazon.ca/')[1].split('/dp/')[0];
  req.body['name'] = name;
  // console.log(price);
  req.body['price'] = price;
  await insertProduct(req.body);
  console.log(req.body);
  res.json(req.body);
})

app.post('/deletePrice', async (req, res) => {
  //console.log(req);
  console.log("BODY IS: ", req.body);
  //console.log(typeof(req.body));
  await deleteProduct(req.body['_id']);
  res.json("Deleted item!");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//TODO: Build should be its own separate file
const service = new chrome.ServiceBuilder('./chromedriver.exe');
async function build(URL) {
  let driver = await new Builder().forBrowser('chrome').setChromeService(service).setChromeOptions(new chrome.Options().headless().addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36")).build();
  //await driver.get('https://www.amazon.ca/LG-27GL83A-B-27-Inch-Led-Lit-14700510/dp/B07YGZL8XF');
  await driver.get(URL);

  const price_locations = [By.className('a-price'), By.id('price')];

  for (price_location of price_locations) {
    let price = await driver.findElement(price_location).getText();
    if (price !== "") { // If true, element exists, otherwise element doesn't exist.
      price = price.split('\n').join('.');
      console.log(`Debug: (${price})`);
      await driver.quit();
      return price;
    }
  }

  await driver.quit();
  return "Cannot find price";
};

/*
Example links:
https://www.amazon.ca/Real-Book-6th-Leonard-Corp/dp/0634060384 - id price
https://www.amazon.ca/LG-UltraGear-34GP83A-B-Adaptive-Sync-Compatible/dp/B08DWD38VX - className a-price
*/

//TODO: Connecting to MongoDB should be its own separate file
const { MongoClient, ObjectId } = require("mongodb");

// Connection URI
const uri = "mongodb+srv://csiu02:1221@cluster0.558obql.mongodb.net/?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
console.log("Connected successfully to server");


async function run() {
  const result = [];
  try {
    const database = client.db("users");
    const products = database.collection("cameron").find(); // change this to user name or user_id
    await products.forEach(doc => result.push(doc));
    console.log("RUN FUNCTION RESULT: ", result);
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function insertProduct(product) {
  try {
    const database = client.db("users");
    const products = await database.collection("cameron").insertOne(product); // change this to user name or user_id
  } catch (err) {
    console.log(err);
  }
}

async function deleteProduct(productId) {
  try {
    const database = client.db("users");
    const products = await database.collection("cameron").deleteOne({_id: ObjectId(productId)}); // change this to user name or user_id
    console.log(products);
  } catch (err) {
    console.log(err);
  }
}

module.exports = app;
