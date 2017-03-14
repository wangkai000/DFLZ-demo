///////////////////////登录//////////////////////////
angular.module('myApp.services')
    .factory('LoginServe', function ($http, $q) {
        
        return {
            // 登录
            userAuth: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.user.auth,
                    params: params,
                    responseType: 'json',
                    timeout:GlobalConfig.requestTimeout
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    })