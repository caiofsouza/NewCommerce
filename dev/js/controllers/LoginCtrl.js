app.controller('LoginCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth){
	
	$scope.user_email = "";
	$scope.user_password = "";

	$scope.auth = new Auth();

	$scope.user_login = function(){
		$scope.auth.checkUser({});

		$scope.messageError = "";
		
		if($scope.user_email != "" && $scope.user_password != ""){

			$scope.email_error = $scope.pass_error = false;

		}else{
			if($scope.user_email == ""){
				$scope.email_error = true;
				$scope.messageError = "Preencha o campo de email";
			}else{
				$scope.pass_error = true;
				$scope.messageError = "Preencha o campo de senha";
			}
		}

		$location.path( "/product/123456" );
	};

}]);