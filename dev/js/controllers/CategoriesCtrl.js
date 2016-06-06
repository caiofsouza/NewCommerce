app.controller("CategoriesCtrl", ['$cookies', '$location', '$http',
	function($cookies, $location, $http){
	var self = this;

	// user var to load header infos
	self.user = JSON.parse($cookies.get('api_auth')).user;

	self.allCategories = [];
	


	self.getAllCategories = function(){
		self.inLoading = true;
		$http.get(API_HOST + 'categories').then(function(res){
			// return res.data;
			self.allCategories = res.data;
			self.inLoading = false;
		});
	};

	self.getAllCategories();

	self.saveCategory = function(){
		self.inLoading = true;
		$http.post(API_HOST + 'category', self.category).then(function(res){
			if(res.result){
				self.message = "Categoria adicionada com sucesso!";
				self.inLoading = false;
			}
		});
	};

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};

}]);