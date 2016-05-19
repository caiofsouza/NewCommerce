app.factory('Auth', ['$http', '$window', function($http, $window) {  

    function Auth(){
        this.token = '';

    };

    Auth.prototype = {
        checkUser: function(user_obj) {
            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/login/',
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
                $window.sessionStorage.token = response.data.token;

            }, function errorCallback(response) {
                console.log("Error:", response);
            });
        }
    };

    return Auth;
}]);