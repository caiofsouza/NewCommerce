'use strict';


var API_HOST = 'http://localhost:3000/api/';
var app = angular.module('newCommerce', ['ngRoute', 'ngCookies', 'ui.utils.masks', 'ngSanitize', 'ui.select']);

app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];
            if (angular.isArray(items)) {

                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }

                        if (itemMatches) {
                            out.push(item);
                        }
                });

            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
});


app.config(['$locationProvider', '$routeProvider', '$httpProvider', 
    function($locationProvider, $routeProvider, $httpProvider){

    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            title: "Login",
            needAuth: false
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            title: "Login",
            needAuth: false
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl',
            title: "Home",
            needAuth: true
        })
        .when('/products', {
            templateUrl: 'views/products.html',
            controller: 'ProductsCtrl',
            title: "Produtos",
            needAuth: true
        })
        .when('/products/new', {
            templateUrl: 'views/new_product.html',
            controller: 'ProductCtrl',
            title: "Novo Produto",
            needAuth: true
        })
        .when('/product/:product_id', {
            templateUrl: 'views/product.html',
            controller: 'ProductCtrl',
            title: "Produto",
            needAuth: true
        })
        .when('/categories', {
            templateUrl: 'views/categories.html',
            controller: 'CategoriesCtrl',
            title: "Categorias",
            needAuth: true
        })
        .when('/categories/new', {
            templateUrl: 'views/new_category.html',
            controller: 'CategoryCtrl',
            title: "Nova Categoria",
            needAuth: true
        })
        .when('/category/:category_id', {
            templateUrl: 'views/category.html',
            controller: 'CategoryCtrl',
            title: "Categoria",
            needAuth: true
        });


    $routeProvider.otherwise({ redirectTo: '/home' });
    $locationProvider.html5Mode(true);

}]);

app.run(['$rootScope','$location', '$route', 'Auth','$http', '$interval',
    function($rootScope, $location, $route, Auth, $http, $interval) {
        var auth = new Auth();
        // console.log(auth);

        // $interval(function(){
        //     auth.checkUser(function(cookie_obj){
        //         console.log(cookie_obj);
        //     });
        // }, 10000);

        auth.checkUser(function(cookie_obj){

            if(cookie_obj){
                $http.defaults.headers.common['x-access-token'] = cookie_obj.token;
            }
        });

        $rootScope.$on('$routeChangeStart', function(event, next, current) { 

            $rootScope.path = $location.path();
            
            auth.checkUser(function(cookie_obj){ 

                if(cookie_obj){
                    // console.log(cookie_obj);
                    $http.defaults.headers.common['x-access-token'] = cookie_obj.token;
                    // console.log($http.defaults.headers.common);
                } 

                var nextPath = $location.path();
                var nextRoute = $route.routes[nextPath];


                if(next.needAuth == true && cookie_obj == undefined){
                    // redirect to login if need auth 
                    $location.path("/login");

                }else if( ( nextPath == '/login' || nextPath == '/' ) && cookie_obj != undefined){
                    // redirect to home if have token
                    $location.path("/home");
                    
                }
            });


        });

        $rootScope.$on("$routeChangeSuccess", function(event, current, previous){
            //Change page title, based on Route information
            $rootScope.title = $route.current.title;
        });



    }
]);


