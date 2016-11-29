"use strict";
APP.SERVICES.service('roleService', roleService);
roleService.$inject = ['$rootScope', 'Role', 'bootstrapTable'];
function roleService($rootScope, Role, bootstrapTable) {
    var vm = this;
    vm.getJurisdictionsOfRole = function (params, successFunction, failedFunction) {
        return Role.getJurisdictionsOfRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.createRole = function (params, successFunction, failedFunction) {
        return Role.createRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.updateRole = function (params, successFunction, failedFunction) {
        return Role.updateRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.deleteRole = function (params, successFunction, failedFunction) {
        return Role.deleteRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.checkUser = function (params, successFunction, failedFunction) {
        return Role.checkUser(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    //用户缓存记录
    vm.JURISDICTION_LIST = [];
    vm.JURISDICTION_LIST_INDEX = [];
    vm.initJurisdictionList = function () {
        vm.JURISDICTION_LIST = [];
        vm.JURISDICTION_LIST_INDEX = [];
    };
    vm.getJurisdictionList = function () {
        return vm.JURISDICTION_LIST;
    };
    //绑定按钮点击
    vm.toggle = function (item, item2, item3) {
        if (item['IS_SELECT'] === "1"
            || item['IS_SELECT'] === 1) {
            item['IS_SELECT'] = '0';
            //从1到0的查询子元素
            vm.joinList(item);
            vm.cancelSubList(item);
        } else if (item['IS_SELECT'] === "0"
            || item['IS_SELECT'] === 0
            || item['IS_SELECT'] === undefined) {
            item['IS_SELECT'] = '1';
            //从0到1的查询父元素
            vm.joinList(item);
            if (item2 && (item2['IS_SELECT'] === "0"
                || item2['IS_SELECT'] === 0
                || item2['IS_SELECT'] === undefined)) {
                item2['IS_SELECT'] = '1';
                vm.joinList(item2);
                if (item3 && (item3['IS_SELECT'] === "0"
                    || item3['IS_SELECT'] === 0
                    || item3['IS_SELECT'] === undefined)) {
                    item3['IS_SELECT'] = '1';
                    vm.joinList(item3);
                }
            }
        }
    };
    //取消子元素选中状态
    vm.cancelSubList = function (item) {
        if (item['SUBLIST'] && item['SUBLIST'].length > 0) {
            angular.forEach(item['SUBLIST'], function (value) {
                if (value['IS_SELECT'] === "1"
                    || value['IS_SELECT'] === 1) {
                    value['IS_SELECT'] = '0';
                    vm.joinList(value);
                    vm.cancelSubList(value);
                }
            });
        }
    };
    //插入和更新用户点击过的数据
    vm.joinList = function (item) {
        //查询存在不存在
        var INDEX = vm.JURISDICTION_LIST_INDEX.indexOf(item["JURISDICTION_KEY_ID"]);
        //不存在就插入，存在就更新
        if (INDEX === -1) {
            vm.JURISDICTION_LIST_INDEX.push(item["JURISDICTION_KEY_ID"]);
            vm.JURISDICTION_LIST.push({
                "VALUE": item["JURISDICTION_KEY_ID"],
                "IS_SELECT": item["IS_SELECT"]
            });
        } else {
            vm.JURISDICTION_LIST[INDEX]['IS_SELECT'] = item['IS_SELECT'];
        }
    };
    //判断至少选择一个功能
    vm.isSelectOne = function (list) {
        var b = false;
        angular.forEach(list, function (item) {
            if (item['IS_SELECT'] === "1" || item['IS_SELECT'] === 1) {
                //查询是否有子节点
                if (item['SUBLIST'] && item['SUBLIST'].length > 0) {//若有检查子列表
                    //如果子列表为true
                    if (vm.isSelectOne(item['SUBLIST'])) {
                        b = true;
                        return false;
                    }
                } else {//若没有则返回 true
                    b = true;
                    return false;
                }
            }
        });
        return b;
    };
    function ajaxRequest(params, successFunction, failedFunction) {
        Role.getRoleList(JSON.stringify(params)).$promise
            .then(function (response) {
                $rootScope.handleMessage(response, function () {
                    successFunction(response.value || {total: 0, rows: []});
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                });
            }, function () {
                $rootScope.alertDialog("获取列表信息失败");
                failedFunction();
            });
    }

    vm.showTable = function ($vm, params, $state) {
        var list = {
            dataFunction: ajaxRequest,
            dataParams: params,
            columns: [{
                field: 'ROLE_NAME',
                title: '角色名称',
                align: 'center',
                width: 298,
                valign: 'middle',
                formatter: roleFormat,
                events: {
                    'click .flag': function (e, value, row) {
                        $state.go('main.baseData.roleEdit',
                            {
                                "ROLE_KEY_ID": row.ROLE_KEY_ID,
                                "ROLE_NAME": row.ROLE_NAME
                            });
                    }
                }
            }, {
                field: 'JURISDICTION_NAME',
                title: '拥有功能权限',
                align: 'center',
                width: 902,
                valign: 'middle'
            }]
        };

        function roleFormat(value) {
            return '<div class="flag" style="color: #428bca;cursor:pointer;">' + value + '</div>';
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
        return $vm;
    };
    return vm;
}