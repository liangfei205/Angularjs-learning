"use strict";
APP.CONTROLLERS.controller('roleListCtrl', roleListCtrl);
roleListCtrl.$inject = ['$rootScope', '$state', 'roleService', 'downloadCommon'];
function roleListCtrl($rootScope, $state, roleService, downloadCommon) {
    var vm = this;
    vm.isDownloading = false;
    var downLoadParam = null;//信息导出是根据表格展示来的，所以要记录表格展示时的筛选条件
    vm.getRoleList = function () {
        var params = {};
        downLoadParam = params;
        roleService.showTable(vm, params, $state);
    };
    vm.getRoleList();
    return vm;
}