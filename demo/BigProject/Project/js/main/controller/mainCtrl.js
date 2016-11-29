"use strict";
APP.CONTROLLERS.controller('mainCtrl', mainCtrl);
mainCtrl.$inject = ['$rootScope', '$scope', '$state', '$mdDialog', '$mdPanel', 'SessionStorage', 'mainService', 'loginService', 'ENV'];
function mainCtrl($rootScope, $scope, $state, $mdDialog, $mdPanel, SessionStorage, mainService, loginService, ENV) {
    var vm = this;
    vm.runMode = (ENV.runMode === 'debug');
    vm.loginInfo = SessionStorage.get('loginInfo');
    vm.showModifyPass = function () {
        APP.CONTROLLERS.controller('DialogController', DialogController);
        DialogController.$inject = ['$rootScope', '$scope', 'mdPanelRef'];
        function DialogController($rootScope, $scope, mdPanelRef) {
            $scope.$on('panelClose',
                function(){
                    mdPanelRef.close();
                }
            );
            $scope.cancel = function () {
                mdPanelRef.close();
            };
            $scope.answer = function () {
                var params = {
                    "OLDPASSWORD": $scope.oldPassword,
                    "NEWPASSWORD": $scope.newPassword,
                    "REPASSWORD": $scope.rePassword
                };
                loginService.modifyPass(
                    params,
                    function (response) {
                        $rootScope.handleMessage(
                            response,
                            function () {
                                vm.logout(mdPanelRef);
                            },
                            function (response) {
                                $rootScope.alertDialog(response['message']);
                            }
                        );
                    },
                    function () {
                        $rootScope.alertDialog("修改密码失败");
                        //$state.go('main');
                    }
                );
            };
        }

        var position = $mdPanel.newPanelPosition().absolute().center();
        var animation = $mdPanel.newPanelAnimation().withAnimation($mdPanel.animation.FADE);
        var config = {
            animation: animation,
            attachTo: angular.element(document.body),
            controller: DialogController,
            templateUrl: 'template/login/edit.html',
            position: position,
            trapFocus: true,
            disableParentScroll: true,
            clickOutsideToClose: false,
            clickEscapeToClose: true,
            hasBackdrop: true,
            fullscreen: vm['customFullscreen']
        };
        $mdPanel.open(config);
    };
    vm.showLogout = function () {
        $rootScope.confirmDialog(
            '您确定要退出登录吗?',
            function () {
                vm.logout();
            },
            function () {

            }
        );
    };
    vm.logout = function (mdPanelRef) {
        loginService.logout(
            {},
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function () {
                        mdPanelRef && mdPanelRef.close();
                        //清除用户登录信息
                        SessionStorage.remove('loginInfo');
                        $state.go('login');
                    },
                    function () {
                        $rootScope.alertDialog("退出登录失败");
                    }
                );

            },
            function () {
                $rootScope.alertDialog("退出登录失败");
                //$state.go('main');
            }
        );
    };

    vm.stateGo = function (state) {
        $state.go(state);
    };
    vm.isSelectedMenu = function (menuResourcePath) {
        if (menuResourcePath === '/main') {
            return $state.current.naviPath === '/main';
        } else {
            return $state.current.naviPath.indexOf(menuResourcePath) >= 0;
        }
    };
    $scope.$on('auth-loginRequired', loginRequired);
    $scope.$on('auth-forbidden', loginRequired);
    function loginRequired() {
        $rootScope.alertDialog('登陆超时，请重新登陆').then(
            function(){
                $state.go("login");
            }
        );
    }

    return vm;
}