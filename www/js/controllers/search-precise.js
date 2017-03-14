/*
查询统计模块
精确查询页面
*/
angular.module('myApp.controllers')
    .controller('SearchPreciseCtrl', function($scope, $state, SearchPreciseService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');
        
        //排序
        $scope.approvalArray3 = [ //标题
            '申报人',
            '部门',
            '类型',
            '人数',
            '申报时间',
            '宴请时间',
            '状态',
            '批示意见'
        ];
        $scope.approvalSwitch3 = false;
        $scope.approvalOrdery3 = ''; //orderBy排序绑定
        $scope.SortApproval3 = function(index) { //排序小三角反转
                $scope.itemsApproval3 = index;
                $scope.approvalSwitch3 = !$scope.approvalSwitch3;
                if (index == 0) {
                    $scope.approvalOrdery3 = 'staff'; //申报人
                } else if (index == 1) {
                    $scope.approvalSwitch3 = false; //部门
                } else if (index == 2) {
                    $scope.approvalOrdery3 = 'eventType'; //类型
                } else if (index == 3) {
                    $scope.approvalOrdery3 = 'peopleCount'; //人数
                } else if (index == 4) {
                    $scope.approvalOrdery3 = 'createTime'; //申报时间
                } else if (index == 5) {
                    $scope.approvalOrdery3 = 'eventDate'; //宴请时间
                } else if (index == 6) {
                    $scope.approvalOrdery3 = 'auditStatus'; //状态
                } else if (index == 7) {
                    $scope.approvalOrdery3 = 'auditContent'; //批示意见
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
            token: userToken,                   //用户令牌
            staff:'',                           //申报人
            staffOrgId: 1,                      //申报人部门id
            page: 1,                            //当前页数
            start: 0,                           //从第几个开始
            limit: 20                           //每页显示多少个
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

            $scope.searchPreciseData;               //本地存储数据
            $scope.page = [];                       //默认页码数组
            $scope.pageNumer = 1;                   //默认页码
            $scope.limit = 30;                      //默认每页显示数量

            //调用接口刷新页面
            SearchPreciseService.eventPreciseSearch($scope.searchPreciseParams)
                .then(function(data) {
                    // 隐藏loading加载图
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
                    //生成页码
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
            $scope.pageNumer = this.$index + 1;
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
    