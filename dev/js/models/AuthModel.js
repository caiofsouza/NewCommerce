app.factory('Auth', ['$http', '$location', '$cookies',
    function($http, $location, $cookies) {  

    function Auth(){
        this.token = '';

    };

    Auth.prototype = {
        loginUser: function(user_obj, callback) {
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
                    username: user_obj.username,
                    password: user_obj.password
                }
            }).then(function successCallback(response) {
                // save token in session
                $cookies = response.data;
                app.run(['$http', function ($http) {
                    $http.defaults.headers.common['x-access-token'] = response.data.token;
                }]);

                return true;

            }, function errorCallback(response) {

                return false;
            });

        }
    };

    return Auth;
}]);