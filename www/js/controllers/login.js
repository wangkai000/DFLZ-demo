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
    