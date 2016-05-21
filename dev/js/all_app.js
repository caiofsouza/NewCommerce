'use strict';

var API_HOST = 'http://localhost:3000/api/';
var app = angular.module('newCommerce', ['ngRoute', 'ngCookies']);

app.config(['$locationProvider', '$routeProvider',
    function($locationProvider, $routeProvider){


    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'LoginCtrl'
        })
        .when('/Product', {
            templateUrl: 'views/product.html',
            controller: 'ProductCtrl'
        });

    $routeProvider.otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode(true);

}]);

app.run(['$rootScope','$cookies', '$q',
    function($rootScope, $cookies, $q) {

        // get the json obj session
        var session_obj = JSON.parse($cookies.get('api_auth')) != undefined ? 
        JSON.parse($cookies.get('api_auth')) : null;

        var token = session_obj != null ? session_obj.token : null;

        console.log(session_obj, token);

    }
]);


app.controller('HomeCtrl', [function(){

	this.message = 'teste';
	
}]);
app.controller('LoginCtrl', ['$location', 'Auth', '$http', function($location, Auth, $http){
	var self = this;

	self.user_email = "";
	self.user_password = "";
	self.auth = new Auth();

	self.user_login = function(){
		self.messageError = "";
		
		if(self.user_email != "" && self.user_password != ""){
			self.email_error = self.pass_error = false;

			var user_obj = {
				username: self.user_email, 
				password: self.user_password 
			};


			self.auth.loginUser(user_obj, function(result){
				console.log("resultado: "+result);
				if(result == true){
					$location.path( '/home' );
				}else{
					self.messageError = "Usuário ou senha incorretos!";
				}
			});	

		}else{
			if(self.user_email == ""){
				self.email_error = true;
				result_msg = "Preencha o campo de email";
			}else{
				self.pass_error = true;
				result_msg = "Preencha o campo de senha";
			}
		}

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
app.factory('Auth', ['$http', '$location', '$cookies',
    function($http, $location, $cookies) {  

    function Auth(){
        this.token = '';

    };

    Auth.prototype = {
        loginUser: function(user_obj, fncallback) {
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
                    username: user_obj.username,
                    password: user_obj.password
                }
            }).then(function successCallback(response) {
                // save token in session
                $cookies.put('api_auth', JSON.stringify(response.data));
                app.run(['$http', function ($http) {
                    $http.defaults.headers.common['x-access-token'] = response.data.token;
                }]);

                if(fncallback != undefined){
                    fncallback(true);
                }

            }, function errorCallback(response) {

                if(fncallback != undefined){
                    fncallback(false);
                }
            });

        }
    };

    return Auth;
}]);