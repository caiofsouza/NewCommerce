var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var app = express();

var db = 'mongodb://127.0.0.1/newcommerce';
mongoose.connect(db);

// Add headers
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Content-Type','application/json');
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

app.use('/api', router);


var rotas = require('./routes')
	router.route('/login')
	.post(rotas.login)
	router.route('/test')
	.get(require('./validadeAuth'), rotas.test);


app.get('/', function (req, res) {
	res.send("eae");
});


app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});


