/*
申报管理模块
现场监督页面
*/
angular.module('myApp.controllers')
    .controller('WedSuperviseCtrl', function($scope, $state, SuperviseService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');

        //跳转至当前页面时显示loading加载图
        $.LoadingOverlay("show", {
            image: "img/spinning-circles.svg",
            bgcolor: 'rgba(28,43,54,0.7)'
        });

        //排序
        $scope.approvalArray2 = [ //标题
            '申报人',
            '部门',
            '类型',
            '人数',
            '申报时间',
            '宴请时间',
            '状态',
            '操作'
        ];
        $scope.approvalSwitch2 = false;
        $scope.approvalOrdery2 = ''; //orderBy排序绑定
        $scope.SortApproval2 = function(index) { //排序小三角反转
                $scope.itemsApproval2 = index;
                $scope.approvalSwitch2 = !$scope.approvalSwitch2;
                if (index == 0) {
                    $scope.approvalOrdery2 = 'staff'; //申报人
                } else if (index == 1) {
                    $scope.approvalSwitch2 = false; //部门
                } else if (index == 2) {
                    $scope.approvalOrdery2 = 'eventType'; //类型
                } else if (index == 3) {
                    $scope.approvalOrdery2 = 'peopleCount'; //人数
                } else if (index == 4) {
                    $scope.approvalOrdery2 = 'createTime'; //申报时间
                } else if (index == 5) {
                    $scope.approvalOrdery2 = 'eventDate'; //宴请时间
                } else if (index == 6) {
                    $scope.approvalOrdery2 = 'auditStatus'; //状态
                } else if (index == 7) {
                    $scope.approvalSwitch2 = false; //操作
                }
            }



        //获取所有用户信息列表接口params
        $scope.superviseParams = {
            token: userToken,           //用户令牌
            staff: '',                  //申报人
            superviseStatus: -1,        //监督状态 -1：未监督 1：已监督
            page: 1,                    //当前页数
            start: 0,                   //从第几个开始
            limit: '30'                 //每页显示多少个
        }
 
        /*
        跳转至当前页面时
        默认调用用户信息列表接口
        获取接口用户数据
        生成页码
        取消loading加载图
        */
        SuperviseService.eventShowSupervise($scope.superviseParams)
            .then(function(data) {
                //取消loading加载图
                $.LoadingOverlay("hide")
                /*
                将获取的用户数据赋值变量
                在页面显示
                */
                $scope.superviseSearchData = data.data.result;
                //生成页码
                var pageNumber = Math.ceil(data.data.total / $scope.superviseParams.limit);
                $scope.page = new Array;
                for (var i = 0; i < pageNumber; i++) {
                    $scope.page.push(i + 1)
                }
            },function(data) {
                console.log('error')
            })
            

        /*
        公示状态列表选择
        公示状态 -1：未监督 1：已监督
        */
        $scope.choseAuditStatus = function() {
            if (event.target.selectedIndex == 0) {
                $scope.superviseParams.superviseStatus = event.target.selectedIndex - 1
            } else {
                $scope.superviseParams.superviseStatus = event.target.selectedIndex
            }
        }

        /*
        切换页码
        刷新当前用户信息列表
        获取接口用户数据
        生成页码
        */
        $scope.changePage = function() {
            //显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });
            /*
            点击页码
            页码参数传递给用户信息列表接口
            */
            $scope.superviseParams.page = this.value;
            $scope.superviseParams.start = (this.value - 1) * 30;
            //调用接口刷新页面
            SuperviseService.eventShowSupervise($scope.superviseParams)
                .then(function(data) {
                    /*
                    获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.superviseSearchData = data.data.result;
                    //loading加载图
                    $.LoadingOverlay("hide");
                },function(data) {
                    console.log('error')
                })
                
        }

        /*
        上一页按钮
        重新生成页码
        刷新页面用户信息
        */
        $scope.previousPage = function() {
            if ($scope.superviseParams.page != 1) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                });

                $scope.superviseParams.page--;
                $scope.superviseParams.start = $scope.superviseParams.start - 30;
                //调用接口刷新页面
                SuperviseService.eventShowSupervise($scope.superviseParams)
                    .then(function(data) {
                        /*
                        获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.superviseSearchData = data.data.result;
                        //loading加载图
                        $.LoadingOverlay("hide");
                    },function(data) {
                        console.log('error')
                    })
                  
            }
        }

        /*
        下一页按钮
        重新生成页码
        刷新页面用户信息
        */
        $scope.nextPage = function() {
            if ($scope.superviseParams.page != $scope.page.length) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                });

                $scope.superviseParams.page++;
                $scope.superviseParams.start = $scope.superviseParams.start + 30;
                //调用接口刷新页面
                SuperviseService.eventShowSupervise($scope.superviseParams)
                    .then(function(data) {
                        /*
                        获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.superviseSearchData = data.data.result;
                        //取消loading加载图
                        $.LoadingOverlay("hide");
                    },function(data) {
                        console.log('error')
                    })   
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

            //调用接口刷新页面
            SuperviseService.eventShowSupervise($scope.superviseParams)
                .then(function(data) {
                    /*
                    获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.superviseSearchData = data.data.result;
                    //生成页码
                    var pageNumber = Math.ceil(data.data.total / $scope.superviseParams.limit);
                    $scope.page = new Array;
                    for (var i = 0; i < pageNumber; i++) {
                        $scope.page.push(i + 1)
                    }
                    //取消loading加载图
                    $.LoadingOverlay("hide");
                },function(data) {
                    console.log('error')
                })   
        }


        /*
        点击监督报告按钮时
        获取当前用户信息的params
        */
        $scope.superviesReportParamsGet = {
            token: userToken,
            eventId: ''
        }

        /*
        点击提交按钮时
        提交公示内容中用户信息的params
        */
        $scope.superviesReportParams = {
            token: userToken,
            eventId: '', //id
            title: '', //标题
            content: '' //内容
        }

        /*
        监督报告按钮
        获取当前用户信息
        */
        $scope.superviesReport = function() {
            //监督报告提交接口参数获取
            $scope.superviesReportParams.eventId = this.value.id;
            $scope.superviesReportParamsGet.eventId = this.value.id;
            //获取当前用户监督报告接口调用
            SuperviseService.eventSuperviseReportGet($scope.superviesReportParamsGet)
                .then(function(data) {
                    if (data.data.result == null) {
                        $scope.superviesReportParams.title = '';
                        $scope.superviesReportParams.content = '';
                    } else {
                        $scope.superviesReportParams.title = data.data.result.title;
                        $scope.superviesReportParams.content = data.data.result.content;
                    }
                },function(data) {
                    console.log('error')
                })
        }

        /*
        监督报告确定按钮
        提交修改信息
        */
        $scope.reportConfirm = function() {
            //显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });

            //监督报告提交接口调用
            SuperviseService.eventSuperviseReport($scope.superviesReportParams)
                .then(function(data) {
                    //调用接口刷新页面
                    SuperviseService.eventShowSupervise($scope.superviseParams)
                        .then(function(data) {
                            /*
                            将获取的用户数据赋值变量
                            在页面显示
                            */
                            $scope.superviseSearchData = data.data.result;
                            //生成页码
                            var pageNumber = Math.ceil(data.data.total / $scope.superviseParams.limit);
                            $scope.page = new Array;
                            for (var i = 0; i < pageNumber; i++) {
                                $scope.page.push(i + 1)
                            }

                            //取消loading加载图
                            $.LoadingOverlay("hide");

                            swal("操作完成");
                        },function(data) {
                            console.log('error')
                        })
                        
                },function(data) {
                    console.log('error')
                })
        }

        
        /*
        点击违纪登记按钮时
        获取当前用户信息的params
        */
        $scope.principleBreakingGetParams = {
            token: userToken,                   
            eventId: ''
        }

        /*
        点击提交按钮时
        提交违纪登记中用户信息的params
        */
        $scope.principleBreakingParams = {
            token: userToken,                   //用户令牌
            eventId: '',                        //id
            isCashGiftOutOfLimits: 0,           //礼金超标
            isUsePublicCar: 0,                  //使用公车
            isUsePublicGoods: 0,                //使用公物
            isUsePublicAsserts: 0,              //使用公产
            isUsePublicMoney: 0,                //使用公款
            attachmentFileCode: '',             //上传文件code码
            otherQuestion: '',                  //其他问题
            content: ''                         //内容
        }

        /*
        违纪登记按钮
        获取当前用户信息
        */
        $scope.principleBreaking = function() {
            //违纪登记提交接口参数获取
            $scope.principleBreakingGetParams.eventId = this.value.id;
            $scope.principleBreakingParams.eventId = this.value.id;
            //获取当前当前用户违纪登记接口调用
            SuperviseService.eventSupervisePrincipleBreakingGet($scope.principleBreakingGetParams)
                .then(function(data) {
                    if (data.data.result == null) {
                        $scope.principleBreakingParams.content = '';            //内容
                        $scope.principleBreakingParams.otherQuestion = '';      //其他问题
                        $scope.principleBreakingParams.attachmentFileCode = ''; //上传文件code码
                        $scope.isCashGiftOutOfLimitsCode = false;               //礼金超标
                        $scope.isUsePublicCarCode = false;                      //使用公车
                        $scope.isUsePublicAssetsCode = false;                   //使用公产
                        $scope.isUsePublicGoodsCode = false;                    //使用公物
                        $scope.isUsePublicMoneyCode = false;                    //使用公款
                    } else {
                        $scope.principleBreakingParams.content = data.data.result.content;                      //内容
                        $scope.principleBreakingParams.otherQuestion = data.data.result.otherQuestion;          //其他问题
                        $scope.principleBreakingParams.attachmentFileCode = data.data.result.attachmentPath;    //上传文件code码
                        $scope.isCashGiftOutOfLimitsCode = data.data.result.isCashGiftOutOfLimits;              //礼金超标
                        $scope.isUsePublicCarCode = data.data.result.isUsePublicCar;                            //使用公车
                        $scope.isUsePublicAssetsCode = data.data.result.isUsePublicAssets;                      //使用公产
                        $scope.isUsePublicGoodsCode = data.data.result.isUsePublicGoods;                        //使用公物
                        $scope.isUsePublicMoneyCode = data.data.result.isUsePublicMoney;                        //使用公款
                    }
                },function(data) {
                    console.log('error')
                })      
        }

            //礼金超标checkbox选择
        $scope.isCashGiftOutOfLimitsForTrue = function() {
                $scope.principleBreakingParams.isCashGiftOutOfLimits = 1;
                $scope.isCashGiftOutOfLimitsCode = true;
            }
            //礼金未超标checkbox选择
        $scope.isCashGiftOutOfLimitsForFalse = function() {
                $scope.principleBreakingParams.isCashGiftOutOfLimits = 0;
                $scope.isCashGiftOutOfLimitsCode = false;
            }
            //使用公车checkbox选择
        $scope.isUsePublicCarForTrue = function() {
                $scope.principleBreakingParams.isUsePublicCar = 1;
                $scope.isUsePublicCarCode = true;
            }
            //未使用公车checkbox选择
        $scope.isUsePublicCarForFalse = function() {
                $scope.principleBreakingParams.isUsePublicCar = 0;
                $scope.isUsePublicCarCode = false;
            }
            //使用公物checkbox选择
        $scope.isUsePublicGoodsForTrue = function() {
                $scope.principleBreakingParams.isUsePublicGoods = 1;
                $scope.isUsePublicGoodsCode = true;
            }
            //未使用公物checkbox选择
        $scope.isUsePublicGoodsForFalse = function() {
                $scope.principleBreakingParams.isUsePublicGoods = 0;
                $scope.isUsePublicGoodsCode = false;
            }
            //使用公产checkbox选择
        $scope.isUsePublicAssertsForTrue = function() {
                $scope.principleBreakingParams.isUsePublicAsserts = 1;
                $scope.isUsePublicAssetsCode = true;
            }
            //未使用公产checkbox选择
        $scope.isUsePublicAssertsForFalse = function() {
                $scope.principleBreakingParams.isUsePublicAsserts = 0;
                $scope.isUsePublicAssetsCode = false;
            }
            //使用公款
        $scope.isUsePublicMoneyForTrue = function() {
                $scope.principleBreakingParams.isUsePublicMoney = 1;
                $scope.isUsePublicMoneyCode = true;
            }
            //未使用公款checkbox选择
        $scope.isUsePublicMoneyForFalse = function() {
            $scope.principleBreakingParams.isUsePublicMoney = 0;
            $scope.isUsePublicMoneyCode = false;
            }


        /*
        违纪登记确定按钮
        提交修改信息
        */
        $scope.principleBreakingConfirm = function() {
            //显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });

            //违纪登记提交接口调用
            SuperviseService.eventSupervisePrincipleBreaking($scope.principleBreakingParams)
                .then(function(data) {
                    swal("操作完成");
                    //取消loading加载图
                    $.LoadingOverlay("hide");
                },function(data) {
                    console.log('error')
                })    
        }
    })
