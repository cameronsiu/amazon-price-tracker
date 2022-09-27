var express = require('express');
var router = express.Router();
const { getProducts } = require('../db/conn');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send({"msg" : 'respond with a resource'});
// });

router.get('/', async (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  //console.log(req);
  const prods = await getProducts().catch(console.dir);
  res.json({ msg: "Message delivered!", products: prods});
  
});

module.exports = router;

