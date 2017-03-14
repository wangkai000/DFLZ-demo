///////////////////////婚丧页面-申报///////////////////////
angular.module('myApp.services')
    .factory('DeclareService', function ($http, $q) {
        return {
            
            // 申报管理
            eventAdd: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.event.add,
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