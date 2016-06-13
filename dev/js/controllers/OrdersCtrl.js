app.controller("OrdersCtrl", ['$scope', '$cookies', '$location', '$http', 
	function($scope, $cookies, $location, $http){
	var self = this;
	self.allOrders = [];
	
	// user var to load header infos
	self.user = JSON.parse($cookies.get('api_auth')).user;

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};

	self.getAllOrders = function(){
		$http.get(API_HOST + 'orders').then(function(res){
			if(res.data){
				res.data[2].status = 0;
				var arr_orders = [];
				for (var i = 0; i < 15; i++) {
					res.data.forEach(function(el, ind){
						arr_orders.push(el);	
					});
				}

				self.allOrders = arr_orders;

			}
		});
	};

	self.getAllOrders();


}]);





