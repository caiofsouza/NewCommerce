app.controller('LoginCtrl', ['$location', 'Auth', '$http', '$window', function($location, Auth, $http, $window){
	
	console.log("token1: "+$window.sessionStorage.token);

	this.user_email = "";
	this.user_password = "";

	this.auth = new Auth();

	this.user_login = function(){
		this.auth.checkUser({username: this.user_email, password: this.user_password });


		this.messageError = "";
		
		if(this.user_email != "" && this.user_password != ""){

			this.email_error = this.pass_error = false;

		}else{
			if(this.user_email == ""){
				this.email_error = true;
				this.messageError = "Preencha o campo de email";
			}else{
				this.pass_error = true;
				this.messageError = "Preencha o campo de senha";
			}
		}

		// $location.path( "/product/123456" );
	};

}]);