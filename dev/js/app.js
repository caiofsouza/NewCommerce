'use strict';


var API_HOST = 'http://localhost:3000/api/';
var app = angular.module('newCommerce', ['ngRoute', 'ngCookies', 'ui.utils.masks', 'ngSanitize', 'ui.select']);

app.filter('formatDate', function(){
    // receive date on yyyy-mm-dd hh:mm:ss format
    // and return dd/mm/yyyy hh:mm:ss
    return function(date){

        var year =  date.slice(0,4);
        var month = date.slice(5,7);
        var day = date.slice(8,10);
        var hours = date.slice(10);

        return day+'/'+month+'/'+year + " às "+ hours;
        
    }

});

app.filter('realCurrency', function(){
    // receive date on yyyy-mm-dd hh:mm:ss format
    // and return dd/mm/yyyy hh:mm:ss
    return function(value){

        var new_value = "R$ "+ (value.toFixed(2)).replace('.', ',');
        return new_value;   
        
    }

});

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
        })
        .when('/orders/:order_id', {
            templateUrl: 'views/order.html',
            controller: 'OrderCtrl',
            title: "Pedido",
            needAuth: true
        })
        .when('/orders', {
            templateUrl: 'views/orders.html',
            controller: 'OrdersCtrl',
            title: "Pedidos",
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



