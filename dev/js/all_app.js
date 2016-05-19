'use strict';

var app = angular.module('newCommerce', ['ngRoute']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    // $locationProvider.html5Mode(true);

	$routeProvider
        .when('/', {
            templateUrl : 'public/views/login.html',
            controller  : 'LoginCtrl'
        })
        .when('/products', {
            templateUrl : 'public/views/products.html',
            controller  : 'ProductsCtrl'
        })
        .when('/product/:product_id', {
            templateUrl : 'public/views/product.html',
            controller  : 'ProductCtrl'
        })
        .otherwise({ redirectTo: '/' });
}]);


app.controller('HomeCtrl', [function(){

	this.message = 'teste';
	
}]);
app.controller('LoginCtrl', ['$location', 'Auth', '$http', '$window', function($location, Auth, $http, $window){
	
	console.log("token1: "+$window.sessionStorage.token);

	this.user_email = "";
	this.user_password = "";

	this.auth = new Auth();

	this.user_login = function(){
		this.auth.checkUser({username: this.user_email, password: this.user_password });


		this.messageError = "";
		
		if(this.user_email != "" && this.user_password != ""){

			this.email_error = this.pass_error = false;

		}else{
			if(this.user_email == ""){
				this.email_error = true;
				this.messageError = "Preencha o campo de email";
			}else{
				this.pass_error = true;
				this.messageError = "Preencha o campo de senha";
			}
		}

		// $location.path( "/product/123456" );
	};

}]);
app.controller('MenuCtrl', [function($scope){
	this.user = {
		name: "Caio Fernandes",
		email: "caio_fsouza@hotmail.com",
		active: true
	};
}]);
app.controller('ProductCtrl', [ '$routeParams', function($routeParams){
	this.product_id = $routeParams.product_id;
	this.message = "Product page";
}]);
app.factory('Auth', ['$http', '$window', function($http, $window) {  

    function Auth(){
        this.token = '';

    };

    Auth.prototype = {
        checkUser: function(user_obj) {
            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/login/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data:{
                    username: user_obj.username,
                    password: user_obj.password
                }
            }).then(function successCallback(response) {
                // save token in session
                $window.sessionStorage.token = response.data.token;

            }, function errorCallback(response) {
                console.log("Error:", response);
            });
        }
    };

    return Auth;
}]);