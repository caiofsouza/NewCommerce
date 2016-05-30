var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var moment = require('moment');

var app = express();

// the key to jwt
var SECRET_KEY = '3e00e9485012252c3212df44549b0b01';

var db = 'mongodb://localhost/newcommerce';
mongoose.connect(db);

// ==================================
// ------------ MODELS --------------
// ==================================

var Product = require('./models/ProductModel');
var User = require('./models/UserModel');

// ==================================
// ------------ MODELS --------------
// ==================================


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

router.route('/products')

	.get(function(req, res) {

		Product.find(function(err, products){
			if (err){
	           	res.send(err);
			}else{
	            res.json(products);
			}
		});
	});

router.route('/search-products/:search')

	.get(function(req, res){

		var regex = new RegExp(req.params.search, 'i');
		// find all products using regex and query only by name and description 
		Product.find()
		.or(
			[
				{ 'name': { $regex: regex } }, 
				{ 'code': { $regex: regex } },
				{ 'description': { $regex: regex } }

			]).exec(function(err, products) {
		    	res.json(products);
		});

	});


router.route('/login')

	.post(function(req, res){
		var useremail = req.body.email || '';
	    var password = req.body.password || '';

	    if (useremail == '' || password == '') {
	        return res.status(400).json({ data: 'Dados vazios!'});
	    }else{
	    	User.findOne({ email: useremail }, function(err, user){
	    		if(err){
	    			return res.status(400).send({ error: 'Usuário nao localizado!'});
	    		}else{
	    			
		    		user.comparePassword(password, function(err, isMatch){
		    			if (err || isMatch == false){

		    				return res.status(400).send({ error: isMatch});

		    			}else{

							var user_obj = {
					            email: user.email,
					            id: user._id
					        };
					        
					        var expires = moment().add(7, 'days').valueOf();

					        var token = jwt.encode({
					            iss: user_obj.id,
					            exp: expires
					        }, SECRET_KEY);

					        
					        return res.status(200).send({
					            token: token,
					            expires: expires,
					            user: user_obj
					        });      		

		    			}
						
		    		});
	    			
	    		}

	    	});

	    }
	});	



router.route('/')
	// .get(function(req, res){
	// 	var user = new User({
	// 		"name" : "Caio Fernandes",
	// 		"email" : "caio_fsouza@hotmail.com",
	// 		"password" : "1234"
	// 	});

	// 	user.save(function(err){
	// 		if (err){
	//         	res.json({"error": err });
	//         }else{


	// 		    User.findOne({ name: 'Caio Fernandes' }, function(err, user) {
	// 		        if (err){
	// 		        	res.json({"error": err });
	// 		        }else{
	// 		        	res.json({"result": user});
	// 		        }

	// 			});
	//         }

			
	// 	});

	// });


app.use('/api', router);


app.listen(3000, function () {
	console.log('NewCommerce listening on port 3000!');
});


