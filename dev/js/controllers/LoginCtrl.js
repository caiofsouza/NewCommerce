app.controller('LoginCtrl', ['$location', 'Auth', '$http',
	function($location, Auth, $http){
	var self = this;

	self.user_email = "";
	self.user_password = "";
	self.auth = new Auth();

	self.user_login = function(){
		self.messageError = "";
		
		if(self.user_email != "" && self.user_password != ""){
			self.email_error = self.pass_error = false;


			var user_obj = {
				username: self.user_email, 
				password: self.user_password 
			};


			self.auth.loginUser(user_obj, function(result){
				if(result == true){
				  	$location.path("/home").replace(); 
				}else{
					self.messageError = "Usuário ou senha incorretos!";
				}
			});	

		}else{
			if(self.user_email == ""){
				self.email_error = true;
				self.messageError = "Preencha o campo de email";
			}else{
				self.pass_error = true;
				self.messageError = "Preencha o campo de senha";
			}
		}

	};

}]);