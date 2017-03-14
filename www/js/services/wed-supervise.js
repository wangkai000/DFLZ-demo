///////////////////////婚丧页面-现场监督///////////////////////
angular.module('myApp.services')
    .factory('SuperviseService', function ($http, $q) {
        return {
             //监督 查询
            eventShowSupervise: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.event.showSupervise,
                    params: params,
                    responseType: 'json',
                    timeout:GlobalConfig.requestTimeout
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            
            //监督 监督报告获取
            eventSuperviseReportGet:function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.eventSuperviseReport.getByEvent,
                    params: params,
                    responseType: 'json',
                    timeout:GlobalConfig.requestTimeout
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            //监督 监督报告提交
            eventSuperviseReport: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.eventSuperviseReport.add,
                    params: params,
                    responseType: 'json',
                    timeout:GlobalConfig.requestTimeout
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            //监督 违纪登记获取
            eventSupervisePrincipleBreakingGet: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.eventSupervisePrincipleBreaking.getByEvent,
                    params: params,
                    responseType: 'json',
                    timeout:GlobalConfig.requestTimeout
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            //监督 违纪登记提交
            eventSupervisePrincipleBreaking: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.eventSupervisePrincipleBreaking.add,
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