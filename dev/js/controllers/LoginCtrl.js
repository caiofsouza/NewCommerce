app.controller('LoginCtrl', ['$location', 'Auth', '$http', function($location, Auth, $http){
	
	this.user_email = "";
	this.user_password = "";
	this.auth = new Auth();

	this.user_login = function(){
		this.messageError = "";
		
		if(this.user_email != "" && this.user_password != ""){
			this.email_error = this.pass_error = false;

			var user_obj = {
						username: this.user_email, 
						password: this.user_password 
					};


			this.auth.loginUser(user_obj, function(result){
				console.log("resultado: "+ result);

				if(result == true){
					// logged 
					$location.path( "/home" );
				}else{
					// user or pass wrong
					this.messageError = 'Usuário ou senha incorretos!';
				}
			});

		}else{
			if(this.user_email == ""){
				this.email_error = true;
				this.messageError = "Preencha o campo de email";
			}else{
				this.pass_error = true;
				this.messageError = "Preencha o campo de senha";
			}
		}

	};

}]);