var express = require('express');
var router = express.Router();
const { deleteProduct } = require('../db/conn');

router.post('/', async (req, res) => {
    //console.log(req);
    console.log("BODY IS: ", req.body);
    //console.log(typeof(req.body));
    await deleteProduct(req.body['_id']);
    res.json("Deleted item!");
  })

module.exports = router;