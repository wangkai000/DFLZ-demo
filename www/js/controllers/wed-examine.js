/*
申报管理模块
审批页面
*/
angular.module('myApp.controllers')
    .controller('WedExamineCtrl', function($scope, $state, ExamineService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');

        //跳转至当前页面时显示loading加载图
        $.LoadingOverlay("show", {
            image: "img/spinning-circles.svg",
            bgcolor: 'rgba(28,43,54,0.7)'
        })
        
        //排序模块
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
        $scope.approvalSwitch = false;
        $scope.approvalOrdery = ''; //orderBy排序绑定
        $scope.SortApproval = function(index) { //排序小三角反转
                $scope.itemsApproval = index;
                $scope.approvalSwitch = !$scope.approvalSwitch;
                if (index == 0) {
                    $scope.approvalOrdery = 'staff'; //申报人
                } else if (index == 1) {
                    $scope.approvalSwitch = false; //部门
                } else if (index == 2) {
                    $scope.approvalOrdery = 'eventType'; //类型
                } else if (index == 3) {
                    $scope.approvalOrdery = 'peopleCount'; //人数
                } else if (index == 4) {
                    $scope.approvalOrdery = 'createTime'; //申报时间
                } else if (index == 5) {
                    $scope.approvalOrdery = 'eventDate'; //宴请时间
                } else if (index == 6) {
                    $scope.approvalOrdery = 'auditStatus'; //状态
                } else if (index == 7) {
                    $scope.approvalSwitch = false; //操作
                }
            }
        //排序结束


        //获取所有用户信息列表接口params
        $scope.examineSearch = {
            token: userToken,                   //用户令牌
            staff: '',                          //申报人
            auditStatus: -1,                    //审核状态 -1：待审核 1：通过 2：拒绝
            page: 1,                            //当前页数
            start: 0,                           //从第几个开始
            limit: '30'                         //每页显示多少个
        }
    
        /*
        跳转至当前页面时
        默认调用用户信息列表接口
        获取接口用户数据
        生成页码
        取消loading加载图
        */
        ExamineService.eventShowAudit($scope.examineSearch)
            .then(function(data) {
                // 取消loading加载图
                $.LoadingOverlay("hide")
                /*
                将获取的用户数据赋值变量
                在页面显示
                */
                $scope.examineSearchData = data.data.result;
                //生成页码
                var pageNumber = Math.ceil(data.data.total / $scope.examineSearch.limit);
                $scope.page = new Array;
                for (var i = 0; i < pageNumber; i++) {
                    $scope.page.push(i + 1)
                }
            },function(data) {
                console.log('error')
            })
         

        /*
        审批状态列表选择
        审核状态 -1：待审核 1：通过 2：拒绝
        */
        $scope.choseAuditStatus = function() {
            if (event.target.selectedIndex == 0) {
                $scope.examineSearch.auditStatus = event.target.selectedIndex - 1
            } else {
                $scope.examineSearch.auditStatus = event.target.selectedIndex
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
            $scope.examineSearch.page = this.value;
            $scope.examineSearch.start = (this.value - 1) * 30;
            //调用接口刷新页面
            ExamineService.eventShowAudit($scope.examineSearch)
                .then(function(data) {
                    /*
                    获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.examineSearchData = data.data.result;
                    //取消loading加载图
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
            //显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });
            if ($scope.examineSearch.page != 1) {
                $scope.examineSearch.page--;
                $scope.examineSearch.start = $scope.examineSearch.start - 30;
                //调用接口刷新页面
                ExamineService.eventShowAudit($scope.examineSearch)
                    .then(function(data) {
                        /*
                        获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.examineSearchData = data.data.result;
                        //取消loading加载图
                        $.LoadingOverlay("hide")
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
            if ($scope.examineSearch.page != $scope.page.length) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                });
                $scope.examineSearch.page++;
                $scope.examineSearch.start = $scope.examineSearch.start + 30;
                //调用接口刷新页面
                ExamineService.eventShowAudit($scope.examineSearch)
                    .then(function(data) {
                        /*
                        获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.examineSearchData = data.data.result;
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
            ExamineService.eventShowAudit($scope.examineSearch)
                .then(function(data) {
                    /*
                    获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.examineSearchData = data.data.result;
                    //生成页码
                    var pageNumber = Math.ceil(data.data.total / $scope.examineSearch.limit);
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
        点击通过或拒绝按钮时
        获取当前用户信息的params
        */
        $scope.eventAuditGetByEventParmas={
            token: userToken,
            eventId:'',
            status:''
        }

        /*
        点击提交按钮时
        提交用户信息的params
        */
        $scope.allowParams = {
            token: userToken,
            eventId: '',                
            status: '',
            content: ''
        }

        /*
        通过按钮
        获取当前用户信息
        */
        $scope.pass = function() {
            //获取当前用户信息接口参数获取
            $scope.eventAuditGetByEventParmas.eventId=this.value.id;
            $scope.eventAuditGetByEventParmas.status=1;

            //提交用户信息接口参数获取
            $scope.allowParams.eventId = this.value.id;
            $scope.allowParams.status = 1;

            //获取当前用户信息接口调用
            ExamineService.eventAuditGetByEvent($scope.eventAuditGetByEventParmas)
                .then(function(data) {
                    //取消loading加载图
                    $.LoadingOverlay("hide");

                    /*
                    从获取用户信息接口内提取content
                    赋值给提交用户信息中的content参数
                    */
                   if(data.data.result!=null){
                        $scope.allowParams.content=data.data.result.content
                    }else{
                        //当从服务器获取没有意见时，显示为空
                        $scope.allowParams.content=''
                    } 
                },function(data) {
                    console.log('error')
                })     
        }

        /*
        拒绝按钮
        获取当前用户信息
        */
        $scope.refuse = function() {
            //获取当前用户信息接口参数获取
            $scope.eventAuditGetByEventParmas.eventId=this.value.id;
            $scope.eventAuditGetByEventParmas.status=2;

            //提交用户信息接口参数获取
            $scope.allowParams.eventId = this.value.id;
            $scope.allowParams.status = 2;

            //获取当前用户信息接口调用
            ExamineService.eventAuditGetByEvent($scope.eventAuditGetByEventParmas)
                .then(function(data) {
                    //取消loading加载图
                    $.LoadingOverlay("hide");

                    //审批 通过/拒绝提交params参数获取
                    if(data.data.result!=null){
                       $scope.allowParams.content=data.data.result.content
                    }else{
                       //当从服务器获取没有意见时，显示为空
                       $scope.allowParams.content=''
                    } 
                },function(data) {
                    console.log('error')
                })       
        }

        /*
        确定按钮
        提交修改信息
        */
        $scope.confirm = function() {
            //显示loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });

            //提交信息接口调用
            ExamineService.eventAudit($scope.allowParams)
                .then(function(data) {
                    //调用接口刷新页面
                    ExamineService.eventShowAudit($scope.examineSearch)
                        .then(function(data) {
                            /*
                            获取的用户数据赋值变量
                            在页面显示
                            */
                            $scope.examineSearchData = data.data.result;
                            //生成页码
                            var pageNumber = Math.ceil(data.data.total / $scope.examineSearch.limit);
                            $scope.page = new Array;
                            for (var i = 0; i < pageNumber; i++) {
                                $scope.page.push(i + 1)
                            }
                            //取消loading加载图
                            $.LoadingOverlay("hide");
                        },function(data) {
                            console.log('error')
                        })
                        swal("操作完成");
                },function(data) {
                    console.log('error')
                })
        }
    })
