/**
 * Created by Administrator on 2017/1/10.
 */
angular.module('myApp.services', []);
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
///////////////////////查询统计-精确查询///////////////////////
angular.module('myApp.services')
    .factory('SearchPreciseService', function ($http, $q) {
        return {
            //查询统计 精确查询
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
//系统设置--用户管理
angular.module('myApp.services')
    .factory('SetUserService', function ($http, $q) {
        return {
            //获取用户列表
            userShow: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.user.show,
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

            //获取所有用户信息
            roleGetAll: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.role.getAll,
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

            //获取当前用户信息
            userGetById: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.user.getById,
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

            //修改用户信息
            updateUser: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.user.update,
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

            //删除用户
            removeUser: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.user.remove,
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

            //添加新用户
            addUser: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.user.add,
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
///////////////////////婚丧页面-审批///////////////////////
angular.module('myApp.services')
    .factory('ExamineService', function ($http, $q) {
        return {
            // 审批 查询
            eventShowAudit: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.event.showAudit,
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

            //审批 点击通过或者拒绝获取意见信息
            eventAuditGetByEvent: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.eventAudit.getByEvent,
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


            //审批 通过 拒绝
            eventAudit: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.event.audit,
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
//婚丧页面-公示
angular.module('myApp.services')
    .factory('PublicityService', function ($http, $q) {
        return {
            //公式 查询
            eventShowBulletin: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.event.showBulletin,
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

            //公示 公示内容提交 获取
            eventBulletinGet: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: GlobalConfig.url.api.eventBulletin.getByEvent,
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

            // 公示 公示内容提交
            eventBulletinAdd: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.eventBulletin.add,
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

            //公示 公示结果获取
            eventBulletinResultGet: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.eventBulletinResult.getByEvent,
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

            //公示 公示结果提交
            eventBulletinResultAdd: function (params) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: GlobalConfig.url.api.eventBulletinResult.add,
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
        }
    })
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