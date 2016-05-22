app.controller('HomeCtrl', ['$cookies', function($cookies){


	this.user = JSON.parse($cookies.get('api_auth')).user;
	
}]);