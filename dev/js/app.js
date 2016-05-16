var app = angular.module('NewCommerce', []);

app.controller('MenuCtrl', ['$scope', function($scope){
	$scope.hello = "menu ctrl";
}]);

app.controller('SidebarCtrl', ['$scope', function($scope){
	$scope.hello = 'sidebar ctrl';
}]);

app.controller('DashboardCtrl', ['$scope', function($scope){
	$scope.hello = 'dash ctrl';
}]);
