app.controller("CategoriesCtrl", ['$scope', '$cookies', '$location', '$http',
	function($scope, $cookies, $location, $http){
	var self = this;

	// user var to load header infos
	self.user = JSON.parse($cookies.get('api_auth')).user;

	self.allCategories = [];
	self.onEdition = "";
	self.category = {
		name: "",
		sub_cats: []
	};
	self.messageAdd = "";


	self.getAllCategories = function(){
		self.inLoading = true;
		$http.get(API_HOST + 'categories').then(function(res){
			// return res.data;
			self.allCategories = res.data.sort(function(a, b){
				if (a.name.toLowerCase() > b.name.toLowerCase()) {
				    return 1;
			    }
			  	if (a.name.toLowerCase() < b.name.toLowerCase()) {
			    	return -1;
			  	}
				// a must be equal to b
		  		return 0;
			});

			self.inLoading = false;
		});
	};

	self.getAllCategories();

	self.saveCategory = function(){
		self.messageAdd = "";

		if(self.category.name != ""){

			self.inLoading = true;

			$http.post(API_HOST + 'category', self.category).then(function(res){

				if(res.data.result){

					self.category = {
						name: "",
						sub_cats: []
					};

					self.allCategories.push(res.data.result);

					self.allCategories = self.allCategories.sort(function(a, b){
						if (a.name.toLowerCase() > b.name.toLowerCase()) {
						    return 1;
					    }
					  	if (a.name.toLowerCase() < b.name.toLowerCase()) {
					    	return -1;
					  	}
						// a must be equal to b
				  		return 0;
					});


					self.messageAdd = "Categoria adicionada com sucesso!";
					self.inLoading = false;
				}
			});

		}else{
			self.messageAdd = "Preencha o campo de nome!";
		}
	};

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};

	self.edit = function(cat_id){

		var hideAll = self.allCategories.filter(function(el){
			return el.visible === true;
		});

		if(hideAll.length > 0){
			hideAll[0].visible = false;
		}

		var selectedCategory = self.allCategories.filter(function(el){
			return el._id === cat_id;
		});



		if(hideAll.length > 0 && hideAll[0]._id == cat_id){
			// btn salvar clicked
			
			if(selectedCategory[0].name != ""){
				$http.put( API_HOST + 'category/' + cat_id, selectedCategory[0]).then(function(res){
					selectedCategory[0].btnStatus = "Editar";
					selectedCategory[0].visible = false;
				});
			}

		}else{
			// btn editar clicked
			selectedCategory[0].btnStatus = "Salvar";
			selectedCategory[0].visible = true;
		}
		
	};

}]);