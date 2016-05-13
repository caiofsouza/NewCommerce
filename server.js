var mongoose = require('mongoose');
var express = require('express');
var app = express();

var db = 'mongodb://127.0.0.1/newcommerce';

mongoose.connect(db);

var users_doc;

var Users = new mongoose.Schema({
	name: String,
	email: String,
	phone: String
});

var myModel = mongoose.model('users', Users);
myModel.find({}, function (err, docs) {
	users_doc = docs;
});


app.get('/', function (req, res) {
	res.send('servidor online :D');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});


