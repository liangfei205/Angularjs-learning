"use strict";
APP.CONTROLLERS.controller('roleAddCtrl', roleAddCtrl);
roleAddCtrl.$inject = ['$rootScope', '$state', 'roleService'];
function roleAddCtrl($rootScope, $state, roleService) {
    var vm = this;
    //控制显示隐藏和判断
    vm.add = true;
    vm.editable = true;
    roleService.getJurisdictionsOfRole(
        {},
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
    vm.createNewRole = function (form) {
        if (!$rootScope.check(form)) {
            return;
        }

        if (!vm.isSelectOne(vm.items)) {
            $rootScope.alertDialog("请至少选择一项功能");
            return;
        }
        var params = {
            "ROLE_NAME": vm.ROLE_NAME,
            "JURISDICTION_LIST": roleService.getJurisdictionList()
        };
        roleService.createRole(
            params,
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function () {
                        $state.go('main.baseData.roleList');
                    },
                    function () {
                        $rootScope.alertDialog('创建角色失败');
                    }
                );
            },
            function () {
                $rootScope.alertDialog('创建角色失败');
            });
    };

    vm.cancel = function () {
        if (vm.ROLE_NAME || roleService.getJurisdictionList().length > 0) {
            $rootScope.confirmDialog(
                '您确定要放弃保存吗?',
                function () {
                    $state.go('main.baseData.roleList');
                },
                function () {

                }
            );
        } else {
            $state.go('main.baseData.roleList');
        }
    };
    //判断至少选择一个功能
    vm.isSelectOne = function (list) {
        return roleService.isSelectOne(list);
    };
    //判断半选状态
    vm.isIndeterminate = function (item) {
        if (item['SUBLIST'] && item['SUBLIST'].length > 0) {
            var b = false;
            angular.forEach(item['SUBLIST'], function (value) {
                if (value['IS_SELECT'] === "1" || value['IS_SELECT'] === 1) {
                    b = true;
                    return false;
                }
            });
            return b;
        } else {
            return false;
        }
    };
    return vm;
}