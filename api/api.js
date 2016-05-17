var mongoose = require('mongoose');
var express = require('express');
var app = express();

var db = 'mongodb://127.0.0.1/newcommerce';
mongoose.connect(db);

// Add headers
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get('/', function (req, res) {
	res.send("eae");
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});


