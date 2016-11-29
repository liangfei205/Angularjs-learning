"use strict";
APP.CONTROLLERS.controller('userAddCtrl', userAddCtrl);
userAddCtrl.$inject = ['$rootScope', '$state', 'userService'];
function userAddCtrl($rootScope, $state, userService) {
    var vm = this;

    //控制显示隐藏和判断
    vm.add = true;
    vm.editable = true;
    vm.canClearPassword = false;

    userService.getAllAccountRole(
        {
            "IS_LIMIT_AUTHORITY": 0
        },
        function (response) {
            $rootScope.handleMessage(
                response,
                function (data) {
                    vm.items = data;
                },
                function () {
                    $rootScope.alertDialog('获取角色失败');
                }
            );
        },
        function () {
            $rootScope.alertDialog('获取角色失败');
        });
    vm.selected = [];
    vm.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    vm.toggle = function (item, list) {
        var idx = list.indexOf(item.ROLE_KEY_ID);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item.ROLE_KEY_ID);
        }
    };

    //用户名查重
    vm.checkUserNameDuplicate = function () {
        userService.checkUserNameDuplicate(
            {
                "USER_KEY_ID": '',
                "USER_NAME": vm.clientName
            },
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function (data) {
                        if (data) {
                            $rootScope.alertDialog('用户名重复');
                            vm.clientName = '';
                        }
                    },
                    function () {
                        $rootScope.alertDialog('用户名查重失败');
                    }
                );
            },
            function () {
                $rootScope.alertDialog('用户名查重失败');
            }
        );
    };

    //密码
    vm.clearPassword = function () {
        if (vm.editable) {
            vm.password = '';
        }
    };

    //邮箱
    vm.email = '';
    vm.searchTerm;
    vm.clearSearchTerm = function () {
    };
    vm.getSearchTerm = function () {
        if(vm.selectedOrganization !== undefined){
            vm.searchTerm = vm.selectedOrganization.ORGANIZATION_NAME;
            vm.searchTermChange();
        }
    };
    angular.element('input[name="organization"]').on('keydown', function (ev) {
        ev.stopPropagation();
    });
    vm.searchTermChange = function () {
        if (vm.searchTerm !== '' && vm.searchTerm !== undefined) {
            vm.getOrganizationList();
        }
    };

    //是否启用
    vm.selectState = 1;

    //保存
    vm.createNewUser = function (form) {
        if (!$rootScope.check(form)) {
            return;
        }

        var roleList = [];
        angular.forEach(vm.selected, function (item) {
            roleList.push({
                "ROLE_KEY_ID": item
            });
        });
        var params = {
            "ACCOUNT": vm.clientName,
            "USER_NAME": vm.clientName,
            "PASSWORD": vm.password,
            "USER_MAILBOX": vm.email,
            "IS_ONLINE": vm.selectState,
            "ROLE_LIST": roleList
        };
        userService.createNewUser(
            params,
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function () {
                        $state.go('main.baseData.userList');
                    },
                    function () {
                        $rootScope.alertDialog('创建用户失败');
                    }
                );
            },
            function () {
                $rootScope.alertDialog('创建用户失败');
            }
        );
    };
    //取消
    vm.cancel = function () {
        $rootScope.confirmDialog(
            '确定放弃已填数据?',
            function () {
                $state.go('main.baseData.userList');
            },
            function () {

            }
        );
    };
    return vm;
}