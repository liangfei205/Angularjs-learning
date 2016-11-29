"use strict";
APP.SERVICES.service('loginService', loginService);
loginService.$inject = ['Account', 'ENV'];
function loginService(Account, ENV) {
    var vm = this;
    if (ENV.runMode === "debug") {
        vm.login = function (params, successFunction, failedFunction) {
            return Account.debugLogin(JSON.stringify(params)).$promise
                .then(successFunction, failedFunction);
        };
    } else {
        vm.login = function (params, successFunction, failedFunction) {
            return Account.login(params).$promise
                .then(successFunction, failedFunction);
        };
    }
    vm.logout = function (params, successFunction, failedFunction) {
        return Account.logout(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.modifyPass = function (params, successFunction, failedFunction) {
        return Account.modifyPass(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.getCode = function (params, successFunction, failedFunction) {
        return Account.getCode().$promise
            .then(successFunction, failedFunction);
    };
    vm.checkCode = function (params, successFunction, failedFunction) {
        return Account.checkCode(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    return vm;
}