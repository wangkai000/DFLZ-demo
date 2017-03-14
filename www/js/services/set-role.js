///////////////////////系统设置 角色管理///////////////////////
angular.module('myApp.services')
    .factory('SetRoleService', function ($http, $q) {
        return {
            // 获取角色
            roleShow: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.role.show,
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

            // 删除角色
            roleRemove: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.role.remove,
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

            // 新添角色
            addRole: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.role.add,
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

            //获取单个角色信息
            roleGetById: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.role.getById,
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

            //修改角色信息
            roleUpdate: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.role.update,
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