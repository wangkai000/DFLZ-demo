/*
系统设置模块
角色管理页面
*/
angular.module('myApp.controllers')
    .controller('SetRoleCtrl', function($scope, $state, SetRoleService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');

        //跳转至当前页面时显示loading加载图
        $.LoadingOverlay("show", { 
            image: "img/spinning-circles.svg",
            bgcolor: 'rgba(28,43,54,0.7)'
        })


        //排序
        $scope.RoleManagement = [ //标题
            '角色名',
            '操作'
        ];
        $scope.RoleManagementSwitch = false;
        $scope.RoleManagementOrdery = ''; //orderBy排序绑定
        $scope.SortRoleManagement = function(index) { //排序小三角反转
                $scope.itemsRole = index;
                $scope.RoleManagementSwitch = !$scope.RoleManagementSwitch;
                if (index == 0) {
                    $scope.RoleManagementOrdery = 'name'; //角色名
                } else if (index == 1) {
                    $scope.RoleManagementOrdery = ''; //恢复
                }
            }


        //获取所有用户信息列表接口params
        $scope.roleShowParams = {
            token: userToken,           //用户令牌
            page: 1,                    //当前页数
            start: 0,                   //从第几个开始
            limit: 30                   //每页显示多少个
        }

        /*
        跳转至当前页面时
        默认调用用户信息列表接口
        获取接口用户数据
        生成页码
        取消loading加载图
        */
        SetRoleService.roleShow($scope.roleShowParams)
            .then(function(data) {
                //取消loading加载图
                $.LoadingOverlay("hide");
                /*
                将获取的用户数据赋值变量
                在页面显示
                */
                $scope.roleShowList = data.data.result;
                //生成页码
                var pageNumber = Math.ceil(data.data.total / $scope.roleShowParams.limit);
                $scope.page = new Array;
                for (var i = 0; i < pageNumber; i++) {
                    $scope.page.push(i + 1)
                }
            }, function(data) {
                console.log('error')
            })
           

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
            })
            /*
            点击页码
            页码参数传递给用户信息列表接口
            */
            $scope.roleShowParams.page = this.value;
            $scope.roleShowParams.start = (this.value - 1) * $scope.roleShowParams.limit;
            //调用接口刷新页面
            SetRoleService.roleShow($scope.roleShowParams)
                .then(function(data) {
                    /*
                    将获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.roleShowList = data.data.result;

                    //取消loading加载图
                    $.LoadingOverlay("hide")
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
            if ($scope.roleShowParams.page != 1) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                })

                $scope.roleShowParams.page--;
                $scope.roleShowParams.start = $scope.roleShowParams.start - $scope.roleShowParams.limit;
                //调用接口刷新页面
                SetRoleService.roleShow($scope.roleShowParams)
                    .then(function(data) {
                        /*
                        获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.roleShowList = data.data.result;

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
            if ($scope.roleShowParams.page != $scope.page.length) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                })

                $scope.roleShowParams.page++;
                $scope.roleShowParams.start = $scope.roleShowParams.start + $scope.roleShowParams.limit;
                //调用接口刷新页面
                SetRoleService.roleShow($scope.roleShowParams)
                    .then(function(data) {
                        /*
                        获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.roleShowList = data.data.result;

                        //取消loading加载图
                        $.LoadingOverlay("hide")
                    },function(data) {
                        console.log('error')
                    })
            }
        }


        /*
        新增
        点击新增按钮时
        打开表单验证开关
        */
        $scope.onfirmAddParamsFunction = function() {
                $scope.onfirmAddParamsSwitch = false;
                //复选框恢复默认
                $('#allowContent [type="checkbox"]').each(function(index, el) {
                    el.checked = false;
                })
                $('#amendContent [type="checkbox"]').each(function(index, el) {
                    el.checked = false;
                })
            }

        //新添角色params
        $scope.confirmAddParams = {
            token: userToken,        //用户令牌
            roleName: '',            //角色名称
            functionCodes: ''
        }

        /*
        确定新增按钮
        添加新的角色信息
        重新生成页码
        刷新页面角色信息
        */
        $scope.confirmAdd = function() {
            //打开表单验证开关
            $scope.onfirmAddParamsSwitch = true;
            if ($scope.confirmAddParams.roleName != '') {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                })

                //复选框选择
                var functionCodesArr = [];
                $('#allowContent [type="checkbox"]').each(function(index, el) {
                        if (el.checked) {
                            functionCodesArr.push(el.title)
                        }
                    })

                //将复选框的functionCodes数组赋给新添角色params
                $scope.confirmAddParams.functionCodes = functionCodesArr;

                //当functionCodes的数组长度不为0时调用接口
                if(functionCodesArr.length!=0){
                    //调用添加角色接口
                    SetRoleService.addRole($scope.confirmAddParams)
                        .then(function(data) {
                            //调用接口刷新页面
                            SetRoleService.roleShow($scope.roleShowParams)
                                .then(function(data) {
                                    if (data.data.success) {
                                        $('#allowContent').modal('hide');
                                        $scope.confirmAddParams.roleName = ''; 
                                        swal("添加成功!");

                                        //恢复默认
                                        $scope.onfirmAddParamsFunction();

                                        //取消loading加载图
                                        $.LoadingOverlay("hide")

                                        /*
                                        获取的用户数据赋值变量
                                        在页面显示
                                        */
                                        $scope.roleShowList = data.data.result;
                                        //生成页码
                                        var pageNumber = Math.ceil(data.data.total / $scope.roleShowParams.limit);
                                        $scope.page = new Array;
                                        for (var i = 0; i < pageNumber; i++) {
                                            $scope.page.push(i + 1)
                                        }
                                    }
                                },function(data) {
                                    console.log('error')
                                })

                        },function(data) {
                            console.log('error')
                        })
                       
                }else{
                    swal("请勾选角色权限");

                    //loading加载图
                    $.LoadingOverlay("hide")

                    //恢复表演验证默认
                    $scope.onfirmAddParamsFunction();
                }
            }
        }


        /*
        修改
        点击修改按钮
        获取当前角色信息的params
        */
        $scope.roleGetByIdParams = {
            token: userToken,
            roleId: ''
        }

        /*
        修改按钮
        获取当前用户信息
        */
        $scope.amendRole = function() {

            //获取单个角色信息params中roleid赋值
            $scope.roleGetByIdParams.roleId = this.value.id;
            //修改用户角色params中roleid赋值
            $scope.roleUpdateParams.roleId = this.value.id;

            //获取当前用户角色信息接口调用
            SetRoleService.roleGetById($scope.roleGetByIdParams)
                .then(function(data) {
                    //获取复选框信息并选择
                    for (var i = 0; i < data.data.result.functions.length; i++) {
                        $('#amendContent [type="checkbox"]').each(function(index, el) {
                            if (data.data.result.functions[i].code == el.title) {
                                el.checked = true;
                            }
                        })
                    }

                    //获取角色名称
                    $scope.roleUpdateParams.roleName = data.data.result.name;

                },function(data) {
                    swal({
                        title:'网络访问出错',
                        type:"warning",
                        confirmButtonText:" 确认"
                    });
                }) 
        }

        /*
        点击确定修改按钮
        修改用户角色params
        */
        $scope.roleUpdateParams = {
            token: userToken,
            roleId: '',                 //角色ID
            roleName: '',               //角色名称
            functionCodes: ''
        }

        /*
        修改确定按钮
        提交修改信息
        */
        $scope.confirmAmend = function() {
            $scope.onfirmAddParamsSwitch = true;
            if ($scope.roleUpdateParams.roleName != '') {
                //显示loading加载图
                $.LoadingOverlay("show", { 
                        image: "img/spinning-circles.svg",
                        bgcolor: 'rgba(28,43,54,0.7)'
                    })

                //复选框选择
                var functionCodesArr2 = [];
                $('#amendContent [type="checkbox"]').each(function(index, el) {
                        if (el.checked) {
                            functionCodesArr2.push(el.title)
                        }
                    })
                //将复选框的functionCodes数组赋给params
                $scope.roleUpdateParams.functionCodes = functionCodesArr2;

                //当functionCodes的数组长度不为0时调用接口
                if(functionCodesArr2.length!=0){
                   //调用修改角色接口
                   SetRoleService.roleUpdate($scope.roleUpdateParams)
                       .then(function(data) {
                           //调用接口刷新页面
                           SetRoleService.roleShow($scope.roleShowParams)
                               .then(function(data) {
                                   if (data.data.success) {
                                       $('#amendContent').modal('hide');
                                       $scope.confirmAddParams.roleName = ''; //清空
                                       swal("修改成功!");
                                       $.LoadingOverlay("hide")

                                       //恢复默认
                                       $scope.onfirmAddParamsFunction();

                                   }
                                   $scope.roleShowList = data.data.result;
                                   //生成页码数组
                                   var pageNumber = Math.ceil(data.data.total / $scope.roleShowParams.limit);
                                   $scope.page = new Array;
                                   for (var i = 0; i < pageNumber; i++) {
                                       $scope.page.push(i + 1)
                                   }

                                   //loading加载图
                                   $.LoadingOverlay("hide")
                               },function(data) {
                                   console.log('error')
                               })
                       },function(data) {
                           swal({
                               title:'网络访问出错',
                               type:"warning",
                               confirmButtonText:" 确认"
                           });

                           //loading加载图
                           $.LoadingOverlay("hide")
                       })
                }else{
                    swal("请勾选角色权限!");

                    //loading加载图
                    $.LoadingOverlay("hide")

                    //恢复表演验证默认
                    $scope.onfirmAddParamsFunction();
                } 
            }
        }

        /*
        删除
        删除角色params
        */
        $scope.roleRemoveParams = {
            token: userToken,
            id:''                   //用户名id
        }

        /*
        删除按钮
        重新生成页码
        刷新页面用户信息
        */
        $scope.delRol = function() {
            // 删除角色信息params参数赋值
            $scope.roleRemoveParams.id=this.value.id;

            swal({
                title: "确定删除此角色?",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "否",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是",
                closeOnConfirm: false,
                html: false
            }, function() {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                })
                //删除信息接口调用
                SetRoleService.roleRemove($scope.roleRemoveParams)
                    .then(function(data) {
                        if(data.data.success==true){
                            //调用接口刷新页面
                            SetRoleService.roleShow($scope.roleShowParams)
                                .then(function(data) {
                                    /*
                                    获取的用户数据赋值变量
                                    在页面显示
                                    */
                                    $scope.roleShowList = data.data.result;
                                    //生成页码
                                    var pageNumber = Math.ceil(data.data.total / $scope.roleShowParams.limit);
                                    $scope.page = new Array;
                                    for (var i = 0; i < pageNumber; i++) {
                                        $scope.page.push(i + 1)
                                    }

                                    //取消loading加载图
                                    $.LoadingOverlay("hide")
                                },function(data) {
                                    console.log('error')
                                })
                                swal("删除成功!");
                        }else if (data.data.success==false) {
                            swal({
                                title:data.data.error.message,
                                type:"warning",
                                confirmButtonText:" 确认"
                            });

                            //取消loading加载图
                            $.LoadingOverlay("hide")
                        }

                    },function(data) {
                        console.log('error')
                    })
            });
        } 
    })
