angular.module('myApp.controllers', []);
//登录页面
angular.module('myApp.controllers')
    .controller('LoginCtrl', function($scope, $state, LoginServe) {

        $scope.user = '';
        $scope.password = '';

        //点击登录按钮
        $scope.login = function() {
                //账号密码不为空时调用接口
                if(Boolean($scope.user)==true&&Boolean($scope.password)==true){
                    //显示loading加载图
                    $.LoadingOverlay("show", {
                        image: "img/audio.svg",
                        bgcolor: 'rgba(28,43,54,0.7)'
                    });
                    //调用登录接口
                    LoginServe.userAuth({ username: $scope.user, password: $scope.password })
                        .then(function(data) {
                                //当返回状态不存在时提示   
                                if(data.data.result==null){
                                    //取消loading加载图
                                    $.LoadingOverlay("hide")

                                    swal('请核对用户名和密码');
                                }else{
                                    //取消loading加载图
                                    $.LoadingOverlay("hide")

                                    /*
                                    从页面获取用户名
                                    并存储到本地
                                    */
                                    sessionStorage.setItem('usernameStorage', $scope.user); 

                                    /*
                                    从接口冲获取用户令牌
                                    并存储到本地
                                    */
                                    sessionStorage.setItem('userToken',data.data.result.token);

                                    //跳转至主页面
                                    $state.go('main');
                                }
                                // $state.go('main', {
                                //     data: {
                                //         key: data.data.result.token
                                //     }
                                // });
                        }, function(data) {
                            console.log('error')
                        })  
                }else{
                	swal('请输入用户名和密码')
                }
               
            }
            
        //高斯模糊背景图片
        $scope.bgImgRandom = Math.floor(Math.random() * 5);
        $scope.bgImg = [
            'http://img.bizhi.sogou.com/images/2012/03/18/265322.jpg',
            'http://img.bizhi.sogou.com/images/2012/03/03/166839.jpg',
            'http://dl.bizhi.sogou.com/images/2012/04/13/190131.jpg',
            'http://img.bizhi.sogou.com/images/2012/04/01/260405.jpg',
            'http://img.qqu.cc/uploads/allimg/141214/1-141214192638.jpg',
            'http://img.qqu.cc/uploads/allimg/141214/1-141214192646.jpg'
        ];
        $scope.imgPhoto = $scope.bgImg[$scope.bgImgRandom];
    })
    
//主页面
angular.module('myApp.controllers')
    .controller('MainCtrl', function($scope, $state, $stateParams) {
        //获取用户名
        $scope.usernameStorage = sessionStorage.getItem('usernameStorage');

        /*
          点击退出按钮
          返回登录页面
        */
        $scope.exitSiteButton = function() {
            swal({
                title: "是否退出当前管理系统?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: false

            }, function() {;
                $state.go('login'); 

                swal({
                    title: "退出成功!",
                    text: "临汾经济技术开发区党风廉政建设责任制监系统",
                    timer: 300,
                    showConfirmButton: false
                });
            });
        }


        //控制侧边栏折叠,头部隐藏显示
        $(function() {

            //控制侧边栏折叠
            $('.sidebar-menu .openable > a').click(function() {

                if (!$('aside').hasClass('sidebar-mini') || Modernizr.mq('(max-width: 991px)')) {
                    if ($(this).parent().children('.submenu').is(':hidden')) {
                        $(this).parent().siblings().removeClass('open').children('.submenu').slideUp(200);
                        $(this).parent().addClass('open').children('.submenu').slideDown(200);
                    } else {
                        $(this).parent().removeClass('open').children('.submenu').slideUp(200);
                    }
                }
                return false;

            });

            //Open active menu
            if (!$('.sidebar-menu').hasClass('sidebar-mini') || Modernizr.mq('(max-width: 767px)')) {
                $('.openable.open').children('.submenu').slideDown(200);
            }

            //顶部三杠按钮切换侧边栏隐藏显示
            $('#sidebarToggleLG').click(function() {
                if ($('.wrapper').hasClass('display-right')) {
                    $('.wrapper').removeClass('display-right');
                    $('.sidebar-right').removeClass('active');
                } else {
                    //$('.nav-header').toggleClass('hide');
                    $('.top-nav').toggleClass('sidebar-mini');
                    $('aside').toggleClass('sidebar-mini');
                    $('footer').toggleClass('sidebar-mini');
                    $('.main-container').toggleClass('sidebar-mini');

                    $('.main-menu').find('.openable').removeClass('open');
                    $('.main-menu').find('.submenu').removeAttr('style');
                }
            });

            $('#sidebarToggleSM').click(function() {
                $('aside').toggleClass('active');
                $('.wrapper').toggleClass('display-left');
            });
        });
    })
    
