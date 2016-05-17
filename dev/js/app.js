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

