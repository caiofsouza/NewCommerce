'use strict';

var API_HOST = 'http://localhost:3000/api/';
var app = angular.module('newCommerce', ['ui.router', 'ngCookies']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){


    $stateProvider
    .state('login', {
        url: "/login",
        templateUrl: "public/views/login.html",
        data: {
            requireToken: false
        }
    })
    .state('home', {
        url: "/home",
        templateUrl: "public/views/home.html",
        data: {
            requireToken: true
        }
    });

    $urlRouterProvider.otherwise('/home');

}]);

app.run(['$rootScope','$state', '$cookies',
    function($rootScope, $state, $cookies) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams) { 

            // get the json obj session
            var session_obj = $cookies.get('api_auth') != undefined ? $cookies.get('api_auth') : null;
            var token = session_obj != null ? session_obj.token : null;

            var requireToken = toState.data.requireToken;

            console.log(session_obj, toState, token);

            // check if the view need token
            if(requireToken && ( token == undefined || token == null || token == "") ){
                event.preventDefault();
                console.log("IF1");
                $state.go("login");
            }else if(toState.name == 'login' && token != undefined){
                console.log("ESLE2");
                $state.go("home");
            }
            
        });

    }
]);


app.controller('HomeCtrl', [function(){

	this.message = 'teste';
	
}]);
app.controller('LoginCtrl', ['$location', 'Auth', '$http', function($location, Auth, $http){
	
	this.user_email = "";
	this.user_password = "";
	this.auth = new Auth();

	this.user_login = function(){
		this.messageError = "";
		
		if(this.user_email != "" && this.user_password != ""){
			this.email_error = this.pass_error = false;

			var user_obj = {
						username: this.user_email, 
						password: this.user_password 
					};


			this.auth.loginUser(user_obj, function(result){
				console.log("resultado: "+ result);

				if(result == true){
					// logged 
					$location.path( "/home" );
				}else{
					// user or pass wrong
					this.messageError = 'Usuário ou senha incorretos!';
				}
			});

		}else{
			if(this.user_email == ""){
				this.email_error = true;
				this.messageError = "Preencha o campo de email";
			}else{
				this.pass_error = true;
				this.messageError = "Preencha o campo de senha";
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
        loginUser: function(user_obj, callback) {
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
                $cookies.put('api_auth', response.data);
                app.run(['$http', function ($http) {
                    $http.defaults.headers.common['x-access-token'] = response.data.token;
                }]);

                return true;

            }, function errorCallback(response) {

                return false;
            });

        }
    };

    return Auth;
}]);