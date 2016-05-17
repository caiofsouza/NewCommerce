app.factory('Auth', ['$http', function($http) {  
    function Auth(){
        this.id = '12345';
    };

    Auth.prototype = {
        checkUser: function(user_obj) {
            $http({
                method: "GET",
                data: { 
                    'email' : user_obj.email, 
                    'password': user_obj.pass 
                },
                url: 'http://localhost:3000/'
            }).success(function(data){
                console.log(data);
                app.constant('AuthTOKEN', data.token);
            }).error(function(data){
                console.log(data);
            });
        }
    };

    return Auth;
}]);