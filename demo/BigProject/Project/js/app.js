'use strict';
var APP = {};
APP.CONFIG = angular.module("APP.config", []);
APP.CONTROLLERS = angular.module('APP.controllers', ['APP.services', 'APP.filters', 'ngMaterial', 'material.svgAssetsCache', 'ngMessages', 'bsTable']);
APP.SERVICES = angular.module('APP.services', ['APP.common', 'APP.backend', 'APP.filters']);
APP.BACKEND = angular.module('APP.backend', []);
APP.COMMON = angular.module('APP.common', ['APP.config']);
APP.FILTERS = angular.module('APP.filters', []);
APP.DIRECTIVES = angular.module('APP.directives', []);
angular.module('APP', ['ngAnimate', 'ngRoute', 'ui.router', 'APP.controllers', 'APP.filters', 'APP.directives', 'ngCookies'])
    .config(['$stateProvider', '$urlRouterProvider', '$routeProvider', '$httpProvider', '$mdThemingProvider', '$mdDateLocaleProvider', 'ENV',
        function ($stateProvider, $urlRouterProvider, $routeProvider, $httpProvider, $mdThemingProvider, $mdDateLocaleProvider, ENV) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    controller: 'loginCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/login/login.html'
                })
                .state('main', {
                    url: '/main',
                    controller: 'mainCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/main.html',
                    naviPath:'/main'
                })
                .state('main.baseData', {
                    url: '/baseData',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                .state('main.report', {
                    url: '/report',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                //系统角色管理
                .state('main.baseData.roleList', {
                    url: '/roleList',
                    controller: 'roleListCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/baseData/role/list.html',
                    naviPath:'/main/baseData/roleList'
                })
                .state('main.baseData.roleAdd', {
                    url: '/roleAdd',
                    controller: 'roleAddCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/baseData/role/detail.html',
                    naviPath:'/main/baseData/roleList'
                })
                .state('main.baseData.roleEdit', {
                    url: '/roleEdit/:ROLE_KEY_ID/:ROLE_NAME',
                    controller: 'roleEditCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/baseData/role/detail.html',
                    naviPath:'/main/baseData/roleList'
                })
                //系统用户管理
                .state('main.baseData.userList', {
                    url: '/userList',
                    controller: 'userListCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/baseData/user/list.html',
                    naviPath:'/main/baseData/userList'
                })
                .state('main.baseData.userAdd', {
                    url: '/userAdd',
                    controller: 'userAddCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/baseData/user/detail.html',
                    naviPath:'/main/baseData/userList'
                })
                .state('main.baseData.userEdit', {
                    url: '/userEdit/:USER_KEY_ID',
                    controller: 'userEditCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/baseData/user/detail.html',
                    naviPath:'/main/baseData/userList'
                })
                //统计分析-重点人群统计
                .state('main.report.keyPopulationReport', {
                    url: '/keyPopulationReport',
                    controller: 'keyPopulationReportCtrl as vm',
                    controllerAs: 'vm',
                    templateUrl: 'template/report/keyPopulation/keyPopulationReport.html',
                    naviPath:'/main/report/keyPopulationReport'
                });

            $urlRouterProvider.otherwise('login');

            // Can change week display to start on Monday.
            $mdDateLocaleProvider.firstDayOfWeek = 1;

            // Example uses moment.js to parse and format dates.
            $mdDateLocaleProvider.parseDate = function(dateString) {
                var m = moment(dateString, 'YYYY-MM-DD', true);
                return m.isValid() ? m.toDate() : new Date(NaN);
            };

            $mdDateLocaleProvider.formatDate = function(date) {
                if (!date) {
                    return '';
                }
                var m = moment(date);
                return m.isValid() ? m.format('YYYY-MM-DD') : '';
            };

            //跨域CORS
            $httpProvider.defaults.withCredentials = true;

            $mdThemingProvider.definePalette('gpcolors', {
                '50': '#3d93fe',
                '100': '#ff4747',
                '200': 'ef9a9a',
                '300': 'e57373',
                '400': 'ef5350',
                '500': 'f44336',
                '600': '#3176cb',
                '700': 'd32f2f',
                '800': 'c62828',
                '900': 'b71c1c',
                'A100': 'ff8a80',
                'A200': 'ff5252',
                'A400': 'ff1744',
                'A700': 'd50000',
                'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                    // on this palette should be dark or light

                'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                    '200', '300', '400', 'A100'],
                'contrastLightColors': undefined    // could also specify this if default was 'dark'
            });


            $mdThemingProvider.theme('default')
                .primaryPalette('gpcolors', {
                    default: '50'
                })
                .accentPalette('light-blue', {
                    default: '500'
                })
                .warnPalette('gpcolors', {
                    default: '100'
                });
            /**
             * 主题蓝色 #2a9dff
             * 报错红色 ＃ff4747
             * 文字颜色 黑＃333333   深灰＃666666  浅灰＃999999
             */
        }
    ])
    .run(['$rootScope', '$state', '$stateParams', 'SessionStorage', 'ENV', '$mdDialog', '$document',
        function ($rootScope, $state, $stateParams, SessionStorage, ENV, $mdDialog, $document) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                if (fromState.name) {
                    $rootScope.previousState_name = fromState.name;
                    $rootScope.previousState_params = fromParams;
                }
                $rootScope.$emit('url-change', toState['name']);
            });
            //back button function called from back button's ng-click="back()"
            $rootScope.back = function () {
                $rootScope.previousState_name&&$state.go($rootScope.previousState_name, $rootScope.previousState_params);
                !$rootScope.previousState_name&&window.history.back();
            };
            //监听stateChange事件
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                $rootScope.naviIndex=toState.naviIndex;
                $rootScope.naviPath=toState.naviPath;
                if (angular.element($document[0].body).hasClass('md-dialog-is-showing')) {//如果有对话框存在
                    $mdDialog.cancel();
                    event.preventDefault();
                    return;
                }
                if(angular.element('.md-panel-is-showing').length>0) {//如果有Panel对话框存在
                    $rootScope.$broadcast('panelClose');
                    event.preventDefault();
                    return;
                }
                if ((toState.name+'') === 'login') {// 如果是进入登录界面则允许
                    return;
                }
                // 如果用户不存在
                if (ENV.runMode !== 'debug' && !SessionStorage.get('loginInfo')) {
                    $rootScope.previousState_name = toState.name;
                    $rootScope.previousState_params = toParams;
                    $rootScope.lastUserName='gproot001';
                    event.preventDefault();// 取消默认跳转行为
                    $state.go("login", {from: fromState.name, w: 'notLogin'});//跳转到登录界面
                }
            });
            // 跳转到登录界面，这里我记录了一个from，这样可以在登录后自动跳转到未登录之前的那个界面
            $rootScope.$on('commonInterceptor', function (errorType) {
                $state.go("login", {from: $state.current.name, w: errorType});
            });
        }
    ]);

