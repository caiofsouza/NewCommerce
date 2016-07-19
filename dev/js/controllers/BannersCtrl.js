app.controller('BannersCtrl', ['$cookies', '$location', '$http',
	function($cookies, $location, $http){
	var self = this;

	self.user = JSON.parse($cookies.get('api_auth')).user;
	self.progressPercentage = 0;

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');

	};


	
}]);