/*
责任追究模块
纪律处分页面
*/
angular.module('myApp.controllers')
    .controller('disciplinePunishDisciplineShow', function($scope, $state, DisciplineService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');

        $scope.StartpageDiscipline = 0; //limit用的 页码
        $scope.loadingDis = false; //加载动画
        //排序
        $scope.speciesDisciplinary = [ //标题
            '被通报人',
            '被通报人部门',
            '标题',
            '时间',
            '操作'
        ];
        $scope.DisciplinarySwitch = false;
        $scope.DisciplinaryOrdery = ''; //orderBy排序绑定
        $scope.MySorting = function(index) { //排序小三角反转
            $scope.itemsDis = index;
            $scope.DisciplinarySwitch = !$scope.DisciplinarySwitch;
            if (index == 0) {
                $scope.DisciplinaryOrdery = 'staff'; //被通报人
            } else if (index == 1) {
                $scope.DisciplinarySwitch = false;
            } else if (index == 2) {
                $scope.DisciplinaryOrdery = 'title'; //标题
            } else if (index == 3) {
                $scope.DisciplinaryOrdery = ''; //单个时间排序
            } else if (index == 4) {
                $scope.DisciplinarySwitch = false;
            }
        }

        //获取列表
        $scope.disciplinePunishDiscipline = {
            token: userToken, //  令牌
            page: 1,
            staff: '', //   被通报人姓名
            start: 0, //    从那个开始
            limit: 10000 //    每页显示多少个 10000肯定显示全部
        };
        //console.log(userToken)


        $scope.searchDis = function() {
            $.LoadingOverlay("show", { //loading加载图
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });
            DisciplineService.disciplinePunishDisciplineShow($scope.disciplinePunishDiscipline)
                .then(function(data) {
                    //console.log(data);
                    //$scope.arrayDis = data.data;
                    $scope.arrayDis = data.data.result;
                    $scope.totalNumberDis = Math.ceil((data.data.total) / 30); //total 按钮数量

                    //取消loading加载图
                    $.LoadingOverlay("hide")
                }, function(data) {
                    console.log('失败');
                })


        };
        $scope.searchDis(); //最后调用


        //新增通报
        $scope.validation = function() {
            $scope.validationTitle = false;
            $scope.validationContent = false;
            $scope.validationStaff = false;
        }
        $scope.validation()

        $scope.addObjDis = {
            token: userToken, //令牌
            title: '', //   标题
            content: '', // 内容
            staff: '', //   人员
            staffOrgId: 1 //    人员所属部门
        };
        $scope.add = function() {
            $scope.validationTitle = true;
            $scope.validationContent = true;
            $scope.validationStaff = true;

            if ($scope.addObjDis.title != '' && $scope.addObjDis.content != '' && $scope.addObjDis.staff != '') {
                DisciplineService.disciplinePunishAdd($scope.addObjDis)
                    .then(function(data) {
                        //console.log(data);
                        if (data.data.success) {
                            $scope.addObjDis.title = ''; //清空
                            $scope.addObjDis.content = '';
                            $scope.addObjDis.staff = '';

                            $('#normalModal').modal('hide');
                            $scope.searchDis()
                            swal({ //sweetalert弹窗
                                title: "添加完成",
                                text: "",
                                timer: 1000,
                                type: "success",
                                showConfirmButton: false
                            });
                        };
                    }, function(data) {

                        console.log('失败');
                    })
            }

        };
        //删除通报 params
        $scope.delObjDis = { //delObjDis
            token: userToken, //  令牌
            id: '' //   id
        };

        //删除通报函数
        $scope.delDiscipline = function() {

            //sweetalert确定删除
            swal({
                    title: "确定删除?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3278b3",
                    confirmButtonText: "删除",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                },
                function() {
                    // Data.publicNotificationRemove($scope.delObjDis)//删除函数
                    DisciplineService.disciplinePunishRemove($scope.delObjDis)
                        .then(function(data) {
                                //模态框消失
                                $('#normalModal').modal('hide');

                                swal("删除成功!", "", "success");
                                setTimeout(function() {
                                    swal.close();
                                }, 200)
                                $scope.searchDis()
                        }, function(data) {

                          swal("网络错误!", "", "error");
                          setTimeout(function() {
                            swal.close();
                          }, 500)
                          $scope.searchDis()
                            console.log('失败');
                        })
                });
            //sweetalert删除结束
            $scope.delObjDis.id = this.val.id;
        };


        //修改函数
        //之前  第一次用
        $scope.editObjDis = {
            token: userToken, // 令牌
            id: '' //  通报id
        };
        //之后
        $scope.editObjDiscipline = {
            token: userToken, //  令牌
            id: '', //  通报id
            title: '', //   标题
            content: '', // 内容
            staff: '', //   人员
            staffOrgId: 1 //  人员所属部门
        };


        $scope.editDis = function() { //点击修改按钮
            $scope.editObjDis.id = this.val.id;
            DisciplineService.disciplinePunishGetById($scope.editObjDis) //先调用一次get接口
                .then(function(data) {
                    $scope.editObjDiscipline.content = data.data.result.content;
                }, function(data) {
                  swal("网络错误!", "", "error");
                  setTimeout(function() {
                    swal.close();
                  }, 500)
                  $scope.searchDis()
                  $('#editModal').modal('hide');
                    console.log(失败);
                })

            if (this.val.id) {
                $scope.editObjDiscipline.id = this.val.id;
            }
            if (this.val.title) {
                $scope.editObjDiscipline.title = this.val.title;
            }
            if (this.val.staff) {
                $scope.editObjDiscipline.staff = this.val.staff;
            }
            if (this.val.staffOrgId) {
                $scope.editObjDiscipline.staffOrgId = this.val.staffOrgId;
            }
        };

        //修改通报确认按钮
        $scope.editButton = function() {
            if(Boolean($scope.editObjDiscipline.title)==true&&Boolean($scope.editObjDiscipline.content)==true&&Boolean($scope.editObjDiscipline.staff)==true){
                DisciplineService.disciplinePunishUpdate($scope.editObjDiscipline)
                    .then(function(data) {
                        if (data.data.success) {
                            //
                            $('#editModal').modal('hide');
                            $scope.searchDis();
                            swal({
                                title: "修改成功",
                                text: '',
                                timer: 1000,
                                type: "success",
                                showConfirmButton: false
                            });
                        };
                    }, function(data) {
                        console.log('失败');
                    })
            }
        };
        //修改函数

        //双击
        $scope.getObjDis = {
            token: userToken, // 令牌
            id: '' //  通报id
        };
        //双击
        $scope.getDisciPline = function() {
            $('#getModal').modal('show')
            if (this.val.id) {
                $scope.getObjDis.id = this.val.id;
            }

            //Data.publicNotificationGetById($scope.getObjDis)//id函数    Clickarrry  detailArr
            DisciplineService.disciplinePunishGetById($scope.getObjDis)
                .then(function(data) {
                    //console.log(data);
                    if (data.data.success) {
                        $scope.Clickarrry = data.data.result;

                    };
                }, function(data) {
                  swal("网络错误!", "", "error");
                  setTimeout(function() {
                    swal.close();
                  }, 500)
                  $scope.searchDis()
                  $('#getModal').modal('hide');
                    console.log(失败);
                })
        };

        //下一页 $scope.Startpage
        $scope.nextPage1 = function() {
            //console.log($scope.Startpage)
            if ($scope.StartpageDiscipline / 30 < $scope.totalNumberDis - 1) {
                $scope.indexPage1++;
                $scope.StartpageDiscipline += 30;
            }
        };
        //上一页
        $scope.prePage1 = function() {
            if ($scope.StartpageDiscipline > 1) {
                $scope.indexPage1--;
                $scope.StartpageDiscipline -= 30;
            }
        };
        //点击数字按钮liClick($index)
        $scope.liClick1 = function(index) {
            $scope.indexPage1 = index;
            console.log(index)
            $scope.StartpageDiscipline = index * 30;
        };
        $scope.liClick1(0)
    })

