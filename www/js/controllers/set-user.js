/*
系统设置模块
用户管理页面
*/
angular.module('myApp.controllers')
    .controller('SetUserCtrl', function($scope, $state, SetUserService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');

        //跳转至当前页面时显示loading加载图
        $.LoadingOverlay("show", { 
            image: "img/spinning-circles.svg",
            bgcolor: 'rgba(28,43,54,0.7)'
        })
        
        //排序
        $scope.managementArray = [ //标题
            '用户名',
            '姓名',
            '部门',
            '操作',
        ];
        $scope.managementSwitch = false;
        $scope.managementOrdery = ''; //orderBy排序绑定
        $scope.SortingManagement = function(index) { //排序小三角反转
                $scope.itemsManagement = index;
                $scope.managementSwitch = !$scope.managementSwitch;
                if (index == 0) {
                    $scope.managementOrdery = 'username'; //用户名
                } else if (index == 1) {
                    $scope.managementOrdery = 'name'; //姓名
                } else if (index == 2) {
                    $scope.managementOrdery = ''; //根组织 恢复
                } else if (index == 3) {
                    $scope.managementSwitch = false;
                }
            }



        //获取所有用户信息列表接口params  
        $scope.userShowParams = {
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
        SetUserService.userShow($scope.userShowParams)
            .then(function(data) {
                //取消loading加载图
                $.LoadingOverlay("hide");

                /*
                将获取的用户数据赋值变量
                在页面显示
                */
                $scope.userList = data.data.result;
                //生成页码
                var pageNumber = Math.ceil(data.data.total / $scope.userShowParams.limit);
                $scope.page = new Array;
                for (var i = 0; i < pageNumber; i++) {
                    $scope.page.push(i + 1)
                }
            },function(data) {
                console.log('error')
            })

        /*
        跳转至当前页面时
        获取角色信息列表数据params
        */
        $scope.roleGetAllParams = {
                token: userToken,     //用户令牌
                roleId: 0             //用户角色ID
            }

        /*
        跳转至当前页面时
        获取角色信息列表数据
        以便于新增和修改时选择
        */
        SetUserService.roleGetAll($scope.roleGetAllParams)
            .then(function(data) {
                $scope.roleGetAllList = data.data.result
            },function(data) {
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
            $scope.userShowParams.page = this.value;
            $scope.userShowParams.start = (this.value - 1) * $scope.userShowParams.limit;
            // 调用接口刷新页面
            SetUserService.userShow($scope.userShowParams)
                .then(function(data) {
                    /*
                    将获取的用户数据赋值变量
                    在页面显示
                    */
                    $scope.userList = data.data.result;

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
            if ($scope.userShowParams.page != 1) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                })

                $scope.userShowParams.page--;
                $scope.userShowParams.start = $scope.userShowParams.start - $scope.userShowParams.limit;
                // 调用接口刷新页面
                SetUserService.userShow($scope.userShowParams)
                    .then(function(data) {
                        /*
                        将获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.userList = data.data.result;

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
            if ($scope.userShowParams.page != $scope.page.length) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                })

                $scope.userShowParams.page++;
                $scope.userShowParams.start = $scope.userShowParams.start + $scope.userShowParams.limit;
                // 调用接口刷新页面
                SetUserService.userShow($scope.userShowParams)
                    .then(function(data) {
                        /*
                        将获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.userList = data.data.result;

                        //loading加载图
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
        $scope.confirmAddSwitchfunction = function() {
            $scope.confirmAddSwitch = false; //表单验证开关
            //默认将角色管理显示为用户管理
            $scope.roleId=1;
        }


        //新添角色params
        $scope.addUserParams = {
            token: userToken,
            orgId: 1,               //部门id
            username: '',           //用户名
            name: '',               //姓名
            password: '',           //密码
            roleId: 1               //角色id
        }

        //新增密码确认
        $scope.addConfirmPassword = {
            password: ''
        };

        //新增用户角色列表选择
        $scope.changeAddRole = function(roleId) {
            $scope.addUserParams.roleId = roleId;
        }

        /*
        确定新增按钮
        添加新的角色信息
        重新生成页码
        刷新页面角色信息
        */
        $scope.confirmAdd = function() {
            //打开表单验证开关
            $scope.confirmAddSwitch = true;
            if ($scope.addUserParams.username != '' && $scope.addUserParams.name != '' && $scope.addUserParams.password != '' && $scope.addUserParams.roleId != '') {
                if ($scope.addUserParams.password == $scope.addConfirmPassword.password) {
                    //显示loading加载图
                    $.LoadingOverlay("show", {
                        image: "img/spinning-circles.svg",
                        bgcolor: 'rgba(28,43,54,0.7)'
                    })
                    //调用添加角色接口
                    SetUserService.addUser($scope.addUserParams)
                        .then(function(data) {
                            //重置新增列表数据
                            $scope.addUserParams.username = '';               //用户名
                            $scope.addUserParams.name = '';                   //姓名
                            $scope.addUserParams.password = '';               //密码
                            $scope.addConfirmPassword.password = '';          //密码确认
                            //调用接口刷新页面
                            SetUserService.userShow($scope.userShowParams)
                                .then(function(data) {
                                    /*
                                    获取的用户数据赋值变量
                                    在页面显示
                                    */    
                                    $scope.userList = data.data.result;
                                    //生成页码
                                    var pageNumber = Math.ceil(data.data.total / $scope.userShowParams.limit);
                                    $scope.page = new Array;
                                    for (var i = 0; i < pageNumber; i++) {
                                        $scope.page.push(i + 1)
                                    }
                                    //隐藏模态框
                                    $('#allowContent').modal('hide');
                                    swal("添加成功!");

                                    //取消loading加载图
                                    $.LoadingOverlay("hide");

                                },function(data) {
                                    console.log('error')
                                })
                        },function(data) {
                            console.log('error')
                        })
                } else {
                    swal("密码不一致!");
                    $scope.addUserParams.password = '';
                    $scope.addConfirmPassword.password = ''; 
                }
            }
        }


        /*
        修改
        点击修改按钮
        获取当前角色信息的params
        */
        $scope.userGetByIdParams = {
            token: userToken,         //用户令牌  
            userId: ''                //用户名id
        }   

        /*
        修改按钮
        获取当前用户信息
        */
        $scope.amendRole = function() {

                //获取单个用户信息params中roleid赋值
                $scope.userGetByIdParams.userId= this.value.id;   
                //修改用户信息params中roleid赋值
                $scope.updateUserParams.userId=this.value.id;

                 //获取当前用户角色信息接口调用
                SetUserService.userGetById($scope.userGetByIdParams)
                    .then(function(data) {
                        /*
                        将获取的用户数据赋值变量
                        在页面显示
                        */
                        $scope.userGetByIdData = data.data.result;

                        /*
                        点开修改用户模态框后
                        角色列表显示信息
                        */
                        $scope.roleId=data.data.result.role.id;

                        //修改用户信息params中name参数赋值
                        $scope.updateUserParams.name = $scope.userGetByIdData.name
                    },function(data) {
                        console.log('error')
                    })
            }

        //密码确认
        $scope.confirmPassword = {
            password: ''
        };

        //角色名选择事件
        $scope.changeRole = function(roleId) {
            $scope.updateUserParams.roleId = roleId;
        }

        // 修改用户信息params
        $scope.updateUserParams = {
            token: userToken,       //用户令牌     
            userId:'',              //用户名id
            orgId: 1,               //部门id
            roleId: 1,              //角色名id
            name: '',               //用户姓名
            password: ''            //用户密码
        }

        /*
        修改确定按钮
        提交修改信息
        */
        $scope.confirmAmend = function() {
            if ($scope.updateUserParams.password == $scope.confirmPassword.password&&Boolean($scope.updateUserParams.name)==true) {
                //显示loading加载图
                $.LoadingOverlay("show", {
                    image: "img/spinning-circles.svg",
                    bgcolor: 'rgba(28,43,54,0.7)'
                })
                //调用修改用户接口
                SetUserService.updateUser($scope.updateUserParams)
                    .then(function(data) {
                        swal("修改完成");

                        //模态框消失
                        $('#amendRole').modal('hide');    

                        //调用接口刷新页面
                        SetUserService.userShow($scope.userShowParams)
                            .then(function(data) {
                                //取消loading加载图
                                $.LoadingOverlay("hide")
                                /*
                                获取的用户数据赋值变量
                                在页面显示
                                */
                                $scope.userList = data.data.result;

                                //生成页码
                                var pageNumber = Math.ceil(data.data.total / $scope.userShowParams.limit);
                                $scope.page = new Array;
                                for (var i = 0; i < pageNumber; i++) {
                                    $scope.page.push(i + 1)
                                }
                            },function(data) {
                                console.log('error')
                            }) 
                    },function(data) {
                        console.log('error')
                    }) 
            } 
        }

        /*
        删除
        删除用户params
        */
        $scope.delRolParams = {
            token: userToken,
            id:''               //用户名id
        }

        /*
        删除按钮
        重新生成页码
        刷新页面用户信息
        */
        $scope.delRol = function() {
            // 删除用户信息params参数赋值
            $scope.delRolParams.id=this.value.id;

            swal({
                title: "确定删除此用户?",
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
                SetUserService.removeUser($scope.delRolParams)
                    .then(function(data) {
                        console.log(data)
                        //调用接口刷新页面
                        SetUserService.userShow($scope.userShowParams)
                            .then(function(data) {
                                /*
                                获取的用户数据赋值变量
                                在页面显示
                                */
                                $scope.userList = data.data.result;
                                //生成页码
                                var pageNumber = Math.ceil(data.data.total / $scope.userShowParams.limit);
                                $scope.page = new Array;
                                for (var i = 0; i < pageNumber; i++) {
                                    $scope.page.push(i + 1)
                                }
                                swal("删除成功");

                                //取消loading加载图
                                $.LoadingOverlay("hide")
                            },function(data) {
                                console.log('error')
                            })
                    }, function(error) {
                        swal({
                            title:"网络访问出错",
                            type:"warning",
                            confirmButtonText:" 确认"
                        });
                        //取消loading加载图
                        $.LoadingOverlay("hide")
                    })   
            });
        }
    })   


       
