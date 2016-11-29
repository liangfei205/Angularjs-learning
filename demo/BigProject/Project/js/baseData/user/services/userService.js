"use strict";
APP.SERVICES.service('userService', userService);
userService.$inject = ['$rootScope', '$state', 'User', 'bootstrapTable'];
function userService($rootScope, $state, User, bootstrapTable) {
    var vm = this;
    vm.getAllAccountRole = function (params, successFunction, failedFunction) {
        return User.getAllAccountRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.checkUserNameDuplicate = function (params, successFunction, failedFunction) {
        return User.checkUserNameDuplicate(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.createNewUser = function (params, successFunction, failedFunction) {
        return User.createNewUser(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getUserList = function (params, successFunction, failedFunction) {
        return User.getUserList(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getUserInfoByKeyId = function (params, successFunction, failedFunction) {
        return User.getUserInfoByKeyId(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.deleteUser = function (params, successFunction, failedFunction) {
        return User.deleteUser(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.editUser = function (params, successFunction, failedFunction) {
        return User.editUser(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.merge = function (arr1, arr2) {
        var arr3 = [], arr4 = [];
        arr3 = arr3.concat(arr1, arr2);
        angular.forEach(arr3, function (value) {
            if (isNotContains(arr4, value) || arr4.length === 0) {
                arr4.push(value);
            }
        });
        function isNotContains(arr4, value) {
            var b = true;
            angular.forEach(arr4, function (item) {
                if (item['ORGANIZATION_KEY_ID'] === value['ORGANIZATION_KEY_ID']
                    || item['ORGANIZATION_NAME'] === value['ORGANIZATION_NAME']) {
                    b = false;
                    return false;
                }
            });
            return b;
        }

        return arr4;
    };

    vm.showTable = function ($vm, params, $state) {
        var list = {
            dataFunction: ajaxRequest,
            dataParams: params,
            columns: [{
                field: 'ACCOUNT',
                title: '用户名',
                align: 'center',
                valign: 'middle',
                width: 248,
                formatter: accountFormat,
                events: {
                    'click .flag': function (e, value, row) {
                        $state.go('main.baseData.userEdit', {"USER_KEY_ID": row.USER_KEY_ID});
                    }
                }
            }, {
                field: 'USER_ROLE',
                title: '用户所属角色',
                width: 288,
                align: 'center',
                valign: 'middle',
                formatter: userRoleFormatter
            }, {
                field: 'USER_MAILBOX',
                title: '用户邮箱',
                align: 'center',
                width: 198,
                valign: 'middle'
            }, {
                field: 'IS_ONLINE',
                title: '是否上线',
                width: 168,
                align: 'center',
                valign: 'middle',
                formatter: isOnlineFormatter
            }]
        };
        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };

        function accountFormat(value) {
            return '<div class="flag" style="color: #428bca;">' + value + '</div>';
        }

        function userRoleFormatter(value) {
            var htmlArr = [];
            for (var i = 0; i < value.length; i++) {
                htmlArr.push('<div>' + value[i].ROLE_NAME + '</div>');
            }
            return htmlArr.join('');
        }

        function isOnlineFormatter(value) {
            return value === 1 ? '是' : '否';
        }

        return $vm;
    };

    function ajaxRequest(params, successFunction, failedFunction) {
        User.getUserList(JSON.stringify(params)).$promise
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

    vm.isEmptyObject = function (obj) {
        for (var n in obj) {
            return false
        }
        return true;
    };

    vm.validJudge = function (form, roleList, organization_key_id, failedTip) {
        if (roleList.length === 0) {
            failedTip('请选择至少一个账号角色');
            return false;
        }
        if (!vm.isEmptyObject(form.clientName.$error)) {
            if (form.clientName.$error.required) {
                failedTip('用户名不能为空');
            } else {
                failedTip('用户名不符合规则');
            }
            return false;
        }
        if (!vm.isEmptyObject(form.password.$error)) {
            if (form.password.$error.required) {
                failedTip('账号密码不能为空');
            } else {
                failedTip('账号密码不符合规则');
            }
            return false;
        }
        if (!vm.isEmptyObject(form.email.$error)) {
            if (form.email.$error) {
                failedTip('账号邮箱不符合规则');
            }
            return false;
        }
        return true;
    };

    vm.downloadUserList = function (params, successFunction, failedFunction) {
        return User.downloadUserList(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    return vm;
}