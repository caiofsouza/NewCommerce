'use strict';

var API_HOST = 'http://localhost:3000/api/';
var app = angular.module('newCommerce', ['ngRoute', 'ngCookies']);


app.config(['$locationProvider', '$routeProvider',
    function($locationProvider, $routeProvider){

    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            needAuth: false
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            needAuth: false
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl',
            needAuth: true
        })
        .when('/products', {
            templateUrl: 'views/products.html',
            controller: 'ProductsCtrl',
            needAuth: true
        })
        .when('/product', {
            templateUrl: 'views/product.html',
            controller: 'ProductCtrl',
            needAuth: true
        });


    $routeProvider.otherwise({ redirectTo: '/home' });
    $locationProvider.html5Mode(true);

}]);

app.run(['$rootScope','$cookies', '$location', '$route', '$timeout', 
    function($rootScope, $cookies, $location, $route, $timeout) {

        $rootScope.$on('$routeChangeStart', function(event, next, current) { 
            // get the json obj session
            var session_obj = $cookies.get('api_auth') != undefined ? 
            JSON.parse($cookies.get('api_auth')) : undefined;
            var token = session_obj != undefined ? session_obj.token : undefined;


            var nextPath = $location.path();
            var nextRoute = $route.routes[nextPath];

            if(next.needAuth == true && token == undefined){
                // redirect to login if need auth 
                $location.path("/login");

            }else if(nextPath == '/login' && token != undefined){
                // redirect to home if have token
                $location.path("/home");
                
            }

        });

    }
]);

