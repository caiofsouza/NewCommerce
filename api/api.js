var mongoose = require('mongoose');
var express = require('express');
var app = express();

var db = 'mongodb://127.0.0.1/newcommerce';
mongoose.connect(db);


app.get('/', function (req, res) {
	res.send("eae");
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});


