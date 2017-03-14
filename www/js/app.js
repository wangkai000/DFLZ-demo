/**
 * Created by Administrator on 2017/1/10.
 */
angular.module("myApp", ['myApp.controllers', 'myApp.services', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //登录页面
            .state('login', {
            url: '/login',
            controller: 'LoginCtrl',
            templateUrl: 'templates/login.html',
        })

        //进入主页面
        .state('main', {
            url: '/main',
            controller: 'MainCtrl',
            templateUrl: 'templates/main.html',
            params: {
                data: {},
                event: {}
            }
        })

            //婚丧页面-申报
            .state('main.declare', {
                url: '/declare',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/wed-declare.html',
                        controller: 'WedDeclareCtrl'
                    }
                },
                params: {
                    data: {},
                    event: {}
                }
            })

            //婚丧页面-审批
            .state('main.examine', {
                url: '/examine',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/wed-examine.html',
                        controller: 'WedExamineCtrl'
                    }
                }
            })

            //婚丧页面-公示
            .state('main.publicity', {
                url: '/publicity',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/wed-publicity.html',
                        controller: 'WedPublicityCtrl'
                    }
                }
            })

            //婚丧页面-现场监督
            .state('main.supervise', {
                url: '/supervise',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/wed-supervise.html',
                        controller: 'WedSuperviseCtrl'
                    }
                }
            })

            //婚丧页面——查询统计——精确查询
            .state('main.searchPrecise', {
                url: '/search-precise',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/search-precise.html',
                        controller: 'SearchPreciseCtrl'
                    }
                }
            })

            //婚丧页面——查询统计——组合查询
            .state('main.searchCombina', {
                url: '/search-combina',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/search-combina.html',
                        controller: 'SearchCombinaCtrl'
                    }
                }
            })

            //婚丧页面——查询统计——数量统计
            .state('main.searchQuantity', {
                url: '/search-quantity',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/search-quantity.html',
                        controller: 'SearchQuantityCtrl'
                    }
                }
            })

            //责任追究——公开通报
            .state('main.notification', {
                url: '/notification',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/public-notification.html',
                        controller: 'disciplinePunishShow'
                    }
                }
            })


            //责任追究——纪律处分
            .state('main.punishment', {
                url: '/punishment',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/public-discipline.html',
                        controller: 'disciplinePunishDisciplineShow'
                    }
                }
            })


            //系统设置——用户管理
            .state('main.user', {
                url: '/user',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/set-user.html',
                        controller: 'SetUserCtrl'
                    }
                }
            })

            //系统设置——角色管理
            .state('main.role', {
                url: '/role',
                views: {
                    'main-detail': {
                        templateUrl: 'templates/set-role.html',
                        controller: 'SetRoleCtrl'
                    }
                }
            })

        $urlRouterProvider.otherwise('/login');
    });
