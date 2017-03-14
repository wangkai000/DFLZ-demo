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
