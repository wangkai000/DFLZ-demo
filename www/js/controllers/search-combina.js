/*
查询统计模块
组合查询页面
*/
angular.module('myApp.controllers')
    .controller('SearchCombinaCtrl', function($scope, $state, SearchCombinaService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');
        
        //datetime第三方插件
        jQuery.datetimepicker.setLocale('zh');

        jQuery('#eventCreateTimeFrom').datetimepicker({
            timepicker: false,
            // 设置时间显示格式
            format: 'Y-m-d',
        });
        jQuery('#eventCreateTimeTo').datetimepicker({
            timepicker: false,
            // 设置时间显示格式
            format: 'Y-m-d',
        });
        jQuery('#eventTimeFrom').datetimepicker({
            timepicker: false,
            // 设置时间显示格式
            format: 'Y-m-d',
        });
        jQuery('#eventTimeTo').datetimepicker({
            timepicker: false,
            // 设置时间显示格式
            format: 'Y-m-d',
        });


        //排序
        $scope.approvalArray4 = [ //标题
            '申报人',
            '部门',
            '类型',
            '人数',
            '申报时间',
            '宴请时间',
            '状态',
            '批示意见'
        ];
        $scope.approvalSwitch4 = false;
        $scope.approvalOrdery4 = ''; //orderBy排序绑定
        $scope.SortApproval4 = function(index) { //排序小三角反转
                $scope.itemsApproval4 = index;
                $scope.approvalSwitch4 = !$scope.approvalSwitch4;
                if (index == 0) {
                    $scope.approvalOrdery4 = 'staff'; //申报人
                } else if (index == 1) {
                    $scope.approvalSwitch4 = false; //部门
                } else if (index == 2) {
                    $scope.approvalOrdery4 = 'eventType'; //类型
                } else if (index == 3) {
                    $scope.approvalOrdery4 = 'peopleCount'; //人数
                } else if (index == 4) {
                    $scope.approvalOrdery4 = 'createTime'; //申报时间
                } else if (index == 5) {
                    $scope.approvalOrdery4 = 'eventDate'; //宴请时间
                } else if (index == 6) {
                    $scope.approvalOrdery4 = 'auditStatus'; //状态
                } else if (index == 7) {
                    $scope.approvalOrdery4 = 'auditContent'; //批示意见
                }
            }


        /*
        跳转至当前页面时
        默认不显示页码
        */    
        $scope.isHide = true     

        /*
        点击查询按钮
        获取所有用户信息params
        */
        $scope.searchPreciseParams = {
            token: userToken,               //用户令牌
            eventType: 0,                   //操办事项  0:全部  1：婚嫁 2：丧葬
            peopleCountMin: 0,              //邀请最少人数
            peopleCountMax: 0,              //邀请最多人数
            eventCreateTimeFrom: '',        //申报开始时间
            eventCreateTimeTo: '',          //申报截至时间
            eventTimeFrom: '',              //宴请开始时间
            eventTimeTo: '',                //宴请结束时间
            page: 1,                        //当前页数
            start: 0,                       //从第几个开始
            limit: 30                       //每页显示多少个
        }

        //申报类型选择事件
        $scope.eventTypBS = function() {
            $scope.searchPreciseParams.eventType = event.target.selectedIndex
        }

        //邀请人数选择事件
        $scope.peopleCountBS = function() {
            if (event.target.selectedIndex == 0) {
                $scope.searchPreciseParams.peopleCountMin = 0;
                $scope.searchPreciseParams.peopleCountMax = 0;
            } else {
                $scope.searchPreciseParams.peopleCountMin = (event.target.selectedIndex - 1) * 50;
                $scope.searchPreciseParams.peopleCountMax = event.target.selectedIndex * 50;
            }
        }

        /*
        查询按钮
        重新生成页码
        刷新页面用户信息
        */
        $scope.searchExamine = function() {
            //显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });


            $scope.searchPreciseData;           //本地存储数据
            $scope.page = [];                   //默认页码数组
            $scope.pageNumer = 1;               //默认页码
            $scope.limit = 30;                  //默认每页显示数量

            //获取申报开始时间
            $scope.searchPreciseParams.eventCreateTimeFrom = $('#eventCreateTimeFrom').val();
            //获取申报结束时间
            $scope.searchPreciseParams.eventCreateTimeTo=$('#eventCreateTimeTo').val();
            //获取宴请开始时间
            $scope.searchPreciseParams.eventTimeFrom=$('#eventTimeFrom').val();
            //获取宴请结束时间
            $scope.searchPreciseParams.eventTimeTo=$('#eventTimeTo').val();

            //调用接口刷新页面
            SearchCombinaService.eventPreciseSearch($scope.searchPreciseParams)
                .then(function(data) {
                    //隐藏loading夹在图
                    $.LoadingOverlay("hide")

                    //当接口成功时显示页码
                    if (data.data.success == true) {
                        $scope.isHide = false
                    }
                    
                    /*
                    获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.searchPreciseData = data.data.result.slice();
                    // 生产页码
                    var pageNumber = Math.ceil($scope.searchPreciseData.length / $scope.limit);
                    for (var i = 0; i < pageNumber; i++) {
                        $scope.page.push(i + 1)
                    }
                }, function(data) {
                    console.log('error')
                })
        }

        /*
        切换页码
        刷新当前用户信息列表
        */
        $scope.changePage = function() {
            $scope.pageNumer = this.$index + 1
        }

        /*
        上一页
        刷新当前用户信息列表
        */
        $scope.previousPage = function() {
            if ($scope.pageNumer != 1) {
                $scope.pageNumer--;
            }
        }

        /*
        下一页
        刷新当前用户信息列表
        */
        $scope.nextPage = function() {
            if ($scope.pageNumer != Math.ceil($scope.searchPreciseData.length / $scope.limit)) {
                $scope.pageNumer++;
            }
        }
    })
