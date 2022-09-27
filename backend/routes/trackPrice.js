var express = require('express');
var router = express.Router();
const { insertProduct } = require('../db/conn');
const { build } = require('../selenium/build');

router.post('/', async (req, res) => {
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

module.exports = router;