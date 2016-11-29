"use strict";
APP.CONTROLLERS.controller('loginCtrl', loginCtrl);
loginCtrl.$inject = ['$rootScope', '$state', '$location', '$filter', 'SessionStorage', 'loginService', 'ENV'];
function loginCtrl($rootScope, $state, $location, $filter, SessionStorage, loginService, ENV) {
    var vm = this;
    vm.random = 0;
    //清除用户登录信息
    SessionStorage.remove('loginInfo');

    vm.getCode = function () {
        vm.codeUrl = ENV.urlBase + "/getcode.jpg" + "?" + vm.random;
        vm.random = vm.random + 1;
    };
    vm.login = function () {
        vm.username = vm.name + '#' + '0003000010';//+ vm.code;
        if (ENV.runMode === "debug") {
            vm.params = {
                "HOSPITAL_ID": "1",
                "ID_NO": "310102195407043250"
            };
        } else {
            vm.params = "username=" + vm.username + "&" + "password=" + vm.password;
        }
        //执行登录
        function accountLogin() {
            loginService.login(
                vm.params,
                function (response) {
                    $rootScope.handleMessage(
                        response,
                        function (data) {
                            //缓存用户登录信息
                            SessionStorage.set('loginInfo', data);
                            if($rootScope.previousState_name&&$rootScope.lastUserName===data.username&&$rootScope.checkAuth($rootScope.previousState_name)){
                                $rootScope.back();
                            }
                            else {
                                $rootScope.lastUserName = data.username;
                                $state.go('main');
                            }
                        },
                        function (response) {
                            var message = $filter('logMessage')(response.message);
                            $rootScope.alertDialog(message);
                        }
                    );
                },
                function () {
                    $rootScope.alertDialog("登录失败");
                    //$state.go('login');
                }
            );
        }

        //检查验证码
        loginService.checkCode(
            {
                "code": vm.code
            },
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function (data) {
                        if (data) {
                            accountLogin();
                        } else {
                            $rootScope.alertDialog("验证码错误。");
                            vm.getCode();
                        }
                    },
                    function () {
                        $rootScope.alertDialog("验证码错误。");
                        vm.getCode();
                    }
                );
            },
            function () {
                $rootScope.alertDialog("验证码校验失败");
            }
        );
    };
    vm.getCode();
    return vm;
}