/*
责任追究模块
公开通报页面
*/
angular.module('myApp.controllers')
    .controller('disciplinePunishShow', function($scope, $state, NotificationService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');

        $scope.Startpage = 0; //limit用的 页码
        $scope.loading = false; //加载动画
        $scope.species = [ //标题
            '被通报人',
            '被通报人部门',
            '标题',
            '时间',
            '操作'
        ];
        $scope.reverseSwitch = false;
        $scope.sortingOrdery = ''; //orderBy排序绑定
        $scope.sorting = function(index) { //排序小三角反转

            $scope.items = index;
            $scope.reverseSwitch = !$scope.reverseSwitch;
            if (index == 0) {
                $scope.sortingOrdery = 'staff'; //被通报人
            } else if (index == 1) {
                //$scope.sortingOrdery='';//被通报部门
                $scope.reverseSwitch = false;
            } else if (index == 2) {
                $scope.sortingOrdery = 'title'; //标题
            } else if (index == 3) {
                $scope.sortingOrdery = ''; //单个时间排序
            } else if (index == 4) {
                //$scope.sortingOrdery='';//操作 恢复
                $scope.reverseSwitch = false;
            }
        }



        //获取列表
        $scope.disciplinePunishShow = {
            token: userToken, //  令牌
            page: 1,
            staff: '', //   被通报人姓名
            start: 0, //    从那个开始
            limit: 10000 //    每页显示多少个 10000肯定显示全部
        };

        $scope.obtain = function() {
            //loading加载图
            $.LoadingOverlay("show", {
                image: "img/spinning-circles.svg",
                bgcolor: 'rgba(28,43,54,0.7)'
            });

            NotificationService.disciplinePunishShow($scope.disciplinePunishShow)
                .then(function(data) {
                    console.log(data);
                    $scope.array = data.data;
                    $scope.arraypage = data.data.result;
                    $scope.totalNumber = Math.ceil((data.data.total) / 30); //total 按钮数量

                    //取消loading加载图
                    $.LoadingOverlay("hide");

                }, function(data) {
                    console.log('失败');
                })
        };
        $scope.obtain(); //最后调用

        //点击添加

        //新增通报
        $scope.restore = function() {
            $scope.switchTitle = false; //input验证开关
            $scope.switchStaff = false;
            $scope.switchContent = false;
        }
        $scope.restore()


        $scope.addObj = {
            token: userToken, //  令牌
            title: '', //   标题
            content: '', // 内容
            staff: '', //   人员
            staffOrgId: 1 //    人员所属部门
        };

        //新增通报 添加函数
        $scope.add = function() {
            $scope.switchTitle = true;
            $scope.switchStaff = true;
            $scope.switchContent = true;
            if ($scope.addObj.title != '' && $scope.addObj.content != '' && $scope.addObj.staff != '') {
                $scope.switchTitle = false; //input验证开关恢复
                $scope.switchStaff = false;
                $scope.switchContent = false;

                NotificationService.publicNotificationAdd($scope.addObj)
                    .then(function(data) {
                        // console.log(data);
                        $('#normalModal').modal('hide')
                        if (data.data.success) {
                            $scope.obtain();
                            $scope.addObj.title = ''; //清空
                            $scope.addObj.content = '';
                            $scope.addObj.staff = '';
                            swal({ //sweetalert弹窗
                                title: "添加完成",
                                text: "",
                                timer: 1000,
                                type: "success",
                                showConfirmButton: false
                            });
                        };
                    }, function(data) {
                        console.log('失败');
                    })

            }
        };

        //删除通报 params
        $scope.delObj = {
            token: userToken, //  令牌
            id: '' //   id
        };

        //删除通报函数
        $scope.del = function() {

            //sweetalert确定删除
            swal({
                    title: "确定删除?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3278b3",
                    confirmButtonText: "删除",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                },
                function() {
                    NotificationService.publicNotificationRemove($scope.delObj) //删除函数
                        .then(function(data) {
                            //console.log(data);
                            //sweetalert 删除
                            if (data.data.success) { //成功

                                $('#normalModal').modal('hide');
                                swal("删除成功!", "", "success");
                                setTimeout(function() {
                                    swal.close();
                                },900)
                                $scope.obtain();
                            }
                        }, function(data) {
                          swal("网络错误!", "", "error");
                          setTimeout(function() {
                            swal.close();
                          }, 1000)
                          $scope.obtain();
                          console.log(data)
                            console.log('失败');
                        })




                });
            //sweetalert删除结束
            $scope.delObj.id = this.val.id;
        };


        //修改函数
        $scope.cationGetById = { //点击修第一次get接口
            token: userToken,
            id: ''
        };
        $scope.editObj = {
            token: userToken, //  令牌
            id: '', //  通报id
            title: '', //   标题
            content: '', // 内容
            staff: '', //   人员
            staffOrgId: 1 //  人员所属部门
        };

        //修改按钮
        $scope.edit = function() { //点击修改
            $scope.cationGetById.id = this.val.id;
            NotificationService.publicNotificationGetById($scope.cationGetById)
                .then(function(data) {
                    $scope.editObj.content = data.data.result.content;

                }, function(data) {
                  $('#editModal').modal('hide');
                  swal("网络错误!", "", "error");
                  setTimeout(function() {
                    swal.close();
                  }, 1000)
                  $scope.obtain();
                    console.log(失败);
                })

            if (this.val.id) {
                $scope.editObj.id = this.val.id;
            }
            if (this.val.title) {
                $scope.editObj.title = this.val.title;
            }
            if (this.val.staff) {
                $scope.editObj.staff = this.val.staff;
            }
            if (this.val.staffOrgId) {
                $scope.editObj.staffOrgId = this.val.staffOrgId;
            }
        };



        //修改通报确认按钮函数
        $scope.editConfirm = function() {
            if(Boolean($scope.editObj.title)==true&&Boolean($scope.editObj.content)==true&&Boolean($scope.editObj.staff)==true){
              NotificationService.publicNotificationUpdate($scope.editObj) //修改函数
                  .then(function(data) {
                      $('#editModal').modal('hide');
                      $scope.obtain();
                      swal({
                          title: "修改成功",
                          text: '',
                          timer: 1000,
                          type: "success",
                          showConfirmButton: false
                      });
                  }, function(data) {
                      console.log('失败');
                  })
            }

        };



        //获取详情 params
        $scope.getObj = {
            token: userToken, // 令牌
            id: '' //  通报id
        };
        //双击查看详情
        $scope.get = function() {
            $('#getModal').modal('show')
            if (this.val.id) {
                $scope.getObj.id = this.val.id;
            }

            NotificationService.publicNotificationGetById($scope.getObj)
                .then(function(data) {
                    //console.log(data);
                    //$scope.disciplineContent=data.data.result.content;//00000

                    if (data.data.success) {
                        $scope.detailArr = data.data.result;
                        //console.log(data);
                    };
                }, function(data) {
                  $('#getModal').modal('hide');
                  swal("网络错误!", "", "error");
                  setTimeout(function() {
                    swal.close();
                  }, 1000)
                  $scope.obtain();
                    console.log(失败);
                })
        };



        //下一页 $scope.Startpage
        $scope.nextPage = function() {
            if ($scope.Startpage / 30 < $scope.totalNumber - 1) {
                $scope.indexPage++;
                $scope.Startpage += 30;
            }
        };
        //上一页
        $scope.prePage = function() {

            if ($scope.Startpage > 1) {
                $scope.indexPage--;
                $scope.Startpage -= 30;
            }
        };
        //点击数字按钮liClick($index)
        $scope.liClick = function(index) {
            $scope.indexPage = index;
            $scope.Startpage = index * 30;
        };
        $scope.liClick(0); //默认第一个按钮
    })

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
    
