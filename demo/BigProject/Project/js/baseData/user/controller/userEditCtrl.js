"use strict";
APP.CONTROLLERS.controller('userEditCtrl', userEditCtrl);
userEditCtrl.$inject = ['$rootScope', '$state', '$mdDialog', '$stateParams', 'userService'];
function userEditCtrl($rootScope, $state, $mdDialog, $stateParams, userService) {
    var vm = this;

    //控制显示隐藏和判断
    vm.edit = true;
    vm.editable = false;
    vm.canClearPassword = true;

    vm.edit = function () {
        vm.editable = true;
    };

    vm.USER_KEY_ID = $stateParams.USER_KEY_ID;
    // 获取角色
    userService.getAllAccountRole(
        {
            "IS_LIMIT_AUTHORITY": 0
        },
        function (response) {
            $rootScope.handleMessage(
                response,
                function (data) {
                    vm.items = data;
                    getUserInfoByKeyId();
                },
                function () {
                    $rootScope.alertDialog('获取角色失败');
                }
            );
        },
        function () {
            $rootScope.alertDialog('获取角色失败');
        }
    );

    //获取详细信息
    function getUserInfoByKeyId() {
        userService.getUserInfoByKeyId(
            {
                "USER_KEY_ID": vm.USER_KEY_ID
            },
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function (data) {
                        vm.userInfo = data;
                        vm.dealData(vm.userInfo);
                    },
                    function () {
                        $rootScope.alertDialog('获取用户信息失败');
                    }
                );
            },
            function () {
                $rootScope.alertDialog('获取用户信息失败');
            }
        );
    }

    //处理数据
    vm.dealData = function (data) {
        //角色处理
        vm.originalUserRoleArr = data.USER_ROLE;
        vm.selected = [];
        angular.forEach(vm.originalUserRoleArr, function (item) {
            vm.selected.push(item.ROLE_KEY_ID);
        });
        //用户名
        vm.clientName = data.ACCOUNT;
        //邮箱
        vm.email = data.USER_MAILBOX;
        vm.searchTerm = data.ORGANIZATION_NAME;
        vm.selectedOrganization = vm.originalOrganization;
        //是否启用
        vm.selectState = data.IS_ONLINE;
    };

    vm.items = [];
    vm.selected = [];
    vm.originalUserRoleArr = [];
    vm.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    vm.toggle = function (item, list) {
        if (!vm.editable) {
            return;
        }
        var idx = list.indexOf(item.ROLE_KEY_ID);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item.ROLE_KEY_ID);
        }
    };

    //用户名
    vm.clientName = '';
    vm.checkUserNameDuplicate = function () {
        if (vm.clientName === vm.userInfo.ACCOUNT) {
            return;
        }
        userService.checkUserNameDuplicate(
            {
                "USER_KEY_ID": vm.USER_KEY_ID,
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
    vm.defaultPassword = '12345678';
    vm.password = vm.defaultPassword;
    vm.clearPassword = function () {
        if (vm.editable && vm.canClearPassword) {
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
            "USER_KEY_ID": vm.USER_KEY_ID,
            "ACCOUNT": vm.clientName,
            "USER_NAME": vm.clientName,
            "USER_MAILBOX": vm.email,
            "IS_ONLINE": vm.selectState,
            "ROLE_LIST": roleList
        };
        if (vm.password !== vm.defaultPassword) {
            params.PASSWORD = vm.password;
        }
        userService.editUser(
            params,
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function () {
                        vm.editable = false;
                        getUserInfoByKeyId();
                        vm.defaultPassword = '12345678';
                        vm.password = vm.defaultPassword;
                    },
                    function () {
                        $rootScope.alertDialog('保存失败');
                    }
                );
            },
            function () {
                $rootScope.alertDialog('保存失败');
            }
        );
    };
    //取消
    vm.cancel = function () {
        var confirm = $mdDialog.confirm()
            .title('提示')
            .textContent('是否丢弃已编辑信息？')
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(function () {
            vm.dealData(vm.userInfo);
            vm.password = vm.defaultPassword;
            vm.editable = !vm.editable;
        }, function () {
            return;
        });
    };
    //删除用户
    vm.deleteUser = function () {
        var confirm = $mdDialog.confirm()
            .title('提示')
            .textContent('是否确定删除该用户？')
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(function () {
            userService.deleteUser(
                {
                    "USER_KEY_ID": vm.USER_KEY_ID
                },
                function (response) {
                    $rootScope.handleMessage(
                        response,
                        function () {
                            $state.go('main.baseData.userList');
                        },
                        function () {
                            $rootScope.alertDialog('删除用户失败');
                        }
                    );
                },
                function () {
                    $rootScope.alertDialog('删除用户失败');
                }
            );
        }, function () {
            return;
        });
    };
    //返回
    vm.goBack = function () {
        $state.go('main.baseData.userList');
    };
    return vm;
}