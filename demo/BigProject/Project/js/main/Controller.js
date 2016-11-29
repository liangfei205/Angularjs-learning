"use strict";
APP.CONTROLLERS.controller('Controller', Controller);
Controller.$inject = ['$rootScope', '$state', '$filter', '$location', '$anchorScroll', '$mdDialog', '$mdToast', 'SessionStorage', 'Common', 'ENV'];
function Controller($rootScope, $state, $filter, $location, $anchorScroll, $mdDialog, $mdToast, SessionStorage, Common, ENV) {
    var vm = this;
    //处理后端返回的数据
    $rootScope.handleMessage = function (response, successFunction, failedFunction) {
        if (response.success) {
            successFunction(response.value);
        } else {
            if (response['errCode'] && response['message']) {
                console.info("errCode:" + response['errCode'] + "," + response['message'] + ".");
            } else if (response['errCode']) {
                console.info("errCode:" + response['errCode'] + ".");
            } else {
                console.info(response['message'] + ".");
            }
            failedFunction(response);
        }
    };
    //判断权限
    $rootScope.isShow = function (JURISDICTION_CODE) {
        var b = true;
        if (ENV.runMode !== 'debug') {
            b = false;
            var loginInfo = SessionStorage.get('loginInfo');
            if (loginInfo
                && loginInfo['authorities']
                && loginInfo['authorities'].length > 0) {
                angular.forEach(loginInfo['authorities'], function (item) {
                    if (item['jurisdictionCode'] === JURISDICTION_CODE) {
                        b = true;
                        return false;
                    }
                });
            }
        }
        return b;
    };
    //判断页面权限
    $rootScope.checkAuth = function (url) {
        if (ENV.runMode === 'debug') {
            return true;
        }
        var urlNew='/'+url.replace(/\./g,'/');//将路径中所有的.替换为斜杠
        var loginInfo = SessionStorage.get('loginInfo');
        for(var i=0;i<loginInfo.resources.length;i++){
            if(loginInfo.resources[i].resourcePath===urlNew){
                return true;
            }
            if(loginInfo.resources[i].hcrmGpDetailResource) {
                for (var j = 0; j < loginInfo.resources[i].hcrmGpDetailResource.length; j++) {
                    if(loginInfo.resources[i].hcrmGpDetailResource[j].resourcePath===urlNew){
                        return true;
                    }
                }
            }
        }
        return false;
    };
    $rootScope.isContains=function(str, substr) {
        return str.indexOf(substr) >= 0;
    };
    //判断是否是detail页面
    $rootScope.isDetailView = function () {
        return $state.current.name.indexOf('detail') !== -1;
    };
    $rootScope.isEmptyObject = function (obj) {
        for (var n in obj) {
            return false
        }
        return true;
    };
    //查询list中是否包含某个字段为key属性为value的对象,返回index
    $rootScope.selectIndex = function (list, key, value) {
        var index = -1, l = list.length;
        for (var i = 0; i < l; i++) {
            if (list[i][key] === value) {
                index = i;
                return index;
            }
        }
        return index;
    };
    //查询list中是否包含某个字段为key值为value的对象,返回item
    $rootScope.selectItem = function (list, key, value) {
        var l = list.length;
        for (var i = 0; i < l; i++) {
            if (list[i][key] === value) {
                return list[i];
            }
        }
        return undefined;
    };
    //根据value删除数组中的值
    $rootScope.removeByValue=function(arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    };
    //弹出提示
    $rootScope.alertDialog = function (text) {
        return $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('提示')
                .textContent(text)
                .ok('确定')
        );
    };
    //弹出提示
    $rootScope.confirmDialog = function (text, successFunction, failedFunction) {
        var confirm = $mdDialog.confirm()
            .title('提示')
            .textContent(text)
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(successFunction, failedFunction);
    };
    $rootScope.showToast = function (message, vertical, horizonal, actionText, theme) {
        var position = {
            vertical: vertical || 'v-center',
            horizonal: horizonal || 'h-center'
        };
        var toast = $mdToast.simple()
            .textContent(message)
            .action(actionText)
            .hideDelay(1500)
            .theme(theme)
            .position(position.vertical + ' ' + position.horizonal);
        $mdToast.show(toast);
    };
    //获取服务器当前时间
    //日期格式 2016-08-08
    $rootScope.getCurrentDate = function (successFunction) {
        return $rootScope.getCurrentTime(function (data) {
            successFunction($filter('commonDate')(data));
        });
    };
    //new Date 格式
    $rootScope.getCurrentDateTime = function (successFunction) {
        return $rootScope.getCurrentTime(function (data) {
            successFunction(new Date(data));
        });
    };
    //时间戳格式 1475130600000
    $rootScope.getCurrentTime = function (successFunction) {
        Common.getCurrentTime({}).$promise.then(
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function (data) {
                        successFunction(data);
                    },
                    function () {
                        $rootScope.alertDialog("获取服务器时间失败");
                    }
                )
            },
            function () {
                $rootScope.alertDialog("获取服务器时间失败");
            }
        );
    };
    //调用公共的service方法
    $rootScope.commonService = function (functionName, params, successFunction, failedFunction) {
        return Common[functionName](JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    //高血压评估
    $rootScope.calculateHypertensionEvaluation = function (params) {
        var bloodPressureGradingList = ['0028000010', '0028000020', '0028000030', '0028000040', '0028000050'];
        var gradingManagementList = ['0029000010', '0029000020', '0029000030', '0029000040', '0029000050'];
        var criticalityGradingList = ['0030000010', '0030000020', '0030000030', '0030000040'];

        var riskFactorsCount = 0;
        var bloodPressureGradingCount;
        var criticalityGradingCount;
        var gradingManagementCount;
        //计算血压分级
        function bloodPressureGrading(SYSTOLIC_PRESSURE, DIASTOLIC_PRESSURE) {
            //血压正常：收缩压<120且舒张压<80
            //血压偏高：收缩压120-139或舒张压80-89
            //1级高血压：收缩压140-159或舒张压90-99
            //2级高血压：收缩压160～179或舒张压100～109
            //3级高血压：收缩压>=180或舒张压>=110
            if (SYSTOLIC_PRESSURE >= 180 || DIASTOLIC_PRESSURE >= 110) {
                bloodPressureGradingCount = bloodPressureGradingList[4];
            } else if ((SYSTOLIC_PRESSURE >= 160 && SYSTOLIC_PRESSURE <= 179) || (DIASTOLIC_PRESSURE >= 100 && DIASTOLIC_PRESSURE <= 109)) {
                bloodPressureGradingCount = bloodPressureGradingList[3];
            } else if ((SYSTOLIC_PRESSURE >= 140 && SYSTOLIC_PRESSURE <= 159) || (DIASTOLIC_PRESSURE >= 90 && DIASTOLIC_PRESSURE <= 99)) {
                bloodPressureGradingCount = bloodPressureGradingList[2];
            } else if ((SYSTOLIC_PRESSURE >= 120 && SYSTOLIC_PRESSURE <= 139) || (DIASTOLIC_PRESSURE >= 80 && DIASTOLIC_PRESSURE <= 89)) {
                bloodPressureGradingCount = bloodPressureGradingList[1];
            } else if (SYSTOLIC_PRESSURE < 120 && DIASTOLIC_PRESSURE < 80) {
                bloodPressureGradingCount = bloodPressureGradingList[0];
            }
        }

        //统计危险因素个数,[心血管病危险因素、靶器官损害、并存相关疾病]三个多选字段中选中的选项数目之和
        function riskFactors(array) {
            angular.forEach(array, function (item) {
                riskFactorsCount += item;
            });
        }

        //计算危险程度分层和分级管理
        function criticalityGradingAndGradingManagement() {
            //一般人群，无危险：血压正常或(血压偏高&0危险因素)
            //高危人群，无危险：血压偏高&>=1危险因素
            //一级管理，低危：1级高血压&0危险因素
            //二级管理，中危：(2级高血压&0-2个危险因素)或(1级高血压&1-2个危险因素)
            //三级管理，高危：3级高血压或(2级高血压&>2个危险因素)或(1级高血压&>2个危险因素)
            if (bloodPressureGradingCount === bloodPressureGradingList[0]
                || (bloodPressureGradingCount === bloodPressureGradingList[1] && riskFactorsCount === 0)) {
                criticalityGradingCount = criticalityGradingList[0];
                gradingManagementCount = gradingManagementList[0];
            } else if (bloodPressureGradingCount === bloodPressureGradingList[1] && riskFactorsCount >= 1) {
                criticalityGradingCount = criticalityGradingList[0];
                gradingManagementCount = gradingManagementList[1];
            } else if (bloodPressureGradingCount === bloodPressureGradingList[2] && riskFactorsCount === 0) {
                criticalityGradingCount = criticalityGradingList[1];
                gradingManagementCount = gradingManagementList[2];
            } else if ((bloodPressureGradingCount === bloodPressureGradingList[3] && (riskFactorsCount >= 0 && riskFactorsCount <= 2))
                || (bloodPressureGradingCount === bloodPressureGradingList[2] && (riskFactorsCount >= 1 && riskFactorsCount <= 2))) {
                criticalityGradingCount = criticalityGradingList[2];
                gradingManagementCount = gradingManagementList[3];
            } else if (bloodPressureGradingCount === bloodPressureGradingList[4]
                || (bloodPressureGradingCount === bloodPressureGradingList[3] && riskFactorsCount >= 3)
                || (bloodPressureGradingCount === bloodPressureGradingList[2] && riskFactorsCount >= 3)) {
                criticalityGradingCount = criticalityGradingList[3];
                gradingManagementCount = gradingManagementList[4];
            }
        }

        bloodPressureGrading(params['SYSTOLIC_PRESSURE'], params['DIASTOLIC_PRESSURE']);
        riskFactors(params['lengthArray']);
        criticalityGradingAndGradingManagement();
        return {
            "bloodPressureGradingCount": bloodPressureGradingCount,
            "criticalityGradingCount": criticalityGradingCount,
            "gradingManagementCount": gradingManagementCount
        };
    };
    //判断是否超级管理员
    $rootScope.isSuperManager = function () {
        if (SessionStorage.get('loginInfo').organizationKeyId) {
            return false;
        }
        return true;
    };

    //提交前校验表单
    $rootScope.check = function (form) {
        function checkSubForm(form){
            if (form.$invalid) {
                for (var s in form) {
                    if (form[s]!==undefined && form[s].$invalid!==undefined && form[s].$invalid) {
                        var name = form[s].$name;
                        //判断子表单
                        if (form[s]['$$renameControl'] && s !== '$$parentForm') {
                            if (checkSubForm(form[s])) {
                                continue;
                            } else {
                                return false;
                            }
                        }
                        if(s === '$$parentForm'){
                            continue;
                        }
                        //前提id和name相同，以便通过id跳转锚点
                        var element = document.querySelector('#' + name);
                        $rootScope.scrollTo(name);
                        if (element.tagName === 'INPUT' || element.tagName === 'MD-SELECT' || element.tagName === 'MD-DATEPICKER' || element.tagName === 'TEXTAREA') {
                            form[name].$setTouched(true);
                        } else {
                            $rootScope.alertDialog('请选择相应的选项');
                        }
                        break;
                    }
                }
                return false;
            } else {
                return true;
            }
        }
        return checkSubForm(form);
    };

    //锚点跳转
    $rootScope.scrollTo = function (target) {
        $location.hash(target);
        $anchorScroll();
    };

    function watchEvent() {

        window.onscroll = function () {
            if (document.getElementsByTagName("md-sidenav").length === 0) {
                return;
            }
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            var left = document.getElementsByTagName("md-sidenav")[0].offsetLeft;
            if (top > 204) {
                for (var i = 0; i < document.getElementsByTagName('md-sidenav').length; i++) {
                    document.getElementsByClassName("sidenavDiv")[i].style.display = 'block';
                    document.getElementsByTagName('md-sidenav')[i].style.position = 'fixed';
                    document.getElementsByTagName('md-sidenav')[i].style.top = '0';
                    document.getElementsByTagName('md-sidenav')[i].style.marginTop = '0';
                    document.getElementsByTagName('md-sidenav')[i].style.left = (left + 300 * i) + "px";
                }
            } else {
                for (var i = 0; i < document.getElementsByTagName('md-sidenav').length; i++) {
                    document.getElementsByClassName("sidenavDiv")[i].style.display = 'none';
                    document.getElementsByTagName("md-sidenav")[i].removeAttribute('style');
                }
            }
        };
    }
    watchEvent();

    return vm;
}