/*
查询统计模块
数量统计页面
*/
angular.module('myApp.controllers')
    .controller('SearchQuantityCtrl', function($scope, $state, SearchQuantityService, $stateParams) {
        //从本地存储中获取用户令牌
        var userToken=sessionStorage.getItem('userToken');
        
        //datetime第三方插件
        jQuery.datetimepicker.setLocale('zh');

        jQuery('#eventCreateTimeFrom').datetimepicker({
            timepicker: false,
            //设置时间显示格式
            format: 'Y-m-d',
        });

        jQuery('#eventCreateTimeTo').datetimepicker({
            timepicker: false,
            //设置时间显示格式
            format: 'Y-m-d',
        });

        jQuery('#eventTimeFrom').datetimepicker({
            timepicker: false,
            //设置时间显示格式
            format: 'Y-m-d',
        });

        jQuery('#eventTimeTo').datetimepicker({
            timepicker: false,
            //设置时间显示格式
            format: 'Y-m-d',
        });



        /*
        点击查询按钮
        获取所有用户信息params
        */
        $scope.getOrgEvenTypeCountParams = {
                token: userToken,                   //用户令牌
                eventCreateTimeFrom: '',            //申报开始时间
                eventCreateTimeTo: '',              //申报截至时间
                eventTimeFrom: '',                  //宴请开始时间
                eventTimeTo: '',                    //宴请结束时间
            }


        /*
        跳转至当前页面时
        默认调用数据接口
        获取接口用户数据
        取消loading加载图
        */  
        SearchQuantityService.getOrgEvenTypeCount($scope.getOrgEvenTypeCountParams)
            .then(function(data) {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: ''
                    },
                    tooltip: {},
                    legend: {
                        data: ['根组织']
                    },
                    xAxis: {
                        data: ["婚嫁", "丧葬"]
                    },
                    yAxis: {
                        name: '数量',
                    },
                    series: [{
                        name: '根组织',
                        type: 'bar',
                        data: [data.data.result[0].type1Count, data.data.result[0].type2Count]
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },function(data) {
                console.log('error')
            })
            

        /*
        查询按钮
        刷新页面用户信息
        */
        $scope.searchExamine = function() {
            //获取申报开始时间
            $scope.getOrgEvenTypeCountParams.eventCreateTimeFrom = $('#eventCreateTimeFrom').val();
            //获取申报结束时间
            $scope.getOrgEvenTypeCountParams.eventCreateTimeTo=$('#eventCreateTimeTo').val();
            //获取宴请开始时间
            $scope.getOrgEvenTypeCountParams.eventTimeFrom=$('#eventTimeFrom').val();
            //获取宴请结束时间
            $scope.getOrgEvenTypeCountParams.eventTimeTo=$('#eventTimeTo').val();

            //调用接口刷新页面
            SearchQuantityService.getOrgEvenTypeCount($scope.getOrgEvenTypeCountParams)
                .then(function(data) {
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('main'));
                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: ''
                        },
                        tooltip: {},
                        legend: {
                            data: ['根组织']
                        },
                        xAxis: {
                            data: ["婚嫁", "丧葬"]
                        },
                        yAxis: {
                            name: '数量',
                        },
                        series: [{
                            name: '根组织',
                            type: 'bar',
                            data: [data.data.result[0].type1Count, data.data.result[0].type2Count]
                        }]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);

                }, function(data) {
                    console.log('error')
                }) 
        }
    })

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
