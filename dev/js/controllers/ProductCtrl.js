app.controller('ProductCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
	$scope.product_id = $routeParams.product_id;
	$scope.message = "Product page";
}]);