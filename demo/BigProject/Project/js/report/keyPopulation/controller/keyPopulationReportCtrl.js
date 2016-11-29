"use strict";
APP.CONTROLLERS.controller('keyPopulationReportCtrl', keyPopulationReportCtrl);
keyPopulationReportCtrl.$inject = ['$rootScope', '$state', 'keyPopulationReportService','$filter'];
function keyPopulationReportCtrl($rootScope, $state, keyPopulationReportService,$filter) {
    var vm = this;
    vm.lastSearchParam=null;


    vm.isReset=false;
    vm.isSearching=false;
    vm.organizationReportName = '';
    vm.isLevel=null;


    vm.currentNavItem=$state.params.TYPE?$state.params.TYPE:'diabetes';
    vm.years=[];
    vm.months=['01','02','03','04','05','06','07','08','09','10','11','12'];

    vm.changeSelect = function (index) {
        switch (index) {
            case 0:
                vm.organizationLevel = null;
                vm.organizationName = null;
                vm.doctorName = null;
                vm.searchOrganizationOrDoctor=null;
                break;
            case 1:
                vm.organizationName = null;
                vm.doctorName = null;
                vm.searchOrganizationOrDoctor=null;
                break;
            case 2:
                vm.doctorName = null;
                vm.searchOrganizationOrDoctor=null;
                break;
            default:
                vm.searchOrganizationOrDoctor=null;
                break;
        }
    };


    vm.resetChart=function () {
        vm.lastSearchParam=null;
        vm.isReset = true;
        vm.searchObject = null;
        vm.organizationLevel = null;
        vm.organizationName = null;
        vm.doctorName = null;
        vm.searchOrganizationOrDoctor = null;
        vm.organizationReportName = '';
        resetTime();
        if(vm.currentNavItem==='diabetes'){
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:true,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:false,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
        }else if(vm.currentNavItem==='hypertension'){
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:true,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:true,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
        }
        getResetAllData(vm.currentNavItem);
    };

    vm.searchChart=function () {
        vm.isSearching=true;
        if(vm.currentNavItem==='diabetes'){

            vm.showLeftMiddle={
                chart:false,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:false,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
        }else if(vm.currentNavItem==='hypertension'){
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:false
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:false,
                date:false,
                more:false
            };
            vm.showRightMiddle={
                chart:true,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
        }
        getSearchData(vm.currentNavItem);

    };

    vm.changeNavItem=function (type) {
        if(type===vm.currentNavItem){
            return;
        }
        resetTime();
        if(!vm.lastSearchParam && type==='diabetes'){
            vm.isReset=true;
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:true,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:false,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
            getResetAllData(type);
        }else if(!vm.lastSearchParam && type!=='diabetes'){
            vm.isReset=true;
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:true,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:true,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
            getResetAllData(type);
        }else if(vm.lastSearchParam && type==='diabetes'){
            vm.isSearching=true;
            vm.showLeftMiddle={
                chart:false,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:false,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
            getSearchData(type);
        }else if(vm.lastSearchParam && type!=='diabetes'){
            vm.isSearching=true;
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:false
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:false,
                date:false,
                more:false
            };
            vm.showRightMiddle={
                chart:true,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
            getSearchData(type);
        }
    };


    
    function getResetAllData(type) {
        if(type==='diabetes'){
            keyPopulationReportService.getAllDiabetesData({
                SEARCH_TIME:vm.nowYear,
                SEARCH_YEAR_MONTH:$filter('commonDate')(new Date(vm.nowYear+'-'+vm.nowMonth))
            }, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.isLevel=data.ORGANIZATION_LEVEL;
                    vm.diabetesTotal=data.DIABETES_DATA.DIABETES_TOTAL||0;
                    vm.followupTotal=data.DIABETES_DATA.FOLLOW_UP_TOTAL||0;
                    vm.followupAverage=data.DIABETES_DATA.RESIDENT_FOLLOW_UP_ED_AVERAGE||0;
                    vm.averageTime=data.DIABETES_DATA.DIABETES_AVERAGE||0;
                    vm.doctorManageAverage=data.DIABETES_DATA.DOCTOR_PER_RESIDENT_MANAGEMENT||0;
                    drawLeftMiddle(data,'diabetes');
                    drawLeftBottom(data,'diabetes');
                    drawRightTop(data,'diabetes');
                    drawRightBottom(data,'diabetes');
                    vm.isReset = false;
                }, function () {
                    $rootScope.alertDialog("获取报表初始化数据失败");
                    vm.isReset = false;
                });
            },function () {
                $rootScope.alertDialog("获取报表初始化数据失败");
                vm.isReset = false;
            });
        }else{
            keyPopulationReportService.getAllHypertensionData({
                SEARCH_TIME:vm.nowYear,
                SEARCH_YEAR_MONTH:$filter('commonDate')(new Date(vm.nowYear+'-'+vm.nowMonth))
            }, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.isLevel=data.ORGANIZATION_LEVEL;
                    vm.hypertensionTotal=data.HYPERTENSION_DATA.HYPERTENSION_TOTAL||0;
                    vm.followupHypertensionTotal=data.HYPERTENSION_DATA.FOLLOW_UP_TOTAL||0;
                    vm.hypertensionDoctorAverage=data.HYPERTENSION_DATA.DOCTOR_PER_RESIDENT_MANAGEMENT||0;
                    vm.hypertensionFollowupAverage=data.HYPERTENSION_DATA.RESIDENT_FOLLOW_UP_ED_AVERAGE||0;
                    vm.hypertensionAverageTime=data.HYPERTENSION_DATA.DIABETES_AVERAGE||0;
                    vm.manageNumber_1=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_1||0;
                    vm.manageNumber_2=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_2||0;
                    vm.manageNumber_3=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_3||0;
                    vm.bloodPressure_1=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_1||0;
                    vm.bloodPressure_2=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_2||0;
                    vm.bloodPressure_3=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_3||0;
                    drawLeftMiddle(data,'hypertension');
                    drawLeftBottom(data,'hypertension');
                    drawRightTop(data,'hypertension');
                    drawRightMiddle(data,'hypertension');
                    drawRightBottom(data,'hypertension');
                    vm.isReset = false;
                }, function () {
                    $rootScope.alertDialog("获取报表初始化数据失败");
                    vm.isReset = false;
                });
            },function () {
                $rootScope.alertDialog("获取报表初始化数据失败");
                vm.isReset = false;
            });
        }
    }

    function getSearchData(type) {
        var param={
            SEARCH_TIME:vm.nowYear,
            SEARCH_YEAR_MONTH:$filter('commonDate')(new Date(vm.nowYear+'-'+vm.nowMonth))
        };
        if (vm.searchOrganizationOrDoctor && vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID && !vm.searchOrganizationOrDoctor.FAMILY_DOCTOR_KEY_ID) {
            param.ORGANIZATION_KEY_ID = vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID;
        } else if (vm.searchOrganizationOrDoctor && vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID && vm.searchOrganizationOrDoctor.FAMILY_DOCTOR_KEY_ID) {
            param.ORGANIZATION_KEY_ID = vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID;
            param.FAMILY_DOCTOR_KEY_ID = vm.searchOrganizationOrDoctor.FAMILY_DOCTOR_KEY_ID;
        } else if (vm.searchObject === '0') {
            param.ORGANIZATION_KEY_ID = vm.organizationName.ORGANIZATION_KEY_ID;
        } else {
            param.ORGANIZATION_KEY_ID = vm.organizationName.ORGANIZATION_KEY_ID;
            param.FAMILY_DOCTOR_KEY_ID = vm.doctorName.FAMILY_DOCTOR_KEY_ID;
        }
        vm.organizationReportName=vm.organizationName.ORGANIZATION_NAME;
        vm.lastSearchParam=param;

        if(type==='diabetes'){
            vm.refreshRightMiddle();
            keyPopulationReportService.getAllDiabetesData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {

                    vm.diabetesTotal=data.DIABETES_DATA.DIABETES_TOTAL||0;
                    vm.followupTotal=data.DIABETES_DATA.FOLLOW_UP_TOTAL||0;
                    vm.followupAverage=data.DIABETES_DATA.RESIDENT_FOLLOW_UP_ED_AVERAGE||0;
                    vm.averageTime=data.DIABETES_DATA.DIABETES_AVERAGE||0;
                    vm.doctorManageAverage=data.DIABETES_DATA.DOCTOR_PER_RESIDENT_MANAGEMENT||0;
                    drawLeftMiddle(data,'diabetes');
                    drawLeftBottom(data,'diabetes');
                    drawRightTop(data,'diabetes');
                    drawRightBottom(data,'diabetes');
                    vm.isSearching=false;
                }, function () {
                    $rootScope.alertDialog("查询报表数据失败");
                    vm.isSearching=false;
                });
            },function () {
                $rootScope.alertDialog("查询报表数据失败");
                vm.isSearching=false;
            });
        }else{
            vm.refreshLeftMiddle('hypertension');
            keyPopulationReportService.getAllHypertensionData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.isLevel=data.ORGANIZATION_LEVEL;
                    vm.hypertensionTotal=data.HYPERTENSION_DATA.HYPERTENSION_TOTAL||0;
                    vm.followupHypertensionTotal=data.HYPERTENSION_DATA.FOLLOW_UP_TOTAL||0;
                    vm.hypertensionDoctorAverage=data.HYPERTENSION_DATA.DOCTOR_PER_RESIDENT_MANAGEMENT||0;
                    vm.hypertensionFollowupAverage=data.HYPERTENSION_DATA.RESIDENT_FOLLOW_UP_ED_AVERAGE||0;
                    vm.hypertensionAverageTime=data.HYPERTENSION_DATA.DIABETES_AVERAGE||0;
                    vm.manageNumber_1=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_1||0;
                    vm.manageNumber_2=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_2||0;
                    vm.manageNumber_3=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_3||0;
                    vm.bloodPressure_1=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_1||0;
                    vm.bloodPressure_2=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_2||0;
                    vm.bloodPressure_3=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_3||0;
                    drawLeftBottom(data,'hypertension');
                    drawRightTop(data,'hypertension');
                    drawRightMiddle(data,'hypertension');
                    drawRightBottom(data,'hypertension');
                    vm.isSearching = false;
                }, function () {
                    $rootScope.alertDialog("获取报表数据失败");
                    vm.isSearching = false;
                });
            },function () {
                $rootScope.alertDialog("获取报表数据失败");
                vm.isSearching = false;
            });
        }
    }
    
    function resetTime() {
        vm.leftMiddleYear=vm.nowYear+'';
        vm.leftMiddleMonth=vm.nowMonth+'';
        vm.leftBottomYear=vm.nowYear+'';
        vm.rightTopYear=vm.nowYear+'';
        vm.rightTopMonth=vm.nowMonth+'';
        vm.rightMiddleYear=vm.nowYear+'';
        vm.rightMiddleMonth=vm.nowMonth+'';
        vm.rightBottomYear=vm.nowYear+'';
        vm.rightBottomMonth=vm.nowMonth+'';
    }


    vm.changeRightMiddleYear=function() {
        vm.rightMiddleMonth='01';
        vm.refreshRightMiddle();
    };

    vm.changeLeftMiddleYear=function() {
        vm.leftMiddleMonth='01';
        vm.refreshLeftMiddle();
    };

    vm.refreshRightMiddle=function() {
        var param=vm.lastSearchParam||{};
        param.SEARCH_YEAR_MONTH=vm.rightMiddleYear+'-'+vm.rightMiddleMonth+'-01';
        keyPopulationReportService.getGlucoseAndWarningData(param, function (response) {
            $rootScope.handleMessage(response, function (data) {
                drawRightMiddle(data,vm.currentNavItem);
            }, function () {
                $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
            });
        },function () {
            $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
        });

    };

    vm.refreshLeftMiddle=function(type) {
        var param=vm.lastSearchParam||{};
        param.SEARCH_YEAR_MONTH=vm.leftMiddleYear+'-'+vm.leftMiddleMonth+'-01'
        if((type && type==='hypertension') || vm.currentNavItem==='hypertension'){
            keyPopulationReportService.getHBPGlucoseAndWarningData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawLeftMiddle(data,vm.currentNavItem);
                }, function () {
                    $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
                });
            },function () {
                $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
            });
        }else{
            keyPopulationReportService.getGlucoseAndWarningData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawLeftMiddle(data,vm.currentNavItem);
                }, function () {
                    $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
                });
            },function () {
                $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
            });
        }
    };

    vm.refreshLeftBottom=function () {
        var param=vm.lastSearchParam||{};
        param.SEARCH_TIME=vm.leftBottomYear;
        if(vm.currentNavItem==='hypertension') {
            keyPopulationReportService.getPerMonthHypertensionData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawLeftBottom(data,vm.currentNavItem);
                }, function () {
                    $rootScope.alertDialog("获取数据失败");
                });
            },function () {
                $rootScope.alertDialog("获取数据失败");
            });
        }else{
            keyPopulationReportService.getPerMonthDiabetesData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawLeftBottom(data,vm.currentNavItem);
                }, function () {
                    $rootScope.alertDialog("获取数据失败");
                });
            },function () {
                $rootScope.alertDialog("获取数据失败");
            });
        }
    };


    function drawLeftMiddle(chartData,type) {
        if (!vm.showLeftMiddle.chart) {
            return;
        }

        var axisList = [];
        var axisValueList_1 = [];
        var axisValueList_2 = [];

        if (type='hypertension' && vm.lastSearchParam) {
            if (!chartData.GLUCOSE_AND_WARNING) {
                chartData.GLUCOSE_AND_WARNING = [{}];
            }

            vm.leftMiddle={
                color:['#1d4fdc','#ff6b6b'],
                title : {
                    text: '月度血压稳定与预警人数数据',
                    x:'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '高血压患者',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:chartData.GLUCOSE_AND_WARNING[0].STABLE_COUNT||0, name:'稳定人数'},
                            {value:chartData.GLUCOSE_AND_WARNING[0].UNSTABLE_COUNT||0, name:'预警人数'}
                        ],
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        } else {
            if (!chartData.GLUCOSE_AND_WARNING) {
                chartData.GLUCOSE_AND_WARNING = [];
            }

            for (var i = 0; i < chartData.GLUCOSE_AND_WARNING.length; i++) {
                axisList.push(chartData.GLUCOSE_AND_WARNING[i].ORGANIZATION_NAME);
                axisValueList_1.push(chartData.GLUCOSE_AND_WARNING[i].UNSTABLE_COUNT || 0);
                axisValueList_2.push(chartData.GLUCOSE_AND_WARNING[i].STABLE_COUNT || 0);
            }

            vm.leftMiddle = {
                color:['#1d4fdc','#ff6b6b'],
                title: {
                    text: type === 'diabetes' ? '区域内稳定及预警人数' : '区域内稳定及预警人数',
                    x: 'left'

                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    orient: 'vertical',
                    data: ['预警人数', '稳定人数'],
                    x: 'right'
                },
                grid: {
                    left: '8%',
                    right: '4%',
                    bottom: '16%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: axisList,
                        axisLabel: {
                            interval: 0,
                            rotate: 30,
                            formatter: function (value) {
                                if (value && value.length > 10) {
                                    return value.substring(0, 10) + "...";
                                }
                                return value;
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        minInterval: 1
                    }
                ],
                series: [
                    {
                        name: '稳定人数',
                        type: 'bar',
                        stack: type === 'diabetes' ? '糖尿病人数' : '高血压人数',
                        data: axisValueList_2
                    },
                    {
                        name: '预警人数',
                        type: 'bar',
                        stack: type === 'diabetes' ? '糖尿病人数' : '高血压人数',
                        data: axisValueList_1
                    }
                ]
            };
        }
    }

    function drawLeftBottom(chartData,type) {
        if(!vm.showLeftBottom.chart){
            return;
        }

        var axisList=[];
        var axisValueList=[];

        if(type==='diabetes') {
            for (var i = 0,j=0; i < chartData.TIME_LIST.length; i++) {
                axisList.push( chartData.TIME_LIST[i].TIME+'月');
                if(j<chartData.PER_MONTH_DIABETES_DATA.length && chartData.PER_MONTH_DIABETES_DATA[j].ADD_TIME===chartData.TIME_LIST[i].TIME){
                    axisValueList.push(chartData.PER_MONTH_DIABETES_DATA[j].DIABETES_TOTAL);
                    j++;
                }else{
                    axisValueList.push(0);
                }
            }

            vm.leftBottom={
                title: {
                    text: '每月新增人数'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['新增人数'],
                    orient: 'vertical',
                    x:'right'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : axisList,
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'新增糖尿病人数',
                        type:'line',
                        label: {
                            normal: {
                                show: true,
                                textStyle:{
                                    color:'#000'
                                }
                            }
                        },
                        data:axisValueList
                    }
                ]
            };
        }else {
            for (var i = 0,j=0; i < chartData.TIME_LIST.length; i++) {
                axisList.push( chartData.TIME_LIST[i].TIME+'月');
                if(j<chartData.PER_MONTH_HYPERTENSION_DATA.length && chartData.PER_MONTH_HYPERTENSION_DATA[j].ADD_TIME===chartData.TIME_LIST[i].TIME){
                    axisValueList.push(chartData.PER_MONTH_HYPERTENSION_DATA[j].HYPERTENSION_TOTAL);
                    j++;
                }else{
                    axisValueList.push(0);
                }
            }

            vm.leftBottom={
                title: {
                    text: '每月新增高血压人数'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['新增高血压人数'],
                    orient: 'vertical',
                    x:'right'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : axisList,
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'新增高血压人数',
                        type:'line',
                        label: {
                            normal: {
                                show: true,
                                textStyle:{
                                    color:'#000'
                                }
                            }
                        },
                        data:axisValueList
                    }
                ]
            };
        }
    }

    function drawRightTop(chartData,type) {
        if(!vm.showRightTop.chart || vm.isLevel==='0'){
            return;
        }
        var total=0;
        var axisList=[];
        var axisValueList=[];

        if(type==='diabetes') {
            for (var i = 0; i < chartData.ODP_DISTRIBUTION_DATA.length; i++) {
                axisList.push(chartData.ODP_DISTRIBUTION_DATA[i].ORGANIZATION_NAME);
                axisValueList.push({
                    value:chartData.ODP_DISTRIBUTION_DATA[i].SUB_DIABETES_TOTAL||0,
                    name:chartData.ODP_DISTRIBUTION_DATA[i].ORGANIZATION_NAME
                });
                total=total+chartData.ODP_DISTRIBUTION_DATA[i].SUB_DIABETES_TOTAL||0;
            }
            if(total!==vm.diabetesTotal){
                axisList.push('其他');
                axisValueList.push({
                    value:(vm.diabetesTotal-total),
                    name:'其他'
                });
            }
            vm.rightTop={
                title : {
                    text: '区域内人群分布',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '人群分布',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        data:axisValueList,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }else {
            for (var i = 0; i < chartData.OHP_DISTRIBUTION_DATA.length; i++) {
                axisList.push(chartData.OHP_DISTRIBUTION_DATA[i].ORGANIZATION_NAME);
                axisValueList.push({
                    value:chartData.OHP_DISTRIBUTION_DATA[i].SUB_HYPERTENSION_TOTAL||0,
                    name:chartData.OHP_DISTRIBUTION_DATA[i].ORGANIZATION_NAME
                });
                total=total+chartData.OHP_DISTRIBUTION_DATA[i].SUB_HYPERTENSION_TOTAL||0;
            }
            if(total!==vm.hypertensionTotal){
                axisList.push('其他');
                axisValueList.push({
                    value:(vm.hypertensionTotal-total),
                    name:'其他'
                });
            }
            vm.rightTop={
                title : {
                    text: '区域内人群分布',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '高血压人群分布',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        data:axisValueList,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }
    }

    function drawRightMiddle(chartData,type) {
        if(!vm.showRightMiddle.chart){
            return;
        }

        if(type==='diabetes') {
            if(!chartData.GLUCOSE_AND_WARNING){
                chartData.GLUCOSE_AND_WARNING=[{}];
            }
            vm.rightMiddle={
                title : {
                    text: '月度血糖稳定与预警人数数据',
                    x:'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '糖尿病患者',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:chartData.GLUCOSE_AND_WARNING[0].STABLE_COUNT||0, name:'稳定人数'},
                            {value:chartData.GLUCOSE_AND_WARNING[0].UNSTABLE_COUNT||0, name:'预警人数'}
                        ],
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }else{
            if(!chartData.HBP_DISTRIBUTION){
                chartData.HBP_DISTRIBUTION={};
            }
            var dataList=[{
                value:chartData.HBP_DISTRIBUTION.BLOOD_PRESSURE_GRADING_1||0,
                name:'一级高血压人数'
            },{
                value:chartData.HBP_DISTRIBUTION.BLOOD_PRESSURE_GRADING_2||0,
                name:'二级高血压人数'
            },{
                value:chartData.HBP_DISTRIBUTION.BLOOD_PRESSURE_GRADING_3||0,
                name:'三级高血压人数'
            }];

            vm.rightMiddle={
                title : {
                    text: '高血压人群血压级别分布',
                    x:'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '高血压人群',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:dataList,
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }
    }

    function drawRightBottom(chartData,type) {
        if(!vm.showRightBottom.chart){
            return;
        }

        if(type==='diabetes') {
            if(!chartData.DIABETES_FACTORS){
                chartData.DIABETES_FACTORS={};
            }
            vm.rightBottom={
                color: ['#3398DB'],
                title : {
                    text: '相关人群生活状态统计'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['吸烟', '饮酒', '超重', '肥胖', '规律运动'],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'人数',
                        type:'bar',
                        barWidth: '60%',
                        data:[chartData.DIABETES_FACTORS.SMOKING||0,
                            chartData.DIABETES_FACTORS.DRINK||0,
                            chartData.DIABETES_FACTORS.OVERWEIGHT||0,
                            chartData.DIABETES_FACTORS.OBESITY||0,
                            chartData.DIABETES_FACTORS.REGULAR_MOVEMENT||0]
                    }
                ]
            };
        }else{
            if(!chartData.HYPERTENSION_FACTORS){
                chartData.HYPERTENSION_FACTORS={};
            }
            vm.rightBottom={
                color: ['#3398DB'],
                title : {
                    text: '高血压因素统计情况'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['吸烟', '饮酒', '超重', '肥胖', '低盐饮食'],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'人数',
                        type:'bar',
                        barWidth: '60%',
                        data:[chartData.HYPERTENSION_FACTORS.SMOKING||0,
                            chartData.HYPERTENSION_FACTORS.DRINK||0,
                            chartData.HYPERTENSION_FACTORS.OVERWEIGHT||0,
                            chartData.HYPERTENSION_FACTORS.OBESITY||0,
                            chartData.HYPERTENSION_FACTORS.LOW_SALT_DIET||0]
                    }
                ]
            };
        }
    }
    keyPopulationReportService.getSysDate('', function (response) {
        $rootScope.handleMessage(response, function (data) {
            vm.nowYear=new Date(data).getFullYear()+'';
            vm.nowMonth=new Date(data).getMonth()+1;
            for(var i=2015;i<=vm.nowYear;i++){
                vm.years.push(i);
            }
            vm.resetChart();
            vm.resetChart();
        }, function () {
            $rootScope.alertDialog("获取服务器时间失败");
            vm.nowYear=new Date().getFullYear()+'';
            vm.nowMonth=new Date().getMonth()+1;
            for(var i=2015;i<=vm.nowYear;i++){
                vm.years.push(i);
            }
        });
    },function () {
        $rootScope.alertDialog("获取服务器时间失败");
        vm.nowYear=new Date().getFullYear()+'';
        vm.nowMonth=new Date().getMonth()+1;
        for(var i=2015;i<=vm.nowYear;i++){
            vm.years.push(i);
        }
    });
    return vm;
}