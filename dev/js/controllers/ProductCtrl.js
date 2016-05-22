app.controller('ProductCtrl', [ '$routeParams', function($routeParams){
	this.user = JSON.parse($cookies.get('api_auth')).user;
	
	this.product_id = $routeParams.product_id;
	this.message = "Product page";
}]);