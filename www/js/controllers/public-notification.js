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
