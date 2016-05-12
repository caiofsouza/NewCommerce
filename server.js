var mongoose = require('mongoose');
var express = require('express');
var app = express();


mongoose.connect('mongodb://127.0.0.1/newcommerce');

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
	res.send(users_doc);
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});