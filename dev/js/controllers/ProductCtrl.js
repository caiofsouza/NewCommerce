app.controller('ProductCtrl', ['$location','$routeParams', '$cookies', '$http', 'Upload', 
	function($location, $routeParams, $cookies, $http, Upload){
	var self = this; 
	
	// user var to load header infos
	self.user = JSON.parse($cookies.get('api_auth')).user;
	self.messageError = "";

	self.product = {
		available_marketplace: false,
		active: false,
		tags: []
	};

	self.inLoading = false;

	self.allTags = [];
	self.selectedCategories = [];
	self.allCategories = [];

	self.getAllTags = function(){
		self.inLoading = true;
		$http.get(API_HOST + 'tags').then(function(res){
			// return res.data;
			self.allTags = res.data;
			self.inLoading = false;
		});
	};

	self.getAllTags();

	self.getAllCategories = function(){
		self.inLoading = true;
		$http.get(API_HOST + 'categories').then(function(res){
			// return res.data;
			self.allCategories = res.data;
			self.inLoading = false;
		});
	};

	self.getAllCategories();
	


	// need to study a way to use the same url to get by id and by url
	// self.getProductByUrl = function(productUrl){
	// 	$http.get(API_HOST + 'product/'+productUrl).then(function(res){
	// 		// return res.data;
	// 		self.product = res.data;
	// 		self.product.url = self.newUrl(self.product.name);
	// 	});
	// };

	self.getProductById = function(product_id){
		self.inLoading = true;
		$http.get(API_HOST + 'product/'+product_id).then(function(res){
			// return res.data;
			self.product = res.data;
			
			console.log(self.product.categories);

			self.selectedCategories = self.product.categories;
			self.inLoading = false;
		});
	};


	if($routeParams.product_id){
		var i = 0;
		self.getProductById($routeParams.product_id);
	}


	self.save = function(){

		self.validForm(function(hasError){

			if(!hasError){
				self.inLoading = true;
				// if dont have any error
				console.log(self.product);
				$http.post(API_HOST + 'product/', self.product).then(function(res){
					if(res.data.result){
						self.messageError = "Produto adicionado com sucesso!";
						self.product = {
							available_marketplace: false,
							active: false,
							tags: []
						};
					}
					self.inLoading = false;
				});
			}
		});
		
	};

	self.update = function(){

		self.validForm(function(hasError){

			if(!hasError){
				// if dont have any error
				self.inLoading = true;
				
				$http.put(API_HOST + 'product/'+self.product._id, self.product ).then(function(res){
					self.uploadProductImg( self.product._id );

					if(res.data.message){
						self.messageError = "Produto alterado com sucesso!";
						self.product = res.data.result;
					}
					self.inLoading = false;
				});
			}
		});
		
	};

	self.validForm = function(fnCallback){
		var hasError = false;
		self.messageError  = "";
		self.product_name_error = 
		self.product_code_error = 
		self.product_price_error = 
		self.product_stock_error = 
		self.product_description_error = false;

		// check each input field
		if(self.product.name == "" || self.product.name == undefined){
			self.product_name_error = true;
			self.messageError = "Preencha o campo de nome";
			hasError = true;

		}else if(self.product.code == "" || self.product.code == undefined){
			self.product_code_error = true;
			self.messageError = "Preencha o campo de código";
			hasError = true;

		}else if(self.product.price == "" || self.product.price == undefined){
			self.product_price_error = true;
			self.messageError = "Preencha o campo de preço";
			hasError = true;

		}else if(self.product.stock == "" || self.product.stock == undefined){
			self.product_stock_error = true;
			self.messageError = "Preencha o campo de estoque";
			hasError = true;

		}else if(self.product.description == "" || self.product.description == undefined){
			self.product_description_error = true;
			self.messageError = "Preencha o campo de descrição";
			hasError = true;
		}

		if(fnCallback != undefined){
			fnCallback(hasError);
		}
	};

	self.newUrl = function(name){
		var new_url = name.toLowerCase();
		new_url = new_url.replace(/[^\w\s]/gi,"").replace(/\s/g, "-");
		return new_url;
	};

	self.updateUrl = function(value){
		self.product.url = self.newUrl(value);
	};

	self.validateUrl = function(){
		var notAllowSpecialChars = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_/g;
		self.product.url = self.product.url.replace(/\s/g, '-').replace(notAllowSpecialChars, '').toLowerCase();
	};

	self.tagsToLower = function(){
		if(self.product.tags.length <= 0 ){
			self.product.tags = [];
		}else{
			var tags = [];
			var notAllowSpecialChars = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\s/g;
			self.product.tags.forEach(function(el, ind){
				tags.push(el.replace(notAllowSpecialChars, '').toLowerCase())
			});
			self.product.tags = tags;
		}
	};

	self.uploadProductImg = function() {

  		if (self.product.files) {
  			var files = self.product.files;
  			console.log(files, self.product);
  			for (var i = 0; i < files.length; i++) {
		        Upload.upload({
		            url: API_HOST + 'product-upload/',
		            data: { file_uploaded: files[i], 'product_id': self.product._id }
		        }).then(function (res) {
		        	console.log(res);
		            console.log('Success ' + res.config.data.file_uploaded.name + 'uploaded. Response: ' + res.data);
		        }, function (res) {
		            console.log('Error status: ' + res.status);
		        }, function (evt) {
		        	console.log(evt);
		            self.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            console.log('progress: ' + self.progressPercentage + '% ' + evt.config.data.file_uploaded.name);
		        });
	        }
      	}

    };

	self.logout = function(){
		$cookies.remove('api_auth');
		$location.path('/login');
	};

	
}]);