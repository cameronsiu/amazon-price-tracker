const { MongoClient, ObjectId } = require("mongodb");

// Connection URI
const uri = "mongodb+srv://csiu02:1221@cluster0.558obql.mongodb.net/?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
console.log("Connected successfully to server");

async function getProducts() {
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

module.exports.getProducts = getProducts;

async function insertProduct(product) {
  try {
    const database = client.db("users");
    const products = await database.collection("cameron").insertOne(product); // change this to user name or user_id
  } catch (err) {
    console.log(err);
  }
}

module.exports.insertProduct = insertProduct;

async function deleteProduct(productId) {
  try {
    const database = client.db("users");
    const products = await database.collection("cameron").deleteOne({_id: ObjectId(productId)}); // change this to user name or user_id
    console.log(products);
  } catch (err) {
    console.log(err);
  }
}

module.exports.deleteProduct = deleteProduct;