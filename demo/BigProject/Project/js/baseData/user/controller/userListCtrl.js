"use strict";
APP.CONTROLLERS.controller('userListCtrl', userListCtrl);
userListCtrl.$inject = ['$rootScope', '$state', 'userService', 'downloadCommon'];
function userListCtrl($rootScope, $state, userService, downloadCommon) {
    var vm = this;
    vm.isDownloading = false;
    vm.roles = [];
    userService.getAllAccountRole(
        {
            "IS_LIMIT_AUTHORITY": 1
        },
        function (response) {
            $rootScope.handleMessage(
                response,
                function (data) {
                    vm.roles = data;
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

    vm.selectedRoles = [];


    vm.searchTerm;
    vm.clearSearchTerm = function () {
    };
    vm.getSearchTerm = function () {
        vm.searchTerm = vm.selectedOrganization ? vm.selectedOrganization.ORGANIZATION_NAME : undefined;
        vm.searchTermChange();
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

    //查询
    vm.account = '';

    vm.getUserList = function () {
        var roleList = [];
        angular.forEach(vm.selectedRoles, function (item) {
            roleList.push({
                "ROLE_KEY_ID": item.ROLE_KEY_ID
            });
        });
        var params = {
            "IS_ONLINE": vm.selectState,
            "ACCOUNT": vm.account,
            "ROLE_KEY_ID_LIST": roleList
        };
        userService.showTable(vm, params, $state);
        vm.downLoadParam = params;
    };

    //创建
    vm.create = function () {
        $state.go('main.baseData.userAdd');
    };

    //导出表格
    vm.downLoadFile = function () {
        vm.isDownloading = true;
        userService.downloadUserList(vm.downLoadParam, function (response) {
            $rootScope.handleMessage(response, function (data) {
                downloadCommon.downloadFile(data['fileName'], "系统用户信息.xls");
                vm.isDownloading = false;
            }, function () {
                vm.isDownloading = false;
                $rootScope.alertDialog("信息导出失败");
            });
        }, function () {
            vm.isDownloading = false;
            $rootScope.alertDialog("信息导出失败");
        });
    };

    vm.getUserList();

    return vm;
}