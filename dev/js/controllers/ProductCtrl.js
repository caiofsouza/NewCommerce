app.controller('ProductCtrl', [ '$routeParams', function($routeParams){
	this.product_id = $routeParams.product_id;
	this.message = "Product page";
}]);