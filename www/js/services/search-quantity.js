///////////////////////查询统计-数量统计///////////////////////
angular.module('myApp.services')
    .factory('SearchQuantityService', function ($http, $q) {
        return {
             //查询统计 数量统计
            getOrgEvenTypeCount: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.event.getOrgEvenTypeCount,
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