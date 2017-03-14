/*
申报管理模块
公式页面
*/
angular.module('myApp.controllers')
    .controller('WedPublicityCtrl', function($scope, $state, PublicityService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken = sessionStorage.getItem('userToken');

        //跳转至当前页面时显示loading加载图
        $.LoadingOverlay("show", { 
            image: "img/spinning-circles.svg",
            bgcolor: 'rgba(28,43,54,0.7)'
        })

        //排序
        //标题
        $scope.approvalArray = [ 
            '申报人',
            '部门',
            '类型',
            '人数',
            '申报时间',
            '宴请时间',
            '状态',
            '操作'
        ];
        $scope.approvalSwitch1 = false;
        $scope.approvalOrdery1 = ''; //orderBy排序绑定
        $scope.SortApproval = function(index) { //排序小三角反转
                $scope.itemsApproval1 = index;
                $scope.approvalSwitch1 = !$scope.approvalSwitch1;
                if (index == 0) {
                    $scope.approvalOrdery1 = 'staff'; //申报人
                } else if (index == 1) {
                    $scope.approvalSwitch1 = false; //部门
                } else if (index == 2) {
                    $scope.approvalOrdery1 = 'eventType'; //类型
                } else if (index == 3) {
                    $scope.approvalOrdery1 = 'peopleCount'; //人数
                } else if (index == 4) {
                    $scope.approvalOrdery1 = 'createTime'; //申报时间
                } else if (index == 5) {
                    $scope.approvalOrdery1 = 'eventDate'; //宴请时间
                } else if (index == 6) {
                    $scope.approvalOrdery1 = 'auditStatus'; //状态
                } else if (index == 7) {
                    $scope.approvalSwitch1 = false; //操作
                }
            }


        //获取所有用户信息列表接口params
        $scope.publicityParams = {
            token: userToken,               //用户令牌
            staff: '',                      //申报人
            bulletinStatus: -1,             //公示状态 -1：未公示 1：已公示
            page: 1,                        //当前页数
            start: 0,                       //从第几个开始
            limit: '30'                     //每页显示多少个
        }

        /*
        跳转至当前页面时
        默认调用用户信息列表接口
        获取接口用户数据
        生成页码
        取消loading加载图
        */
        PublicityService.eventShowBulletin($scope.publicityParams)
            .then(function(data) {
                //取消loading加载图
                $.LoadingOverlay("hide")
                /*
                将获取的用户数据赋值变量
                在页面显示
                */
                $scope.publicitySearchData = data.data.result;
                //生成页码
                var pageNumber = Math.ceil(data.data.total / $scope.publicityParams.limit);
                $scope.page = new Array;
                for (var i = 0; i < pageNumber; i++) {
                    $scope.page.push(i + 1)
                }
            }, function(data) {
                console.log('error')
            })

        /*
        公示状态列表选择
        公示状态 -1：未公示 1：已公示
        */
        $scope.choseAuditStatus = function() {
            if (event.target.selectedIndex == 0) {
                $scope.publicityParams.bulletinStatus = event.target.selectedIndex - 1
            } else {
                $scope.publicityParams.bulletinStatus = event.target.selectedIndex
            }
        }

        /*
        切换页码
        刷新当前用户信息列表
        获取接口用户数据
        生成页码
        */
        $scope.changePage = function() {
            //点击页码显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });
            /*
            点击页码
            页码参数传递给用户信息列表接口
            */
            $scope.publicityParams.page = this.value;
            $scope.publicityParams.start = (this.value - 1) * 30;
            //调用接口刷新页面
            PublicityService.eventShowBulletin($scope.publicityParams)
                .then(function(data) {
                    /*
                    获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.publicitySearchData = data.data.result;
                    //取消loading加载图
                    $.LoadingOverlay("hide");
                }, function(data) {
                    console.log('error')
                })
        }

        /*
        上一页按钮
        重新生成页码
        刷新页面用户信息
        */
        $scope.previousPage = function() {
            if ($scope.publicityParams.page != 1) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                });
                $scope.publicityParams.page--;
                $scope.publicityParams.start = $scope.publicityParams.start - 30;
                //调用接口刷新页面
                PublicityService.eventShowBulletin($scope.publicityParams)
                    .then(function(data) {
                        /*
                        获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.publicitySearchData = data.data.result;
                        //取消loading加载图
                        $.LoadingOverlay("hide");
                    }, function(data) {
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
            if ($scope.publicityParams.page != $scope.page.length) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                });
                $scope.publicityParams.page++;
                $scope.publicityParams.start = $scope.publicityParams.start + 30;
                //调用接口刷新页面
                PublicityService.eventShowBulletin($scope.publicityParams)
                    .then(function(data) {
                        /*
                        获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.publicitySearchData = data.data.result;
                        //取消loading加载图
                        $.LoadingOverlay("hide");
                    }, function(data) {
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
            PublicityService.eventShowBulletin($scope.publicityParams)
                .then(function(data) {
                    /*
                    获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.publicitySearchData = data.data.result;
                    //生成页码
                    var pageNumber = Math.ceil(data.data.total / $scope.publicityParams.limit);
                    $scope.page = new Array;
                    for (var i = 0; i < pageNumber; i++) {
                        $scope.page.push(i + 1)
                    }
                    //取消loading加载图
                    $.LoadingOverlay("hide");
                }, function(data) {
                    console.log('error')
                })
        }


        /*
        点击公式内容按钮时
        获取当前用户信息的params
        */
        $scope.publicityParamsGetParams = {
            token: userToken,
            eventId: ''
        }

        /*
        点击提交按钮时
        提交公示内容中用户信息的params
        */
        $scope.publicityContentParams = {
            token: userToken,
            eventId: '',
            content: '',
            attachmentFileCode: ''
        }

        /*
        公式内容按钮
        获取当前用户信息
        */
        $scope.publicityContent = function() {
            $scope.publicityContentParams.content = '';

            //公示内容提交接口参数获取
            $scope.publicityContentParams.eventId = this.value.id;
            $scope.publicityParamsGetParams.eventId = this.value.id;
            //获取当前当前用户公示内容接口调用
            PublicityService.eventBulletinGet($scope.publicityParamsGetParams)
                .then(function(data) {
                    if (data.data.result) {
                        $scope.publicityContentParams.content = data.data.result.content
                    } else {
                        $scope.publicityContentParams.content = '';
                    }
                }, function(data) {
                    console.log('error')
                })
        }

        /*
        公示内容确定按钮
        提交修改信息
        */
        $scope.contentConfirm = function() {
            //显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });

            //公示内容提交接口调用
            PublicityService.eventBulletinAdd($scope.publicityContentParams)
                .then(function(data) {
                    //调用接口刷新页面
                    PublicityService.eventShowBulletin($scope.publicityParams)
                        .then(function(data) {
                            /*
                            获取的用户数据赋值变量
                            在页面显示
                            */
                            $scope.publicitySearchData = data.data.result;
                            //生成页码
                            var pageNumber = Math.ceil(data.data.total / $scope.publicityParams.limit);
                            $scope.page = new Array;
                            for (var i = 0; i < pageNumber; i++) {
                                $scope.page.push(i + 1)
                            }
                            
                            //取消loading加载图
                            $.LoadingOverlay("hide");

                            swal("操作完成");
                        }, function(data) {
                            console.log('error')
                        })


                }, function(data) {
                    console.log('error')
                })
        }




        /*
        点击公示结果按钮时
        获取当前用户信息的params
        */
        $scope.publicityResultGet = {
            token: userToken,
            eventId: ''
        }

        /*
        点击提交按钮时
        提交公示结果中用户信息的params
        */
        $scope.publicityResultParams = {
            token: userToken,
            eventId: '',
            status: 1,
            content: ''
        }

        /*
        公式结果按钮
        获取当前用户信息
        */
        $scope.publicityResult = function() {
            //公示结果提交接口参数获取
            $scope.publicityResultParams.eventId = this.value.id;
            $scope.publicityResultGet.eventId = this.value.id;
            //获取当前当前用户公示结果接口调用
            PublicityService.eventBulletinResultGet($scope.publicityResultGet)
                .then(function(data) {
                    //已公式
                    if (data.data.result) {
                        $scope.publicityResultParams.content = data.data.result.content
                        if (data.data.result.status == 1) {
                            $scope.status = true;
                        } else if (data.data.result.status == 2) {
                            $scope.status = false;
                        }
                    }
                    //未公式
                    else {
                        $scope.publicityResultParams.content = '';
                        $scope.status = true;
                    }
                }, function(data) {
                    console.log('error')
                })
        }


        //公示结果中的通过按钮
        $scope.allow = function() {
            $scope.publicityResultParams.status = 1;
            $scope.status = true;
        }
            
        //公示结果中的有异议按钮
        $scope.refuse = function() {
            $scope.publicityResultParams.status = 2;
            $scope.status = false;
        }
            
        /*
        公示结果确定按钮
        提交修改信息
        */
        $scope.resultConfirm = function() {
            //显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });
            //公示结果提交接口调用
            PublicityService.eventBulletinResultAdd($scope.publicityResultParams)
                .then(function(data) {
                    swal("操作完成");
                    //取消loading加载图
                    $.LoadingOverlay("hide");
                }, function(data) {
                    console.log('error')
                })
        }
    })
