"use strict";
APP.CONTROLLERS.controller('roleEditCtrl', roleEditCtrl);
roleEditCtrl.$inject = ['$rootScope', '$state', 'roleService'];
function roleEditCtrl($rootScope, $state, roleService) {
    var vm = this;
    //控制显示隐藏和判断
    vm.edit = true;
    vm.editable = false;
    var OLD_ROLE_NAME;
    var old_items = [];
    //赋值
    vm.ROLE_NAME = $state.params.ROLE_NAME;
    roleService.getJurisdictionsOfRole(
        {
            "ROLE_KEY_ID": $state.params.ROLE_KEY_ID
        },
        function (response) {
            $rootScope.handleMessage(
                response,
                function (data) {
                    vm.items = data;
                },
                function () {
                    $rootScope.alertDialog("查询角色数据失败");
                }
            );
        },
        function () {
            $rootScope.alertDialog("查询角色数据失败");
        }
    );
    //初始化list和下标list
    roleService.initJurisdictionList();
    vm.toggle = function (item1, itme2, itme3) {
        roleService.toggle(item1, itme2, itme3);
    };
    vm.edit = function () {
        OLD_ROLE_NAME = angular.copy(vm.ROLE_NAME);
        old_items = angular.copy(vm.items);
        vm.editable = true;
    };
    //更新角色
    vm.createNewRole = function (form) {
        if (!$rootScope.check(form)) {
            return;
        }

        if (!vm.isSelectOne(vm.items)) {
            $rootScope.alertDialog("请至少选择一项功能");
            return;
        }
        var params = {
            "ROLE_KEY_ID": $state.params.ROLE_KEY_ID,
            "ROLE_NAME": vm.ROLE_NAME,
            "JURISDICTION_LIST": roleService.getJurisdictionList()
        };
        roleService.updateRole(
            params,
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function () {
                        vm.editable = false;
                        roleService.initJurisdictionList();
                    },
                    function () {
                        $rootScope.alertDialog('更新角色失败');
                    }
                );
            },
            function () {
                $rootScope.alertDialog('更新角色失败');
            }
        );
    };
    //删除角色
    vm.deleteRole = function () {
        roleService.checkUser(
            {
                "ROLE_KEY_ID": $state.params.ROLE_KEY_ID
            },
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function () {
                        $rootScope.confirmDialog(
                            '是否确定删除该角色？',
                            function () {
                                roleService.deleteRole(
                                    {
                                        "ROLE_KEY_ID": $state.params.ROLE_KEY_ID
                                    },
                                    function (response) {
                                        $rootScope.handleMessage(
                                            response,
                                            function () {
                                                $state.go('main.baseData.roleList');
                                            },
                                            function (response) {
                                                $rootScope.alertDialog(response.message);
                                            }
                                        );
                                    },
                                    function () {
                                        $rootScope.alertDialog('删除角色失败');
                                    }
                                );
                            },
                            function () {

                            }
                        );
                    },
                    function () {
                        $rootScope.alertDialog('查询用户是否关联角色失败');
                    }
                );
            },
            function () {
                $rootScope.alertDialog('查询用户是否关联角色失败');
            }
        );
    };
    //取消
    vm.cancel = function () {
        if (OLD_ROLE_NAME !== vm.ROLE_NAME || roleService.getJurisdictionList().length > 0) {
            $rootScope.confirmDialog(
                '您确定要放弃保存吗?',
                function () {
                    resetData();
                    vm.editable = false;
                },
                function () {

                }
            );
        } else {
            vm.editable = false;
        }
        function resetData() {
            vm.ROLE_NAME = OLD_ROLE_NAME;
            vm.items = old_items;
            roleService.initJurisdictionList();
        }
    };
    //返回
    vm.goBack = function () {
        $state.go('main.baseData.roleList');
    };
    //判断至少选择一个功能
    vm.isSelectOne = function (list) {
        return roleService.isSelectOne(list);
    };
    return vm;
}