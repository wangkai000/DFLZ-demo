/*
申报管理模块
申报页面
*/
angular.module('myApp.controllers')
    .controller('WedDeclareCtrl', function($scope, $state, DeclareService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');

        // 与申报人关系下拉选择
        $scope.staffRelationship = function() {
            $scope.declareData.staffRelationship = event.target.selectedIndex + 1;
        }
        // 单位职务下拉选择
        $scope.staffJob = function() {
            $scope.declareData.staffJob = event.target.selectedIndex + 1;
        }
        //操办事项下拉选择
        $scope.eventType = function() {
            $scope.declareData.eventType = event.target.selectedIndex + 1;
        }
        //所属部门下拉选择
        $scope.staffOrgId = function() {
            $scope.declareData.staffOrgId = event.target.selectedIndex + 1;
        }

        //申报接口params
        $scope.declareData = {
            staff: '',                     //申报人
            staffRelationship: 1,          //与申报人关系
            staffPoliticalStatus: '',      //政治面貌
            staffJob: 1,                   //单位职务
            staffSpouse: '',               //配偶
            staffPhone: '',                //联系电话
            eventType: 1,                  //操办事项
            eventCount: 1,                 //操办次数
            eventDate: new Date(),         //操办时间
            location: '',                  //操办地点
            tableCount: 50,                //操办桌数
            peopleCount: 50,               //参加人数
            peopleRange: '',               //邀请范围
            carCount: 10,                  //用车数量
            carSource: '',                 //用车来源
            attachmentFileCode: '',        //上传文件码
            selfPromise: '',               //本人承诺
            promisePeople: '',             //承诺人
            staffOrgId: 1,                 //所属部门
            token: userToken               //用户令牌
        }

        /*
        点击提交按钮后
        当必填项不为空时
        调用申报接口
        并且充值页面数据
        */
        $scope.submit = function() {
            if (Boolean($scope.declareData.staff) ==true && Boolean($scope.declareData.staffPhone) == true && Boolean($scope.declareData.location) == true && Boolean($scope.declareData.carSource) == true) {
                DeclareService.eventAdd($scope.declareData)
                    .then(function(data) {
                            swal('申报成功');
                            //重置页面数据
                            $scope.declareData = {
                                staff: '',                  //申报人
                                staffRelationship: 1,       //与申报人关系
                                staffPoliticalStatus: '',   //政治面貌
                                staffJob: 1,                //单位职务
                                staffSpouse: '',            //配偶
                                staffPhone: '',             //联系电话
                                eventType: 1,               //操办事项
                                eventCount: 1,              //操办次数
                                eventDate: new Date(),      //操办时间
                                location: '',               //操办地点
                                tableCount: 50,             //操办桌数
                                peopleCount: 50,            //参加人数
                                peopleRange: '',            //邀请范围
                                carCount: 10,               //用车数量
                                carSource: '',              //用车来源
                                attachmentFileCode: '',     //上传文件码
                                selfPromise: '',            //本人承诺
                                promisePeople: '',          //承诺人
                                staffOrgId: 1,              //所属部门
                                token: userToken            //用户令牌
                            }
                            //将表单验证中的是否点击回复默认
                            $scope.form.$submitted=false;
                    },function(data) {
                        console.log('error')
                    })     
            }
        }

        /*
        datetime第三方插件
        用于获取操作日期
        并且赋值给申报接口params中的eventDate参数
        */
        jQuery.datetimepicker.setLocale('zh');

        jQuery('#datetimepicker').datetimepicker({
            timepicker: false,
            format: 'Y-m-d',
            value:new Date(),
            onSelectDate: function(ct, $i) {
                //将选择的时间赋给params中的参数
                $scope.declareData.eventDate = ct
            }
        });
    })
