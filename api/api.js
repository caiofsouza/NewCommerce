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
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,X-ACCESS-TOKEN');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Content-Type','application/json');
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {

	// middleware to api calls

	// if not is login page
	if(req.path.indexOf('login') < 0){

		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if(token){
			var now = new Date();
			var user = jwt.decode(token, SECRET_KEY);
			var expires = new Date(user.exp * 1000);

			if(expires <= now){
				
				res.status(200).json({ message: "Seu token expirou", token: token });

			}else{
		    	User.findOne({ _id: user.uid },function(err, user){
		    		if(user){
		    			next();
		    		}
		    	});
			}

		}else{
			res.status(200).json({ message: "Acesso negado."});
		}
	}else{
		next();
	}


});

router.route('/product')

	.post(function(req, res) {

		if(req.body != undefined && req.body != ""){
			var new_product = new Product(req.body);


			new_product.url = new_product.name.toLowerCase();
			new_product.url = new_product.url.replace(/[^\w\s]/gi,"").replace(/\s/g, "-");

			Product.findOne({ url: new_product.url }, function(err, product){
				if (err){
		        	res.status(400).send(err);
		        }else{
		        	// if have a product with the same url
		        	if(product != null){
		        		// change url to dont be equal
		        		new_product.url = new_product.url+"-"+new_product.code;

		        	}

		        	new_product.save(function(err){
						if (err){
				        	res.status(400).send(err);
				        }else{

						    Product.findOne({ url: new_product.url  }, function(err, product) {
						        if (err){
						        	res.status(400).send(err);
						        }else{
						        	res.json({"result": product});
						        }

							});

				        }
					});
				}

        	});

		}
	});


router.route('/product/:product_id')

	.get(function(req, res){

		Product.findById(req.params.product_id, function(err, product){
			if (err){
	           	res.status(400).send(err);
			}else{
	            if(product){
	            	res.status(200).json(product);
	            }else{
	            	res.status(200).json({"message": "Produto Não encontrado"});
	            }
			}
		});

	})

	.put(function(req, res){

		Product.findById(req.params.product_id, function(err, product) {

            if (err){
                res.send(err);
            }else{


            	product.name = req.body.name;
            	product.code = req.body.code;
            	product.price = req.body.price;
            	product.stock = req.body.stock;
            	product.description = req.body.description;

            	if(req.body.url == undefined || req.body.url == ""){
            		product.url = product.name.toLowerCase();
					product.url = product.url.replace(/[^\w\s]/gi,"").replace(/\s/g, "-");
            	}else{
            		product.url = req.body.url;
            	}

            	product.categories = req.body.categories;
            	product.tags = req.body.tags;
            	product.available_marketplace = req.body.available_marketplace;
            	product.active = req.body.active;

	            // save the product
	            product.save(function(err) {
	                if (err){
	                    res.send(err);
	                }else{
	                	res.status(200).json({ message: "Produto Atualizado!", result: product });
	                }

	            });
            	
            }

        });

	});

router.route('/products')

	.get(function(req, res) {

		Product.find(function(err, products){
			if (err){
	           	res.status(400).send(err);
			}else{
	            res.status(200).send(products);
			}
		});
	});

router.route('/tags')

	.get(function(req, res){
		Product.find().distinct("tags", function(err, tags){
			if (err){
	           	res.status(400).send(err);
			}else{
	            res.status(200).send(tags);
			}
		});
	});

router.route('/categories')

	.get(function(req, res){
		Product.find().distinct("categories", function(err, categories){
			if (err){
	           	res.status(400).send(err);
			}else{
	            res.status(200).send(categories);
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
				{ 'description': { $regex: regex } },
				{ 'tags': { $regex: regex } }

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
					            uid: user_obj.id,
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



// router.route('/')
// 	.get(function(req, res){
// 		var user = new User({
// 			"name" : "Admin",
// 			"email" : "admin",
// 			"password" : "admin",
// 			"age": 22,
// 		    "active": true,
// 		    "created_at": "2016-05-30 12:00:00"
// 		});

// 		user.save(function(err){
// 			if (err){
// 	        	res.json({"error": err });
// 	        }else{

// 			    User.findOne({ name: 'Admin' }, function(err, user) {
// 			        if (err){
// 			        	res.json({"error": err });
// 			        }else{
// 			        	res.json({"result": user});
// 			        }

// 				});

// 	        }

			
// 		});


// 	});


app.use('/api', router);


app.listen(3000, function () {
	console.log('NewCommerce listening on port 3000!');
});




