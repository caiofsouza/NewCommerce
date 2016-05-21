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

