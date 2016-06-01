app.controller('ProductCtrl', [ '$routeParams', '$cookies',  
	function($routeParams, $cookies){
	var self = this; 
	

	if($routeParams.product_id){
		self.product_id = $routeParams.product_id;
	}else{

	}



	self.user = JSON.parse($cookies.get('api_auth')).user;
	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};
	
}]);