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