app.controller("CategoriesCtrl", ['$scope', '$cookies', '$location', '$http',
	function($scope, $cookies, $location, $http){
	var self = this;

	// user var to load header infos
	self.user = JSON.parse($cookies.get('api_auth')).user;

	self.allCategories = [];
	self.onEdition = "";
	self.category = {
		name: "",
		sub_cats: []
	};
	self.messageAdd = "";


	self.getAllCategories = function(){
		self.inLoading = true;
		$http.get(API_HOST + 'categories').then(function(res){
			// return res.data;
			self.allCategories = res.data.sort(function(a, b){
				if (a.name.toLowerCase() > b.name.toLowerCase()) {
				    return 1;
			    }
			  	if (a.name.toLowerCase() < b.name.toLowerCase()) {
			    	return -1;
			  	}
				// a must be equal to b
		  		return 0;
			});

			self.inLoading = false;
		});
	};

	self.getAllCategories();

	self.saveCategory = function(){
		self.messageAdd = "";

		if(self.category.name != ""){

			self.inLoading = true;

			$http.post(API_HOST + 'category', self.category).then(function(res){

				if(res.data.result){

					self.category = {
						name: "",
						sub_cats: []
					};

					self.allCategories.push(res.data.result);

					self.allCategories = self.allCategories.sort(function(a, b){
						if (a.name.toLowerCase() > b.name.toLowerCase()) {
						    return 1;
					    }
					  	if (a.name.toLowerCase() < b.name.toLowerCase()) {
					    	return -1;
					  	}
						// a must be equal to b
				  		return 0;
					});


					self.messageAdd = "Categoria adicionada com sucesso!";
					self.inLoading = false;
				}
			});

		}else{
			self.messageAdd = "Preencha o campo de nome!";
		}
	};

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};

	self.edit = function(cat_id){

		var hideAll = self.allCategories.filter(function(el){
			return el.visible === true;
		});

		if(hideAll.length > 0){
			hideAll[0].visible = false;
		}

		var selectedCategory = self.allCategories.filter(function(el){
			return el._id === cat_id;
		});



		if(hideAll.length > 0 && hideAll[0]._id == cat_id){
			// btn salvar clicked
			
			if(selectedCategory[0].name != ""){
				$http.put( API_HOST + 'category/' + cat_id, selectedCategory[0]).then(function(res){
					selectedCategory[0].btnStatus = "Editar";
					selectedCategory[0].visible = false;
				});
			}

		}else{
			// btn editar clicked
			selectedCategory[0].btnStatus = "Salvar";
			selectedCategory[0].visible = true;
		}
		
	};

}]);
app.controller('HomeCtrl', ['$cookies', '$location',
	function($cookies, $location){
	var self = this;

	self.user = JSON.parse($cookies.get('api_auth')).user;



	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};
	
}]);
app.controller('LoginCtrl', ['$location', 'Auth', '$http',
	function($location, Auth, $http){
	var self = this;

	self.user_email = "";
	self.user_password = "";
	self.auth = new Auth();

	self.user_login = function(){
		self.messageError = "";
		
		if(self.user_email != "" && self.user_password != ""){
			self.email_error = self.pass_error = false;


			var user_obj = {
				email: self.user_email, 
				password: self.user_password 
			};


			self.auth.loginUser(user_obj, function(result){
				if(result == true){
				  	$location.path("/home").replace(); 
				}else{
					self.messageError = "Usuário ou senha incorretos!";
				}
			});	

		}else{
			if(self.user_email == ""){
				self.email_error = true;
				self.messageError = "Preencha o campo de email";
			}else{
				self.pass_error = true;
				self.messageError = "Preencha o campo de senha";
			}
		}

	};

}]);
app.controller('ProductCtrl', ['$location','$routeParams', '$cookies', '$http',   
	function($location, $routeParams, $cookies, $http){
	var self = this; 
	
	// user var to load header infos
	self.user = JSON.parse($cookies.get('api_auth')).user;
	self.messageError = "";

	self.product = {
		available_marketplace: false,
		active: false,
		tags: []
	};

	self.inLoading = false;

	self.allTags = [];
	self.selectedCategories = [];
	self.allCategories = [];

	self.getAllTags = function(){
		self.inLoading = true;
		$http.get(API_HOST + 'tags').then(function(res){
			// return res.data;
			self.allTags = res.data;
			self.inLoading = false;
		});
	};

	self.getAllTags();

	self.getAllCategories = function(){
		self.inLoading = true;
		$http.get(API_HOST + 'categories').then(function(res){
			// return res.data;
			self.allCategories = res.data;
			self.inLoading = false;
		});
	};

	self.getAllCategories();
	


	// need to study a way to use the same url to get by id and by url
	// self.getProductByUrl = function(productUrl){
	// 	$http.get(API_HOST + 'product/'+productUrl).then(function(res){
	// 		// return res.data;
	// 		self.product = res.data;
	// 		self.product.url = self.newUrl(self.product.name);
	// 	});
	// };

	self.getProductById = function(product_id){
		self.inLoading = true;
		$http.get(API_HOST + 'product/'+product_id).then(function(res){
			// return res.data;
			self.product = res.data;
			
			console.log(self.product.categories);

			self.selectedCategories = self.product.categories;
			self.inLoading = false;
		});
	};


	if($routeParams.product_id){
		var i = 0;
		self.getProductById($routeParams.product_id);
	}


	self.save = function(){

		self.validForm(function(hasError){
			if(!hasError){
				self.inLoading = true;
				// if dont have any error
				console.log(self.product);
				$http.post(API_HOST + 'product/', self.product).then(function(res){
					if(res.data.result){
						self.messageError = "Produto adicionado com sucesso!";
						self.product = {
							available_marketplace: false,
							active: false,
							tags: []
						};
					}
					self.inLoading = false;
				});
			}
		});
		
	};

	self.update = function(){

		self.validForm(function(hasError){
			if(!hasError){
				// if dont have any error
				self.inLoading = true;
				
				$http.put(API_HOST + 'product/'+self.product._id, self.product ).then(function(res){
					if(res.data.message){
						self.messageError = "Produto alterado com sucesso!";
						self.product = res.data.result;
					}
					self.inLoading = false;
				});
			}
		});
		
	};

	self.validForm = function(fnCallback){
		var hasError = false;
		self.messageError  = "";
		self.product_name_error = 
		self.product_code_error = 
		self.product_price_error = 
		self.product_stock_error = 
		self.product_description_error = false;

		// check each input field
		if(self.product.name == "" || self.product.name == undefined){
			self.product_name_error = true;
			self.messageError = "Preencha o campo de nome";
			hasError = true;

		}else if(self.product.code == "" || self.product.code == undefined){
			self.product_code_error = true;
			self.messageError = "Preencha o campo de código";
			hasError = true;

		}else if(self.product.price == "" || self.product.price == undefined){
			self.product_price_error = true;
			self.messageError = "Preencha o campo de preço";
			hasError = true;

		}else if(self.product.stock == "" || self.product.stock == undefined){
			self.product_stock_error = true;
			self.messageError = "Preencha o campo de estoque";
			hasError = true;

		}else if(self.product.description == "" || self.product.description == undefined){
			self.product_description_error = true;
			self.messageError = "Preencha o campo de descrição";
			hasError = true;
		}

		if(fnCallback != undefined){
			fnCallback(hasError);
		}
	};

	self.newUrl = function(name){
		var new_url = name.toLowerCase();
		new_url = new_url.replace(/[^\w\s]/gi,"").replace(/\s/g, "-");
		return new_url;
	};

	self.updateUrl = function(value){
		self.product.url = self.newUrl(value);
	};

	self.validateUrl = function(){
		var notAllowSpecialChars = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_/g;
		self.product.url = self.product.url.replace(/\s/g, '-').replace(notAllowSpecialChars, '').toLowerCase();
	};

	self.tagsToLower = function(){
		if(self.product.tags.length <= 0 ){
			self.product.tags = [];
		}else{
			var tags = [];
			var notAllowSpecialChars = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\s/g;
			self.product.tags.forEach(function(el, ind){
				tags.push(el.replace(notAllowSpecialChars, '').toLowerCase())
			});
			self.product.tags = tags;
		}
	};

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};

	
}]);
app.controller('ProductsCtrl', ['$cookies','$http', '$location', 
	function($cookies, $http, $location){
	var self = this;

	self.user = JSON.parse($cookies.get('api_auth')).user;

	self.searchProduct = function(){
		if(self.search_input != "" && self.search_input != undefined){
			$http.get(API_HOST + 'search-products/'+ self.search_input).then(function(res){
				self.products = res.data;
				self.count = self.products.length;
			});
		}else{
			self.getAllProducts();
		}
	}

	self.getAllProducts = function(){
		$http.get(API_HOST + 'products').then(function(res){
			// console.log(res);
			self.products = res.data;
			self.count = self.products.length;
		});
	};

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};

	self.count = 0;
	self.getAllProducts();

}]);
app.factory('Auth', ['$http', '$location', '$cookies',
    function($http, $location, $cookies) {  

    function Auth(){
        this.token = '';


        this.loginUser = function(user_obj, fncallback) {
            var response;

            $http({
                method: 'POST',
                url: API_HOST+'login/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data:{
                    email: user_obj.email,
                    password: user_obj.password
                }
            }).then(function successCallback(response) {
                // save token in session
                $cookies.put('api_auth', JSON.stringify(response.data));
                

                if(fncallback != undefined){
                    fncallback(true);
                }

            }, function errorCallback(response) {

                if(fncallback != undefined){
                    fncallback(false);
                }
            });

        };

        this.checkUser = function(fncallback){
            var token = $cookies.get('api_auth') != undefined ? 
                        JSON.parse($cookies.get('api_auth')) : undefined;

            if(fncallback != undefined){

                fncallback(token);
            }

        }
    };

    return Auth;
}]);
// jquery scripts for DOM
$(function() {
    $(document).on("click", ".dropdown", function(e) {
        e.preventDefault();
        $(this).find(".dropdown-submenu").slideToggle(200);
    });

});