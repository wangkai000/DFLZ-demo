///////////////////////查询统计-组合查询///////////////////////
angular.module('myApp.services')
    .factory('SearchCombinaService', function ($http, $q) {
        return {
            //查询统计 组合查询
            eventPreciseSearch: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.event.search,
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