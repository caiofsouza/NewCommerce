app.controller('ProductCtrl', [ '$routeParams', function($routeParams){
	var self = this;
	
	self.user = JSON.parse($cookies.get('api_auth')).user;
	
	self.product_id = $routeParams.product_id;
	self.message = "Product page";

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};
	
}]);