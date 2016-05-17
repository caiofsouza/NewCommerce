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


app.controller('HomeCtrl', ['$scope', function($scope){

	$scope.message = 'teste';
	
}]);
app.controller('LoginCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth){
	
	$scope.user_email = "";
	$scope.user_password = "";

	$scope.auth = new Auth();

	$scope.user_login = function(){
		$scope.auth.checkUser({});

		$scope.messageError = "";
		
		if($scope.user_email != "" && $scope.user_password != ""){

			$scope.email_error = $scope.pass_error = false;

		}else{
			if($scope.user_email == ""){
				$scope.email_error = true;
				$scope.messageError = "Preencha o campo de email";
			}else{
				$scope.pass_error = true;
				$scope.messageError = "Preencha o campo de senha";
			}
		}

		$location.path( "/product/123456" );
	};

}]);
app.controller('MenuCtrl', ['$scope', function($scope){
	$scope.user = {
		name: "Caio Fernandes",
		email: "caio_fsouza@hotmail.com",
		active: true
	};
}]);
app.controller('ProductCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
	$scope.product_id = $routeParams.product_id;
	$scope.message = "Product page";
}]);
app.factory('Auth', ['$http', function($http) {  
    function Auth(){
        this.id = '12345';
    };

    Auth.prototype = {
        checkUser: function(user_obj) {
            $http({
                method: "GET",
                data: { 
                    'email' : user_obj.email, 
                    'password': user_obj.pass 
                },
                url: 'http://localhost:3000/'
            }).success(function(data){
                console.log(data);
                app.constant('AuthTOKEN', data.token);
            }).error(function(data){
                console.log(data);
            });
        }
    };

    return Auth;
}]);