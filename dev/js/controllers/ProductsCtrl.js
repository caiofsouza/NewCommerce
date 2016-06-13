app.controller('ProductsCtrl', ['$cookies','$http', '$location', 
	function($cookies, $http, $location){
	var self = this;

	self.user = JSON.parse($cookies.get('api_auth')).user;
	self.reorder = 'cards'; // initial order of products grid

	self.reorderInCards = function(){
		console.log("reorder cards");
		self.reorder = 'cards';
	};

	self.reorderInTable = function(){
		console.log("reorder table");
		self.reorder = 'table';
	};

	self.searchProduct = function(){
		if(self.search_input != "" && self.search_input != undefined){
			$http.get(API_HOST + 'search-products/'+ self.search_input).then(function(res){
				self.products = res.data;
				self.count = self.products.length;
			});
		}else{
			self.getAllProducts();
		}
	}

	self.getAllProducts = function(){
		$http.get(API_HOST + 'products').then(function(res){
			// console.log(res);
			self.products = res.data;
			self.count = self.products.length;
		});
	};

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};

	self.count = 0;
	self.getAllProducts();

}]);