///////////////////////责任追究-公开通报///////////////////////
angular.module('myApp.services')
    .factory('NotificationService', function ($http, $q) {
        return {
            // 责任追究  公开通报 列表获取
            disciplinePunishShow: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    //url: GlobalConfig.url.api.wdm.disciplinePunish.show,
                     url:  GlobalConfig.url.api.wdm.publicNotification.show,
                    params: params,
                    responseType: 'json',
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            // 责任追究 公开通报 新增通报
            publicNotificationAdd: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.wdm.publicNotification.add,
                    params: params,
                    responseType: 'json',
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            //责任追究 公开通报 删除通报
            publicNotificationRemove: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.wdm.publicNotification.remove,
                    params: params,
                    responseType: 'json',
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            // 申报情况最终结果查询
            publicNotificationGetById: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.wdm.publicNotification.getById,
                    params: params,
                    responseType: 'json',
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            //责任追究 公开通报 修改通报
            publicNotificationUpdate: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.wdm.publicNotification.update,
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