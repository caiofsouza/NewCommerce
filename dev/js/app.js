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

