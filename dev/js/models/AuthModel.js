app.factory('Auth', ['$http', '$location', '$cookies',
    function($http, $location, $cookies) {  

    function Auth(){
        this.token = '';

    };

    Auth.prototype = {
        loginUser: function(user_obj, fncallback) {
            var response;

            $http({
                method: 'POST',
                url: API_HOST+'login/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data:{
                    email: user_obj.email,
                    password: user_obj.password
                }
            }).then(function successCallback(response) {
                console.log(response.data);
                // save token in session
                $cookies.put('api_auth', JSON.stringify(response.data));
                
                app.run(['$http', function ($http) {
                    $http.defaults.headers.common['x-access-token'] = response.data.token;
                }]);

                if(fncallback != undefined){
                    fncallback(true);
                }

            }, function errorCallback(response) {

                if(fncallback != undefined){
                    fncallback(false);
                }
            });

        }
    };

    return Auth;
}]);