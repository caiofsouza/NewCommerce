if(jQuery){

	function NewCommerce(API_HOST){
		this.API_HOST = API_HOST;

		this.getProducts = function(callback){
			this.getRequest('products', callback);
		};

		this.getCategories = function(callback){
			this.getRequest('categories', callback);
		};


		this.getRequest = function(type, callback){
			$.ajax({
				url: this.API_HOST + type,
				type: 'GET',
				dataType: 'json'
			})
			.done(function(data) {
				if(data.error){
					console.warn("You are trying to access an invalid address");
				}

				if(callback !== undefined){
					callback(data);
				}
			});
		}

	}

}else{
	console.log('jQuery required');
}