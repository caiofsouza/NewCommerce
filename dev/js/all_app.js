'use strict';


var API_HOST = 'http://localhost:3000/api/';
var app = angular.module('newCommerce', ['ngRoute', 'ngCookies']);



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
        });


    $routeProvider.otherwise({ redirectTo: '/home' });
    $locationProvider.html5Mode(true);

}]);

app.run(['$rootScope','$location', '$route', 'Auth','$http',
    function($rootScope, $location, $route, Auth, $http) {
        var auth = new Auth();
        // console.log(auth);

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

        $rootScope.$on("$routeChangeSuccess", function(current, previous){
            //Change page title, based on Route information
            $rootScope.title = current.title;
        });

    }
]);


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
app.controller('ProductCtrl', [ '$routeParams', '$cookies',  
	function($routeParams, $cookies){
	var self = this; 
	

	if($routeParams.product_id){
		self.product_id = $routeParams.product_id;
	}else{

	}



	self.user = JSON.parse($cookies.get('api_auth')).user;
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
                // console.log(response.data);
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