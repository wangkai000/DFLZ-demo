///////////////////////责任追究-纪律处分///////////////////////
angular.module('myApp.services')
    .factory('DisciplineService', function ($http, $q) {
        return {
            //责任追究 纪律处分 获取列表
            disciplinePunishDisciplineShow: function (params) {
              var deferred = $q.defer();
              $http({
                method: 'GET',
                url: GlobalConfig.url.api.wdm.disciplinePunish.show,
                params: params,
                responseType: 'json',
              }).then(function (data) {
                deferred.resolve(data);
              }, function (error) {
                deferred.reject(error);
              });
              return deferred.promise;
            },

            // 责任追究 纪律处分 新增处分
            disciplinePunishAdd: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.wdm.disciplinePunish.add,
                    params: params,
                    responseType: 'json',
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            //责任追究 纪律处分 删除处分
            disciplinePunishRemove: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.wdm.disciplinePunish.remove,
                    params: params,
                    responseType: 'json',
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            // 责任追究 纪律处分 获取列表详情
            disciplinePunishGetById: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.wdm.disciplinePunish.getById,
                    params: params,
                    responseType: 'json',
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            // 责任追究 纪律处分 修改通报
            disciplinePunishUpdate: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.wdm.disciplinePunish.update,
                    params: params,
                    responseType: 'json',
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    })