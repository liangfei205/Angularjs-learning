"use strict";
APP.SERVICES.service('keyPopulationReportService', keyPopulationReportService);
keyPopulationReportService.$inject = ['Report','bootstrapTable','$rootScope'];
function keyPopulationReportService(Report,bootstrapTable,$rootScope) {
    var vm = this;

    vm.getAllDiabetesData = function (param, successFunction, failedFunction) {
        Report.getAllDiabetesData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getGlucoseAndWarningData = function (param, successFunction, failedFunction) {
        Report.getGlucoseAndWarningData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getHBPGlucoseAndWarningData = function (param, successFunction, failedFunction) {
        Report.getHBPGlucoseAndWarningData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getPerMonthDiabetesData = function (param, successFunction, failedFunction) {
        Report.getPerMonthDiabetesData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getAllHypertensionData = function (param, successFunction, failedFunction) {
        Report.getAllHypertensionData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getSysDate = function (param, successFunction, failedFunction) {
        Report.getSysDate(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getPerMonthHypertensionData = function (param, successFunction, failedFunction) {
        Report.getPerMonthHypertensionData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getMoreGlucoseAndWarningData = function (param, successFunction, failedFunction) {
        Report.getMoreGlucoseAndWarningData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getMoreHBPGlucoseAndWarningData = function (param, successFunction, failedFunction) {
        Report.getMoreHBPGlucoseAndWarningData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getMoreODPDistributionData = function (param, successFunction, failedFunction) {
        Report.getMoreODPDistributionData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getMoreOHPDistributionData = function (param, successFunction, failedFunction) {
        Report.getMoreOHPDistributionData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };
    
    vm.getPageGlucoseAndWarningData = function ($vm, listPara) {
        var list = {
            dataFunction: getDataList,
            dataParams: listPara,
            columns: [{
                field: 'ORGANIZATION_NAME',
                title: '机构名称',
                align: 'center'
            }, {
                field: 'STABLE_COUNT',
                title: '血糖稳定人数',
                align: 'center'
            }, {
                field: 'UNSTABLE_COUNT',
                title: '血糖预警人数',
                align: 'center'
            }, {
                field: 'DIABETES_PERSENT',
                title: '预警比例',
                align: 'center',
                sortable:true,
                formatter:function (value,row) {
                    if(row.STABLE_COUNT===0 && row.UNSTABLE_COUNT===0){
                        return '-';
                    }
                    return (row.UNSTABLE_COUNT*100/(row.STABLE_COUNT+row.UNSTABLE_COUNT)).toFixed(2)+'%';
                }
            }]
        };

        function getDataList(param, successFunction, failedFunction) {
            Report.getPageGlucoseAndWarningData(JSON.stringify(param)).$promise
                .then(function (res) {
                    $rootScope.handleMessage(res, function () {
                        successFunction(res.value || {total: 0, rows: []});
                    }, function () {
                        $rootScope.alertDialog("获取列表信息失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                    failedFunction();
                });
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
    };

    vm.getPageHBPGlucoseAndWarningData = function ($vm, listPara) {
        var list = {
            dataFunction: getDataList,
            dataParams: listPara,
            columns: [{
                field: 'ORGANIZATION_NAME',
                title: '地区',
                align: 'center'
            }, {
                field: 'STABLE_COUNT',
                title: '稳定人数',
                align: 'center'
            }, {
                field: 'UNSTABLE_COUNT',
                title: '预警人数',
                align: 'center'
            }, {
                field: 'HYPERTENSION_PERSENT',
                title: '预警比例',
                align: 'center',
                sortable:true,
                formatter:function (value,row) {
                    if(row.STABLE_COUNT===0 && row.UNSTABLE_COUNT===0){
                        return '-';
                    }
                    return (row.UNSTABLE_COUNT*100/(row.STABLE_COUNT+row.UNSTABLE_COUNT)).toFixed(2)+'%';
                }
            }]
        };

        function getDataList(param, successFunction, failedFunction) {
            Report.getPageHBPGlucoseAndWarningData(JSON.stringify(param)).$promise
                .then(function (res) {
                    $rootScope.handleMessage(res, function () {
                        successFunction(res.value || {total: 0, rows: []});
                    }, function () {
                        $rootScope.alertDialog("获取列表信息失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                    failedFunction();
                });
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
    };

    vm.getPageODPDistributionData=function ($vm, listPara) {
        var list = {
            dataFunction: getDataList,
            dataParams: listPara,
            columns: [{
                field: 'ORGANIZATION_NAME',
                title: '地区',
                align: 'center'
            }, {
                field: 'SUB_DIABETES_TOTAL',
                title: '人群数',
                align: 'center'
            }, {
                field: 'DIABETES_PERSENT',
                title: '所占比例',
                align: 'center',
                sortable:true,
                formatter:function (value) {
                    if(value){
                        return value+'%';
                    }
                    return "-";
                }
            }]
        };

        function getDataList(param, successFunction, failedFunction) {
            Report.getPageODPDistributionData(JSON.stringify(param)).$promise
                .then(function (res) {
                    $rootScope.handleMessage(res, function () {
                        successFunction(res.value || {total: 0, rows: []});
                    }, function () {
                        $rootScope.alertDialog("获取列表信息失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                    failedFunction();
                });
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
    };

    vm.getPageOHPDistributionData=function ($vm, listPara) {
        var list = {
            dataFunction: getDataList,
            dataParams: listPara,
            columns: [{
                field: 'ORGANIZATION_NAME',
                title: '地区',
                align: 'center'
            }, {
                field: 'SUB_HYPERTENSION_TOTAL',
                title: '人群数',
                align: 'center'
            }, {
                field: 'HYPERTENSION_PERSENT',
                title: '所占比例',
                align: 'center',
                sortable:true,
                formatter:function (value) {
                    if(value){
                        return value+'%';
                    }
                    return "-";
                }
            }]
        };

        function getDataList(param, successFunction, failedFunction) {
            Report.getPageOHPDistributionData(JSON.stringify(param)).$promise
                .then(function (res) {
                    $rootScope.handleMessage(res, function () {
                        successFunction(res.value || {total: 0, rows: []});
                    }, function () {
                        $rootScope.alertDialog("获取列表信息失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                    failedFunction();
                });
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
    };

    return vm;
}