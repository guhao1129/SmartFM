/**
 * Created by Duke on 16/8/30.
 */
var express = require('express');
var path = require('path');
//var router = require('./router');
var bodyParser = require('body-parser');
var router = require('./filter/router');

var app = express()
app.use(express.static(path.join(__dirname, 'public')));
var TEST_TABLE = 'Solution';
var GATEWAY_TABLE = 'Gateway'
app.all(/.*/, function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
    return next();
});
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
router.route(app);

app.listen(8089, function () {
    console.log("listening on 8089")
});

