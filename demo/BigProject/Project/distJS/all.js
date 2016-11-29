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


(function (window, angular) {
    'use strict';
    var module = angular.module('APP.backend', ['ngResource', 'APP.config']);
    module
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('commonInterceptor');
            $httpProvider.interceptors.push('ajaxInterceptor');
        }])
        .factory('commonInterceptor', ['$q', 'LocalStorage', '$rootScope', function ($q, LocalStorage, $rootScope) {
            var requestInterceptor = {
                request: function (config) {
                    var deferred = $q.defer();

                    var regStr = /.*\.html/;
                    if (!regStr.test(config.url) && !config.params) {
                            config.params = {};
                    }

                    //新版token
                    //var oauthToken = LocalStorage.get("HMSToken");
                    //if (oauthToken) {
                    //    config.headers['Authorization'] = "Bearer " + oauthToken;
                    //}

                    //设置请求超时
                    if (!config.timeout) {
                        config.timeout = 30000;
                    }

                    deferred.resolve(config);
                    return deferred.promise;
                },
                response: function (response) {
                    if (response && response.data.message && response.data.message === 'unauthorized' && !response.data.success) {
                        var deferred = $q.defer();
                        $rootScope.$broadcast('auth-loginRequired', response);
                        return deferred.promise;
                    }
                    return response;
                },
                responseError: function (response) {
                    switch (response.status) {
                        case 401:
                            var deferred = $q.defer();
                            $rootScope.$broadcast('auth-loginRequired', response);
                            return deferred.promise;
                        case 403:
                            $rootScope.$broadcast('auth-forbidden', response);
                            break;
                        case -1:
                            $rootScope.$broadcast('offline');
                            break;
                        default:
                            break;
                    }
                    return $q.reject(response);
                }
            };
            return requestInterceptor;
        }])
        //Ajax-aop
        .factory('ajaxInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
            if ($rootScope.ajaxCalls === undefined) {
                $rootScope.ajaxCalls = 0;
            }
            var smsInterceptor = {
                request: function (config) {
                    $rootScope.ajaxCalls += 1;
                    return config;
                },
                requestError: function (rejection) {
                    $rootScope.ajaxCalls -= 1;
                    return rejection;
                },
                response: function (response) {
                    $rootScope.ajaxCalls -= 1;
                    return response;
                },
                responseError: function (rejection) {
                    $rootScope.ajaxCalls -= 1;
                    return rejection;
                }
            };
            return smsInterceptor;
        }])
        .factory('Common', ['$resource', 'ENV', function ($resource, ENV) {
            return $resource("", "", {
                getCurrentTime: {
                    method: 'GET',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/getSysDate",
                    isArray: false,
                    timeout: ENV.timeout
                }
            })
        }])
        .factory('Account', ['$resource', 'ENV', function ($resource, ENV) {
            return $resource("", "", {
                debugLogin: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    withCredentials: false,
                    url: ENV.urlBase + "/login.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                login: {
                    method: "POST",
                    headers: {
                        //"content-type": "multipart/form-data"
                        "content-type": "application/x-www-form-urlencoded"
                        //"content-type": "application/json"
                    },
                    url: ENV.urlBase + "/login.json",
                    //url: ENV.urlBase + "/account/login",
                    isArray: false,
                    timeout: ENV.timeout
                },
                logout: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/logout.json",
                    //url: ENV.urlBase + "/account/logout",
                    isArray: false,
                    timeout: ENV.timeout
                },
                checkCode: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/checkCode.json",
                    isArray: false,
                    timeout: ENV.timeout
                }
            })
        }])
        .factory('Role', ['$resource', 'ENV', function ($resource, ENV) {
            return $resource('', '', {
                getRoleList: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/role/getRoleList.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getJurisdictionsOfRole: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/role/getJurisdictionsOfRole.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                createRole: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/role/createRole.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                updateRole: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/role/updateRole.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                deleteRole: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/role/deleteRole.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                checkUser: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/role/checkUser.json",
                    isArray: false,
                    timeout: ENV.timeout
                }
            });
        }])
        .factory('User', ['$resource', 'ENV', function ($resource, ENV) {
            return $resource('', '', {
                getAllAccountRole: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/user/getRoleList.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                checkUserNameDuplicate: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/user/checkUserName.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                createNewUser: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/user/createNewUser.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getUserList: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/user/getUserList.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getUserInfoByKeyId: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/user/getUserInfoByKeyId.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                deleteUser: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/user/deleteUser.json",
                    isArray: false,
                    timeout: ENV.timeout
                },
                editUser: {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/user/editUser.json",
                    isArray: false,
                    timeout: ENV.timeout
                }
            });
        }])
        .factory('Report', ['$resource', 'ENV', function ($resource, ENV) {
            return $resource('', '', {
                getOrganizationLevel: {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/organization/getOrganizationLevelListConstraint",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getOrganizationByLevel: {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/organization/getCertainLevelOrganization",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getDoctorByOrganization: {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getDoctorByOrganization",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getAllSignedData: {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getAllSignedData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getOrganizationORDoctor: {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getOrganizationORDoctor",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getMoreSignedData: {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getMoreSignedData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getPageSignedData: {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getPageSignedData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getAllFollowUpData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getAllFollowUpData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getAllDiabetesData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getAllDiabetesData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getGlucoseAndWarningData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getGlucoseAndWarningData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getHBPGlucoseAndWarningData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getHBPGlucoseAndWarningData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getPerMonthDiabetesData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getPerMonthDiabetesData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getAllHypertensionData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getAllHypertensionData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getSysDate:{
                    method: 'GET',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/getSysDate",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getPerMonthHypertensionData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getPerMonthHypertensionData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getMoreGlucoseAndWarningData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getMoreGlucoseAndWarningData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getMoreHBPGlucoseAndWarningData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getMoreHBPGlucoseAndWarningData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getPageGlucoseAndWarningData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getPageGlucoseAndWarningData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getPageHBPGlucoseAndWarningData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getPageHBPGlucoseAndWarningData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getMoreODPDistributionData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getMoreODPDistributionData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getMoreOHPDistributionData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getMoreOHPDistributionData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getPageODPDistributionData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getPageODPDistributionData",
                    isArray: false,
                    timeout: ENV.timeout
                },
                getPageOHPDistributionData:{
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    url: ENV.urlBase + "/statisticsReport/getPageOHPDistributionData",
                    isArray: false,
                    timeout: ENV.timeout
                }
            });
        }]);
})(window, window.angular);
(function (window, angular) {
    'use strict';
    angular.module('APP.common', [])
        .factory('LocalStorage', function () {
            return {
                set: function (key, data) {
                    return window.localStorage.setItem(key, window.JSON.stringify(data));
                },
                get: function (key) {
                    return window.JSON.parse(window.localStorage.getItem(key));
                },
                remove: function (key) {
                    return window.localStorage.removeItem(key);
                }
            };
        })
        .factory('SessionStorage', function () {
            return {
                set: function (key, data) {
                    return window.sessionStorage.setItem(key, window.JSON.stringify(data));
                },
                get: function (key) {
                    return window.JSON.parse(window.sessionStorage.getItem(key));
                },
                remove: function (key) {
                    return window.sessionStorage.removeItem(key);
                }
            };
        })
        .factory('cacheService', ['$cacheFactory', function ($cacheFactory) {
            var cache = $cacheFactory('rootCache');
            return {
                put: function (key, value) {
                    return cache.put(key, value);
                },
                get: function (key) {
                    return cache.get(key);
                },
                remove: function (key) {
                    return cache.remove(key);
                },
                removeAll: function () {
                    return cache.removeAll();
                }
            }
        }])
        .factory('bootstrapTable', function () {
            return {
                initOption: function (params) {
                    var rootOption = {
                        dataFunction: function () {
                            return {
                                rows: [],
                                total: 0
                            }
                        },
                        columns: [{
                            field: 'NAME',
                            title: '默认数据',
                            sortable: true,
                            align: 'center'
                        }],
                        pagination: true, // 开启分页功能
                        search: false, // 关闭搜索功能
                        sidePagination: 'server',
                        pageSize: 10, // 设置默认分页为 10
                        pageList: [10, 20, 50],
                        dataField: 'rows',
                        minimumCountColumns: 1 // 设置最少显示列个数
                    };
                    return angular.extend(rootOption, params);
                }
            }
        })
        .factory('downloadCommon', ['ENV', function (ENV) {
            return {
                downloadFile: function (url, filename) {

                    function r(e, t, n) {
                        var r = function () {
                            n.apply(e, arguments)
                        };
                        if (e.addEventListener) {
                            e.addEventListener(t, r, false)
                        } else {
                            e.attachEvent("on" + t, r)
                        }
                        return r
                    }

                    function i(e, t) {
                        var n = arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : [];
                        var r;
                        for (var s = 0; s < n.length; s++) {
                            r = n[s];
                            for (var o in r) {
                                if (typeof r[o] === "object") {
                                    e[o] = i({}, r[o])
                                } else if (o != null && r.hasOwnProperty(o) && typeof r[o] !== "undefined") {
                                    e[o] = r[o]
                                }
                            }
                        }
                        return e
                    }

                    function s(t, n) {
                        var r = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                        r.download = t;
                        r.href = URL.createObjectURL(n);
                        var i = document.createEvent("MouseEvents");
                        i.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        r.dispatchEvent(i)
                    }

                    function o(e, t, n) {
                        var r;
                        t = t || "GET";
                        if (window.XMLHttpRequest) {
                            r = new XMLHttpRequest
                        } else {
                            r = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        r.open(t, e, true);
                        r.responseType = "blob";
                        r.onreadystatechange = function () {
                            if (r.readyState == r.DONE && n) {
                                n.call(r, r.response);
                            }
                        };
                        r.send();
                        return r
                    }

                    var t = {
                        url: "",
                        filename: "",
                        type: "GET",
                        progress: function () {
                        },
                        done: function () {
                        }
                    };
                    var FileDownloader = function (e) {
                        function h(e) {
                            var t = e.total;
                            var r = e.loaded;
                            var i = r / t;
                            var s = (new Date).getTime();
                            var o = (s - l) / 1e3;
                            var u = r - c;
                            var a = u / o;
                            c = r;
                            l = s;
                            e.per = i;
                            e.speed = a;
                            n.progress.call(f, e)
                        }

                        function p(e) {
                            var t = n.done();
                            if (typeof t === "boolean" && !t) return t;
                            s(a, e)
                        }

                        var n = i({}, t, e);
                        var u = n.url;
                        var a = n.filename;
                        var f = o(u, n.type, p);
                        var l = (new Date).getTime();
                        var c = 0;
                        r(f, "progress", h)
                    };

                    FileDownloader({
                        url: encodeURI(ENV.urlBase + url),
                        filename: filename
                    });
                }
            }
        }]);
})(window, window.angular);
(function (angular) {
    "use strict";
    var module = angular.module('APP.directives', []);
    module
        .directive('rpwCheck', function () {
            return {
                require: "ngModel",
                link: function (scope, elem, attrs, ctrl) {
                    var otherInput = elem.inheritedData("$formController")[attrs['rpwCheck']];

                    ctrl.$parsers.push(function (value) {
                        ctrl.$setValidity("repeat", value === otherInput.$viewValue);
                        return value;
                    });

                    otherInput.$parsers.push(function (value) {
                        ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                        return value;
                    });
                }
            };
        })
        .directive('idcardCheck', function () {
            return {
                require: "ngModel",
                link: function (scope, elem, attrs, ctrl) {
                    var customValidator = function (input) {
                        if (input === undefined || input === null || input === '') {//为空不做判断
                            ctrl.$setValidity('idCard', true);
                            ctrl.$setValidity('idCardAdress', true);
                            ctrl.$setValidity('idCardCheckCode', true);
                            return input;
                        }
                        var value = angular.copy(input);
                        var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
                        var validity = true;
                        if (!value || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(value)) {
                            validity = false;
                            ctrl.$setValidity('idCard', false);
                        } else if (!city[value.substr(0, 2)]) {
                            validity = false;
                            ctrl.$setValidity('idCard', true);
                            ctrl.$setValidity('idCardAdress', false);
                        } else {
                            //18位身份证需要验证最后一位校验位
                            if (value.length === 18) {
                                value = value.split('');
                                //∑(ai×Wi)(mod 11)
                                //加权因子
                                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
                                //校验位
                                var parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
                                var sum = 0;
                                var ai = 0;
                                var wi = 0;
                                for (var i = 0; i < 17; i++) {
                                    ai = value[i];
                                    wi = factor[i];
                                    sum += ai * wi;
                                }
                                var last = parity[sum % 11];
                                if (last !== value[17].toUpperCase()) {
                                    validity = false;
                                    ctrl.$setValidity('idCard', true);
                                    ctrl.$setValidity('idCardAdress', true);
                                    ctrl.$setValidity('idCardCheckCode', false);
                                } else {
                                    ctrl.$setValidity('idCard', true);
                                    ctrl.$setValidity('idCardAdress', true);
                                    ctrl.$setValidity('idCardCheckCode', true);
                                }
                            }
                        }
                        return validity ? input : undefined;
                    };
                    ctrl.$formatters.push(customValidator);
                    ctrl.$parsers.push(customValidator);
                }
            };
        })
        .directive('ngClear', function () {
            return {
                link: function (scope, elem, attrs) {
                    scope.$watch(
                        attrs['ngClear'],
                        function (newValue) {
                            var element = elem[0];
                            if (newValue) {
                                if (element['tagName'] === 'INPUT'){
                                    element['value'] = "";
                                    elem.triggerHandler('input');
                                } else if(element['tagName'] === 'MD-RADIO-GROUP'){
                                    scope[attrs.ngModel.split(".")[0]][attrs.ngModel.split(".")[1]] = undefined;
                                    elem.triggerHandler('change');
                                }
                            }
                        }
                    );
                }
            }
        })
        .directive('ngEnter', function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, elem, attrs) {
                    elem.bind("keydown keypress", function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                scope.$eval(attrs['ngEnter']);
                            });
                            event.preventDefault();
                        }
                    });
                }
            }
        })
        .directive('eChart', function () {
            function link(scope, element, attrs) {
                var myChart = echarts.init(element[0]);
                scope.$watch(attrs['eData'], function () {
                    //监视e-data改变则刷新图表
                    var option = scope.$eval(attrs.eData);
                    if (angular.isObject(option)) {
                        //true改false则与上一图表数据合并
                        myChart.setOption(option, true);
                    }
                }, true);
                scope.getDom = function () {
                    return {
                        'height': element[0].offsetHeight,
                        'width': element[0].offsetWidth
                    };
                };
                scope.$watch(scope.getDom, function () {
                    // resize echarts图表
                    myChart.resize();
                }, true);
            }

            return {
                restrict: 'A',
                link: link
            };
        })
        .directive('textChange', ['$timeout',function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    scope.$on('textChanged', function () {
                        $timeout(function () {
                            elem.triggerHandler('input');
                        });
                    });//可以通过$scope.$broadcast('textChanged');来触发textChanged事件
                    scope.$watch(attrs.ngModel, function () {
                        $timeout(function () {
                            elem.triggerHandler('input');
                        });
                    });
                }
            }
        }]);
}(angular));
(function (angular) {
    "use strict";
    var module = angular.module('APP.filters', []);
    module.filter('age', [function () {
        return function (input) {
            var birth = +new Date(input);
            var now = +new Date();
            return ~~((now - birth) / 365 / 24 / 60 / 60 / 1000);
        };
    }]);

    module.filter('sex', [function () {
        return function (input) {
            if (input === 1 || input === '1') {
                return '男';
            }
            if (input === 0 || input === '0') {
                return '女';
            }
            return '未知';
        };
    }]);

    module.filter('isEmptyObject', [function () {
        return function (input) {
            for (var n in input) {
                return false
            }
            return true;
        };
    }]);

    module.filter('isEmptyArray', [function () {
        return function (input) {
            if(input === undefined
                || input === null
                || input.length === 0){
                return true;
            }
            return false;
        };
    }]);

    module.filter('selected', [function () {
        return function (input) {
            if (input === 1 || input === '1') {
                return true;
            }
            if (input === 0 || input === '0') {
                return false;
            }
            return false;
        };
    }]);

    module.filter('commonDate', ['$filter', function ($filter) {
        return function (input, str) {
            if (!str) {
                str = 'yyyy-MM-dd';
            }
            if (typeof input === 'string') {
                input = input.replace(/-/g, '\/');
            }
            var timestamp = +new Date(input);
            return $filter('date')(timestamp, str);
        };
    }]);

    module.filter('logMessage', [function () {
        var logMessageMap = {
            "login failed. reason: Bad credentials": "密码错误。",
            "login failed. reason: User account has expired": "用户账号过期。",
            "login failed. reason: User account is locked": "用户账号被锁。",
            "login failed. reason: User credentials have expired": "用户账号证书过期。",
            "This session has been expired (possibly due to multiple concurrent logins being attempted as the same user).": "登录过期，您的账号在其他地方登录",
            "access denied": "您没有权限，访问被拒绝。",
            "unauthorized": "您还没有登录，请登录后尝试访问！",
            "login success": "登录成功。",
            "logout success": "注销成功。",
            "invalid logout": "过期注销。",
            "login failed. reason: Username not found": "该用户不存在。",
            "login failed. reason: Authority not found": "用户基础数据获取异常。",
            "login failed. reason: Authorityfunc not found": "用户基础数据获取异常。",
            "login failed. reason: Bad code": "验证码错误。",
            "login failed. reason: System exception": "系统登录异常。",
            "login failed. reason: User not role": "该用户没有配置角色",
            "login failed. reason: role not authority": "该用户的角色没有配置权限。",
            "login failed. reason: role not menus": "该用户的角色没有配置菜单。"
        };
        return function (input) {
            return logMessageMap[input] || input;
        };
    }]);
}(angular));
(function () {
    var assetMap = {
        'img/icons/ic_euro_24px.svg': '<svg viewBox="0 0 24 24" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="euro" sketch:type="MSLayerGroup" transform="translate(4.928571, 3.000000)"><path d="M13.3295171,13.848956 C12.7717614,14.1408877 11.5268981,14.5372503 10.3117026,14.5372503 C8.98732947,14.5372503 7.74127945,14.1408877 6.89515215,13.1855827 C6.49641614,12.7381914 6.20567113,12.1258468 6.0205437,11.3319349 L12.6685173,11.3319349 L12.6685173,9.45217947 L5.65147555,9.45217947 L5.65147555,9.02852246 C5.65147555,8.73659074 5.65147555,8.47432688 5.67639655,8.20731616 L12.669704,8.20731616 L12.669704,6.32756069 L6.07513256,6.32756069 C6.26263342,5.63926639 6.52371057,5.03048195 6.92363329,4.60682495 C7.74246616,3.62541221 8.91019304,3.17564749 10.1550564,3.17564749 C11.3168497,3.17564749 12.4311744,3.52098135 13.1194687,3.81172636 L13.8587917,0.793911872 C12.9046734,0.371441579 11.4770561,0 9.88685892,0 C7.3722113,0 5.25273954,1.00514702 3.77172009,2.7282562 C2.92559278,3.68118779 2.2634062,4.89994338 1.94418005,6.32874741 L0.168855444,6.32874741 L0.168855444,8.20731616 L1.65343504,8.20731616 C1.65343504,8.47432688 1.62614062,8.73777745 1.62614062,9.00241475 L1.62614062,9.45217947 L0.168855444,9.45217947 L0.168855444,11.3331216 L1.89196462,11.3331216 C2.1304942,12.7393781 2.65858206,13.8750637 3.37417079,14.7745931 C4.85875039,16.7338585 7.21319158,17.7935943 9.83345677,17.7935943 C11.5292715,17.7935943 13.0660666,17.2904275 13.965596,16.789634 L13.3295171,13.848956 L13.3295171,13.848956 Z" id="Shape" sketch:type="MSShapeGroup"></path></g></svg>',
        'img/icons/ic_card_giftcard_24px.svg': '<svg viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
        'img/icons/addShoppingCart.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="addShoppingCart"><g id="add-shopping-cart"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/></g></svg>',
        'img/icons/android.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="android"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/></g></svg>',
        'img/icons/angular-logo.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"> <defs> <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"> <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0"></feOffset> <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3"></feGaussianBlur> <feComponentTransfer in="blurOut" result="opacityOut"> <feFuncA type="linear" slope="0.5"></feFuncA> </feComponentTransfer> <feBlend in="SourceGraphic" in2="opacityOut" mode="normal"></feBlend> </filter> </defs> <path d=" M 5 18.25 L 50 2.25 L 96 18 L 88.5 77 L 50 98.25 L 12 77.25 Z" fill="black" filter="url(#shadow)" class="outline"></path> <path d=" M 5 18.25 L 50 2.25 L 50 98.25 L 12 77.25 Z" fill="#de3641" class="left"></path> <path d=" M 50 2.25 L 96 18 L 88.5 77 L 50 98.25 Z" fill="#b13138" class="right"></path> <path d=" M 50 13 L 79.25 75.5 L 69.25 75.5 L 63 61.25 L 50 61.25 L 50 52.75 L 59.5 52.75 L 50 33.1 L 42 52.75 L 50 52.75 L 50 61.25 L 38.1 61.25 L 32.5 75.5 L 21.75 75.5 Z" fill="white" class="letter"></path></svg>',
        'img/icons/bower-logo.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g> <g id="leaf"> <path fill="#00ACEE" d="M434.625,63.496c-67.822,0-118.399,71.68-95.018,123.167C435.596,186.664,396.518,98.058,434.625,63.496z" /> </g> <path id="body" fill="#FFCC2F" d="M456.534,256.992c0-22.79-108.627-34.129-169.139-37.663 c-60.511-3.533-281.592,38.389-255.42,93.813c26.173,55.426,92.581,114.358,167.313,114.358c38.716,0,83.584-27.284,86.053-77.38 C330.121,335.163,456.534,334.371,456.534,256.992z"/> <path id="wing_tip" fill="#2BAF2B" d="M400.981,272.143c7.02,7.104-15.222,26.295-34.606,17.262 c8.731,19.688-29.676,36.064-48.336,22.026c1.998,15.865-36.122,24.996-48.285,7.292c3.136,8.441,5.757,14.898,8.229,20.209 c-0.029-0.09-0.046-0.149-0.046-0.149c6.324,8.279,14.929,14.939,52.394,14.939c57.727,0,150.97-43.849,150.97-76.039 c0-26.643-9.992-29.14-27.196-27.198c-17.208,1.942-107.17,11.291-126.306,7.534C338.182,260.229,390.54,270.259,400.981,272.143z" /> <path id="head" fill="#EF5734" d="M198.51,48.82c-110.382,0-221.179,109.721-168.451,261.056 c35.817,21.53,83.576,12.995,94.278,1.532c16.178,5.171,30.612,7.347,43.513,7.347c67.047,0,124.34-71.235,124.34-160.257 C292.189,67.196,231.93,48.82,198.51,48.82z"/> <path id="eye_rim" fill="#FFCC2F" d="M153.308,146.522c0,24.632,19.969,44.603,44.603,44.603c24.633,0,44.603-19.971,44.603-44.603 c0-24.633-19.97-44.603-44.603-44.603C173.277,101.92,153.308,121.89,153.308,146.522z"/> <path id="eye" fill="#543729" d="M171.207,146.522c0,14.747,11.956,26.704,26.704,26.704c14.748,0,26.703-11.957,26.703-26.704 c0-14.748-11.955-26.704-26.703-26.704C183.163,119.819,171.207,131.774,171.207,146.522z"/> <ellipse id="pupil_highlight" fill="#FFFFFF" cx="197.91" cy="134.674" rx="15.56" ry="9.675"/> <path id="beak" fill="#CECECE" d="M289.401,123.675c-20.275,11.807-19.604,50.03-10.595,68.681 c17.445-6.466,41.752-19.291,45.527-21.585c3.773-2.293-2.088-10.989,12.559-10.989c20.315,0,38.684,6.348,43.956,8.634 C377.511,161.547,335.758,123.675,289.401,123.675z"/> <path id="outline" fill="#543729" d="M502.214,250.797c-26.335-25.305-158.017-41.1-199.568-45.698 c2.014-4.754,3.726-9.669,5.142-14.731c5.665-2.481,11.776-4.789,18.101-6.716c0.77,2.272,4.397,10.98,6.465,15.112 c83.553,2.305,87.844-62.09,91.24-79.732c3.323-17.25,3.154-33.917,31.812-64.388C412.709,42.201,351.31,73.928,330.742,121.15 c-7.728-2.896-15.474-5.035-23.136-6.357c-5.488-22.146-34.077-83.845-109.097-83.845c-48.585,0-97.581,20.063-134.421,55.045 c-19.852,18.85-35.445,41.234-46.344,66.53C5.97,179.851,0,209.94,0,241.957C0,353.462,76.126,451.18,119.139,451.18 c18.784,0,34.943-14.067,38.736-26.675c3.181,8.645,12.938,35.522,16.142,42.364c4.737,10.117,26.642,18.872,36.229,8.373 c12.326,6.849,34.943,10.973,47.27-7.289c23.739,5.022,44.728-9.135,45.184-26.026c11.649-0.622,17.363-16.978,14.819-30.001 c-1.875-9.591-21.904-44-29.719-55.877c15.468,12.58,54.644,16.142,59.401,0.008c24.936,19.571,63.797,9.301,66.879-6.619 c30.301,7.874,65.054-9.417,59.348-30.359C522.102,315.711,515.872,263.921,502.214,250.797z M375.456,164.958 c-12.821-5.033-29.084-8.217-40.482-8.217c-16.164,0-26.009,9.16-41.218,9.16c-3.193,0-10.812,0.016-16.926-2.162 c4.021,4.217,9.025,6.505,18.725,6.505c5.793,0,17.263-2.958,26.553-5.752c0.129,1.956,0.334,3.898,0.61,5.826 c-17.402,4.161-35.664,15.231-40.949,18.105c-11.755-25.958-1.65-50.505,7.697-61.837 C331.331,126.686,365.144,155.433,375.456,164.958z M393.557,163.001l-6.406-5.979c-6.575-6.159-13.43-11.731-20.469-16.678 c10.483-20.801,23.658-43.514,40.298-57.565c-18.314,7.381-36.397,29.445-47.089,53.03c-5.448-3.464-10.98-6.554-16.561-9.255 c14.913-31.834,49.568-58.42,87.762-60.497C405.509,89.257,415.114,135.563,393.557,163.001z M341.006,184.7 c-2.821-6.114-5.677-16.27-5.328-22.239c4.753-0.112,13.868,1.67,15.335,2.016c-0.557,2.803-0.855,8.944-0.866,9.739 c0.903-1.556,3.41-6.922,4.43-9.029c9.127,1.744,21.126,4.659,28.161,7.938C374.478,178.473,360.439,184.293,341.006,184.7z M283.971,112.911c-33.381,33.832-20.199,76.63-8.046,95.976c-17.29,28.761-51.28,48.437-90.765,57.389 c44.328,0,70.397-11.409,85.563-22.586c9.677-7.131,14.928-14.17,17.608-18.088c65.72,4.251,169.783,25.423,179.935,32.281 c4.074,2.753,8.278,8.842,8.895,14.668c-49.387-6.914-138.407-14.188-161.719-15.424c16.549,2.347,137.241,25.202,158.163,30.552 c-6.368,10.384-20.872,17.715-42.733,12.621c11.812,16.093-11.125,35.399-43.071,24.766c7.032,15.799-21.413,30.021-53.741,13.555 c0.411,15.805-40.105,17.626-56.123,0.162c0.306,2.082,2.207,6.066,3.028,7.809c-5.162,46.15-42.961,74.783-81.677,74.783 c-94.794,0-177.375-76.989-177.375-179.417c0-108.292,80.03-189.096,176.597-189.096 C253.842,52.861,278.836,96.412,283.971,112.911z"/></g></svg>',
        'img/icons/cake.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="cake"><path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z"/></g></svg>',
        'img/icons/codepen-logo.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><path d="M250 0C111.928 0 0 111.927 0 250c0 138.077 111.927 250 250 250 138.073 0 250-111.923 250-250C500 111.928 388.073 0 250 0zm0 458.943C134.79 458.943 41.06 365.21 41.06 250c0-115.207 93.73-208.94 208.94-208.94S458.94 134.793 458.94 250c0 115.21-93.73 208.943-208.94 208.943z"/><path d="M404.462 201.172c-.028-.195-.076-.382-.11-.577-.064-.374-.134-.748-.23-1.114-.058-.22-.14-.43-.207-.64-.106-.327-.212-.652-.342-.97-.09-.22-.196-.438-.297-.65-.14-.3-.285-.593-.452-.877-.122-.212-.25-.416-.377-.618-.18-.277-.362-.546-.562-.806-.146-.195-.3-.39-.454-.578-.21-.243-.43-.487-.663-.716-.174-.178-.346-.357-.528-.52-.245-.22-.497-.432-.753-.634-.198-.155-.395-.31-.602-.456-.078-.05-.146-.114-.22-.163L257.37 97.656c-4.465-2.976-10.275-2.976-14.74 0l-141.294 94.196c-.073.05-.142.114-.22.163-.207.146-.402.3-.597.456-.26.204-.513.416-.753.634-.187.164-.357.342-.533.52-.23.23-.45.474-.658.717-.16.19-.313.384-.46.578-.194.26-.382.53-.556.806-.134.203-.26.406-.382.618-.163.284-.31.577-.45.877-.103.21-.21.43-.298.65-.13.317-.236.642-.34.968-.07.21-.147.422-.21.642-.096.366-.16.74-.23 1.114-.032.195-.08.382-.106.577-.077.57-.122 1.147-.122 1.733V297.1c0 .585.044 1.162.122 1.74.025.188.074.382.106.568.07.374.134.748.23 1.114.063.22.14.432.21.643.104.324.21.65.34.975.09.222.195.433.297.645.143.3.29.592.45.885.123.204.25.406.383.61.174.276.362.545.557.806.146.203.3.39.46.577.207.243.426.488.657.716.175.177.346.356.533.52.24.22.492.43.752.634.194.155.39.31.597.454.077.05.146.115.22.163L242.63 402.35c2.232 1.487 4.803 2.236 7.372 2.236 2.566 0 5.135-.75 7.368-2.236l141.295-94.197c.074-.047.142-.112.22-.162.207-.145.403-.3.602-.454.256-.203.508-.414.752-.635.182-.163.353-.343.527-.52.232-.23.452-.474.664-.717.155-.187.31-.374.455-.577.2-.26.383-.53.562-.806.126-.204.255-.406.377-.61.167-.293.312-.585.452-.885.1-.212.206-.423.297-.645.13-.324.235-.65.342-.975.068-.21.15-.423.206-.643.1-.366.168-.74.233-1.114.033-.187.08-.38.11-.568.072-.578.118-1.155.118-1.74v-94.197c0-.585-.045-1.162-.118-1.73zm-141.176-67.64l104.088 69.388-46.493 31.103-57.594-38.527v-61.963zm-26.57 0v61.964l-57.593 38.527-46.497-31.103 104.09-69.387zm-114.726 94.24L155.228 250l-33.238 22.233V227.77zm114.725 138.7l-104.088-69.39 46.497-31.093 57.592 38.52v61.96zM250 281.43L203.014 250 250 218.574l46.986 31.428L250 281.432zm13.286 85.04v-61.963l57.595-38.52 46.494 31.093-104.088 69.388zm114.724-94.238L344.777 250l33.233-22.23v44.464z"/></svg>',
        'img/icons/copy.svg': '<svg version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g><g><rect fill="none" width="24" height="24"/><path fill="#7d7d7d" d="M16,1H4C2.9,1,2,1.9,2,3v14h2V3h12V1z M19,5H8C6.9,5,6,5.9,6,7v14c0,1.1,0.9,2,2,2h11c1.1,0,2-0.9,2-2V7C21,5.9,20.1,5,19,5z M19,21H8V7h11V21z"/></g></g></svg>',
        'img/icons/copy2.svg': '<svg version="1.1" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"><g><g><rect fill="none" width="48" height="48"/><path fill="#7d7d7d" d="M32,2H8C5.8,2,4,3.8,4,6v28h4V6h24V2z M38,10H16c-2.2,0-4,1.8-4,4v28c0,2.2,1.8,4,4,4h22c2.2,0,4-1.8,4-4V14C42,11.8,40.2,10,38,10z M38,42H16V14h22V42z"/></g></g></svg>',
        'img/icons/facebook.svg': '<svg version="1.1" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"><g><g><g><path fill="#7d7d7d" d="M40,4H8C5.8,4,4,5.8,4,8l0,32c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V8C44,5.8,42.2,4,40,4z M38,8v6h-4c-1.1,0-2,0.9-2,2v4h6v6h-6v14h-6V26h-4v-6h4v-5c0-3.9,3.1-7,7-7H38z"/></g><g><rect fill="none" width="48" height="48"/></g></g></g></svg>',
        'img/icons/favorite.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24h-24z" fill="none"/> <path d="M12 21.35l-1.45-1.32c-5.15-4.67-8.55-7.75-8.55-11.53 0-3.08 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54l-1.45 1.31z"/></svg>',
        'img/icons/github-icon.svg': '<svg height="1024" width="1024" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"> <path d="M512 0C229.252 0 0 229.25199999999995 0 512c0 226.251 146.688 418.126 350.155 485.813 25.593 4.686 34.937-11.125 34.937-24.626 0-12.188-0.469-52.562-0.718-95.314-128.708 23.46-161.707-31.541-172.469-60.373-5.525-14.809-30.407-60.249-52.398-72.263-17.988-9.828-43.26-33.237-0.917-33.735 40.434-0.476 69.348 37.308 78.471 52.75 45.938 77.749 119.876 55.627 148.999 42.5 4.654-32.999 17.902-55.627 32.501-68.373-113.657-12.939-233.22-56.875-233.22-253.063 0-55.94 19.968-101.561 52.658-137.404-5.22-12.999-22.844-65.095 5.063-135.563 0 0 42.937-13.749 140.811 52.501 40.811-11.406 84.594-17.031 128.124-17.22 43.499 0.188 87.314 5.874 128.188 17.28 97.689-66.311 140.686-52.501 140.686-52.501 28 70.532 10.375 122.564 5.124 135.499 32.811 35.844 52.626 81.468 52.626 137.404 0 196.686-119.751 240-233.813 252.686 18.439 15.876 34.748 47.001 34.748 94.748 0 68.437-0.686 123.627-0.686 140.501 0 13.625 9.312 29.561 35.25 24.562C877.436 929.998 1024 738.126 1024 512 1024 229.25199999999995 794.748 0 512 0z" /></svg>',
        'img/icons/github.svg': '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="8 11 33 28"><path fill="#333" d="M11.828,18.179c0,0-3.344,3.499-2.763,9.192 c0.581,5.694,4.186,10.392,16.208,10.392c12.021,0,15.045-6.275,15.116-11.436c0.071-5.159-2.253-7.46-3.344-8.243 c0,0,0.007-3.704-0.343-5.661c0,0-1.85-0.219-5.845,2.07c0,0-5.454-0.533-12.722,0.065c0,0-3.053-2.04-6.129-2.574 C12.006,11.984,11.496,15.196,11.828,18.179z"/><path fill="#E2B89F" d="M17.211,23.815h14.916c0,0,4.227-0.475,4.227,6.44 c0.034,6.086-11.139,5.693-11.139,5.693s-12.236,0.486-12.243-6.269C12.956,23.579,17.211,23.815,17.211,23.815z"/><g> <g> <path fill="#9C584F" d="M30.767,26.591c0.959,0,1.737,1.25,1.737,2.787 c0,1.54-0.778,2.788-1.737,2.788c-0.958,0-1.736-1.248-1.736-2.788C29.03,27.841,29.809,26.591,30.767,26.591z"/> <path fill="#FFFFFF" d="M30.767,32.666c-1.254,0-2.236-1.444-2.236-3.288c0-1.843,0.982-3.287,2.236-3.287 c1.255,0,2.237,1.444,2.237,3.287C33.004,31.222,32.021,32.666,30.767,32.666z M30.767,27.091c-0.585,0-1.236,0.939-1.236,2.287 c0,1.349,0.651,2.288,1.236,2.288s1.237-0.939,1.237-2.288C32.004,28.03,31.352,27.091,30.767,27.091z"/> </g></g><g> <g> <path fill="#9C584F" d="M18.767,26.591c0.959,0,1.737,1.25,1.737,2.787 c0,1.54-0.778,2.788-1.737,2.788c-0.958,0-1.736-1.248-1.736-2.788C17.03,27.841,17.809,26.591,18.767,26.591z"/> <path fill="#FFFFFF" d="M18.767,32.666c-1.254,0-2.236-1.444-2.236-3.288c0-1.843,0.982-3.287,2.236-3.287 c1.254,0,2.237,1.444,2.237,3.287C21.004,31.222,20.021,32.666,18.767,32.666z M18.767,27.091c-0.585,0-1.236,0.939-1.236,2.287 c0,1.349,0.651,2.288,1.236,2.288c0.585,0,1.237-0.939,1.237-2.288C20.004,28.03,19.352,27.091,18.767,27.091z"/> </g></g><path fill="#9C584F" d="M24.076,32.705c0,0,0.499-1.418,1.109-0.089 c0,0-0.457,0.297-0.285,0.996l1.428,0.546h-3.23l1.28-0.575C24.378,33.583,24.562,32.527,24.076,32.705z"/></svg>',
        'img/icons/hangout.svg': '<svg version="1.1" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"><g><g><path fill="#159F5C" d="M23,4C13.6,4,6,11.6,6,21s7.6,17,17,17h1v7c9.7-4.7,16-15,16-24C40,11.6,32.4,4,23,4z M22,22l-2,4h-3l2-4h-3v-6h6V22zM30,22l-2,4h-3l2-4h-3v-6h6V22z"/><rect x="0" fill="none" width="48" height="48"/></g></g></svg>',
        'img/icons/ic_access_time_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-440" fill="none" width="1400" height="3600"/> </g></g><g id="Labels"></g><g id="Icon"> <g> <g> <path fill-opacity="0.9" d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8 s3.6-8,8-8c4.4,0,8,3.6,8,8S16.4,20,12,20z"/> </g> <rect fill="none" width="24" height="24"/> <polygon fill-opacity="0.9" points="12.5,7 11,7 11,13 16.2,16.2 17,14.9 12.5,12.2 "/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_arrow_back_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-568" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <rect fill="none" width="24" height="24"/> <path d="M20,11H7.8l5.6-5.6L12,4l-8,8l8,8l1.4-1.4L7.8,13H20V11z"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_build_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill-rule="evenodd" clip-rule="evenodd" fill="none" d="M0 0h24v24H0z"/> <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>',
        'img/icons/ic_chevron_right_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-1336" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <polygon points="10,6 8.6,7.4 13.2,12 8.6,16.6 10,18 16,12 "/> <rect fill="none" width="24" height="24"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_close_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        'img/icons/ic_code_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="none" d="M0 0h24v24H0V0z"/> <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>',
        'img/icons/ic_comment_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-1464" fill="none" width="1400" height="3600"/> </g></g><g id="Labels"></g><g id="Icon"> <g> <path d="M22,4c0-1.1-0.9-2-2-2H4C2.9,2,2,2.9,2,4v12c0,1.1,0.9,2,2,2h14l4,4L22,4z M18,14H6v-2h12V14z M18,11H6V9h12V11z M18,8H6 V6h12V8z"/> <rect x="0" fill="none" width="24" height="24"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_email_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M20 4h-16c-1.1 0-1.99.9-1.99 2l-.01 12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z"/> <path d="M0 0h24v24h-24z" fill="none"/></svg>',
        'img/icons/ic_insert_drive_file_24px.svg': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><g> <path d="M6,2C4.9,2,4,2.9,4,4l0,16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8l-6-6H6z M13,9V3.5L18.5,9H13z"/></g></svg>',
        'img/icons/ic_label_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-568" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <rect fill="none" width="24" height="24"/> <path d="M17.6,5.8C17.3,5.3,16.7,5,16,5L5,5C3.9,5,3,5.9,3,7v10c0,1.1,0.9,2,2,2l11,0c0.7,0,1.3-0.3,1.6-0.8L22,12L17.6,5.8z"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_launch_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-824" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <rect fill="none" width="24" height="24"/> <path d="M19,19H5V5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-7h-2V19z M14,3v2h3.6l-9.8,9.8l1.4,1.4L19,6.4 V10h2V3H14z" /> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_menu_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-2232" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <rect fill="none" width="24" height="24"/> <path d="M3,18h18v-2H3V18z M3,13h18v-2H3V13z M3,6v2h18V6H3z"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_more_vert_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-2488" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <rect fill="none" width="24" height="24"/> <path d="M12,8c1.1,0,2-0.9,2-2s-0.9-2-2-2c-1.1,0-2,0.9-2,2S10.9,8,12,8z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2c1.1,0,2-0.9,2-2 S13.1,10,12,10z M12,16c-1.1,0-2,0.9-2,2s0.9,2,2,2c1.1,0,2-0.9,2-2S13.1,16,12,16z"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_ondemand_video_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="none" d="M0 0h24v24H0V0z"/> <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z"/></svg>',
        'img/icons/ic_people_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-2616" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <g> <rect fill="none" width="24" height="24"/> </g> <path d="M16,11c1.7,0,3-1.3,3-3c0-1.7-1.3-3-3-3c-1.7,0-3,1.3-3,3C13,9.7,14.3,11,16,11z M8,11c1.7,0,3-1.3,3-3c0-1.7-1.3-3-3-3 C6.3,5,5,6.3,5,8C5,9.7,6.3,11,8,11z M8,13c-2.3,0-7,1.2-7,3.5V19h14v-2.5C15,14.2,10.3,13,8,13z M16,13c-0.3,0-0.6,0-1,0.1 c1.2,0.8,2,2,2,3.4V19h6v-2.5C23,14.2,18.3,13,16,13z"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_person_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/> <path d="M0 0h24v24h-24z" fill="none"/></svg>',
        'img/icons/ic_phone_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24h-24z" fill="none"/> <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1v3.49c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
        'img/icons/ic_photo_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-2616" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <rect x="0" fill="none" width="24" height="24"/> <path d="M21,19V5c0-1.1-0.9-2-2-2H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14C20.1,21,21,20.1,21,19z M8.5,13.5l2.5,3l3.5-4.5l4.5,6 H5L8.5,13.5z"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_place_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/> <path d="M0 0h24v24h-24z" fill="none"/></svg>',
        'img/icons/ic_play_arrow_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-2232" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <polygon points="8,5 8,19 19,12 " style="fill:#f3f3f3;" /> <rect fill="none" width="24" height="24"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_play_circle_fill_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>',
        'img/icons/ic_refresh_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-2616" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <path d="M17.6,6.4C16.2,4.9,14.2,4,12,4c-4.4,0-8,3.6-8,8s3.6,8,8,8c3.7,0,6.8-2.6,7.7-6h-2.1c-0.8,2.3-3,4-5.6,4 c-3.3,0-6-2.7-6-6s2.7-6,6-6c1.7,0,3.1,0.7,4.2,1.8L13,11h7V4L17.6,6.4z"/> <rect fill="none" width="24" height="24"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/ic_school_24px.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>',
        'img/icons/ic_visibility_24px.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-1592" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><g id="Icon"> <g> <rect fill="none" width="24" height="24"/> <path d="M12,4.5C7,4.5,2.7,7.6,1,12c1.7,4.4,6,7.5,11,7.5c5,0,9.3-3.1,11-7.5C21.3,7.6,17,4.5,12,4.5z M12,17c-2.8,0-5-2.2-5-5 s2.2-5,5-5c2.8,0,5,2.2,5,5S14.8,17,12,17z M12,9c-1.7,0-3,1.3-3,3s1.3,3,3,3c1.7,0,3-1.3,3-3S13.7,9,12,9z"/> </g></g><g id="Grid" display="none"> <g display="inline"> </g></g></svg>',
        'img/icons/launch.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24h-24z" fill="none"/> <path d="M19 19h-14v-14h7v-2h-7c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zm-5-16v2h3.59l-9.83 9.83 1.41 1.41 9.83-9.83v3.59h2v-7h-7z"/></svg>',
        'img/icons/mail.svg': '<svg version="1.1" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"><g><g><path fill="#7d7d7d" d="M40,8H8c-2.2,0-4,1.8-4,4l0,24c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V12C44,9.8,42.2,8,40,8z M40,16L24,26L8,16v-4l16,10l16-10V16z"/><rect fill="none" width="48" height="48"/></g></g></svg>',
        'img/icons/menu.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"> <path d="M0 0h18v18h-18z" fill="none"/> <path d="M2 13.5h14v-1.5h-14v1.5zm0-4h14v-1.5h-14v1.5zm0-5.5v1.5h14v-1.5h-14z"/></svg>',
        'img/icons/message.svg': '<svg version="1.1" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"><g><g><path fill="#7d7d7d" d="M40,4H8C5.8,4,4,5.8,4,8l0,36l8-8h28c2.2,0,4-1.8,4-4V8C44,5.8,42.2,4,40,4z M36,28H12v-4h24V28z M36,22H12v-4h24V22zM36,16H12v-4h24V16z"/><rect x="0" fill="none" width="48" height="48"/></g></g></svg>',
        'img/icons/more_vert.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"> <path d="M0 0h18v18h-18z" fill="none"/> <path d="M9 5.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm0 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>',
        'img/icons/npm-logo.svg': '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="540px" height="210px" viewBox="0 0 18 7"><path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/><polygon fill="#FFFFFF" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/><path fill="#FFFFFF" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/><polygon fill="#FFFFFF" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/></svg>',
        'img/icons/octicon-repo.svg': '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48"><path d="M21,12h-3v3h3V12z M21,6h-3v3h3V6z M39,0C37.5,0,10.5,0,9,0S6,1.5,6,3s0,34.5,0,36s1.5,3,3,3s6,0,6,0v6l4.5-4.5L24,48v-6 c0,0,13.5,0,15,0s3-1.5,3-3s0-34.5,0-36S40.5,0,39,0z M39,37.5c0,0.75-0.703,1.5-1.5,1.5S24,39,24,39v-3h-9v3c0,0-3.703,0-4.5,0 S9,38.203,9,37.5S9,33,9,33h30C39,33,39,36.75,39,37.5z M39,30H15V3h24.047L39,30z M21,24h-3v3h3V24z M21,18h-3v3h3V18z"/></svg>',
        'img/icons/print.svg': '<svg version="1.1" x="0px" y="0px" width="24px"height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g><g><g><path d="M19,8H5c-1.7,0-3,1.3-3,3v6h4v4h12v-4h4v-6C22,9.3,20.7,8,19,8z M16,19H8v-5h8V19z M19,12c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S19.6,12,19,12z M18,3H6v4h12V3z" fill="#7d7d7d"/></g><rect fill="none" width="24" height="24"/></g></g></svg>',
        'img/icons/separator.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.4, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 4 6" enable-background="new 0 0 4 6" xml:space="preserve"><g> <polygon fill="#FFFFFF" points="3.719,3 0.968,0.25 0.281,0.938 2.344,3 0.281,5.062 0.968,5.75 "/></g></svg>',
        'img/icons/sets/communication-icons.svg': '<svg><defs><g id="business"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></g><g id="call"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></g><g id="call-end"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></g><g id="call-made"><path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/></g><g id="call-merge"><path d="M17 20.41L18.41 19 15 15.59 13.59 17 17 20.41zM7.5 8H11v5.59L5.59 19 7 20.41l6-6V8h3.5L12 3.5 7.5 8z"/></g><g id="call-missed"><path d="M19.59 7L12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z"/></g><g id="call-received"><path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z"/></g><g id="call-split"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"/></g><g id="chat"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></g><g id="clear-all"><path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"/></g><g id="comment"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></g><g id="contacts"><path d="M20 0H4v2h16V0zM4 24h16v-2H4v2zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z"/></g><g id="dialer-sip"><path d="M17 3h-1v5h1V3zm-2 2h-2V4h2V3h-3v3h2v1h-2v1h3V5zm3-2v5h1V6h2V3h-3zm2 2h-1V4h1v1zm0 10.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.27-.26.35-.65.24-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/></g><g id="dialpad"><path d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></g><g id="dnd-on"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/></g><g id="email"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></g><g id="forum"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></g><g id="import-export"><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/></g><g id="invert-colors-off"><path d="M20.65 20.87l-2.35-2.35-6.3-6.29-3.56-3.57-1.42-1.41L4.27 4.5 3 5.77l2.78 2.78c-2.55 3.14-2.36 7.76.56 10.69C7.9 20.8 9.95 21.58 12 21.58c1.79 0 3.57-.59 5.03-1.78l2.7 2.7L21 21.23l-.35-.36zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59c0-1.32.43-2.57 1.21-3.6L12 14.77v4.82zM12 5.1v4.58l7.25 7.26c1.37-2.96.84-6.57-1.6-9.01L12 2.27l-3.7 3.7 1.41 1.41L12 5.1z"/></g><g id="invert-colors-on"><path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"/></g><g id="live-help"><path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></g><g id="location-off"><path d="M12 6.5c1.38 0 2.5 1.12 2.5 2.5 0 .74-.33 1.39-.83 1.85l3.63 3.63c.98-1.86 1.7-3.8 1.7-5.48 0-3.87-3.13-7-7-7-1.98 0-3.76.83-5.04 2.15l3.19 3.19c.46-.52 1.11-.84 1.85-.84zm4.37 9.6l-4.63-4.63-.11-.11L3.27 3 2 4.27l3.18 3.18C5.07 7.95 5 8.47 5 9c0 5.25 7 13 7 13s1.67-1.85 3.38-4.35L18.73 21 20 19.73l-3.63-3.63z"/></g><g id="location-on"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></g><g id="message"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></g><g id="messenger"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></g><g id="no-sim"><path d="M18.99 5c0-1.1-.89-2-1.99-2h-7L7.66 5.34 19 16.68 18.99 5zM3.65 3.88L2.38 5.15 5 7.77V19c0 1.1.9 2 2 2h10.01c.35 0 .67-.1.96-.26l1.88 1.88 1.27-1.27L3.65 3.88z"/></g><g id="phone"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></g><g id="portable-wifi-off"><path d="M17.56 14.24c.28-.69.44-1.45.44-2.24 0-3.31-2.69-6-6-6-.79 0-1.55.16-2.24.44l1.62 1.62c.2-.03.41-.06.62-.06 2.21 0 4 1.79 4 4 0 .21-.02.42-.05.63l1.61 1.61zM12 4c4.42 0 8 3.58 8 8 0 1.35-.35 2.62-.95 3.74l1.47 1.47C21.46 15.69 22 13.91 22 12c0-5.52-4.48-10-10-10-1.91 0-3.69.55-5.21 1.47l1.46 1.46C9.37 4.34 10.65 4 12 4zM3.27 2.5L2 3.77l2.1 2.1C2.79 7.57 2 9.69 2 12c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 17.53 4 14.96 4 12c0-1.76.57-3.38 1.53-4.69l1.43 1.44C6.36 9.68 6 10.8 6 12c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-.65.17-1.25.44-1.79l1.58 1.58L10 12c0 1.1.9 2 2 2l.21-.02.01.01 7.51 7.51L21 20.23 4.27 3.5l-1-1z"/></g><g id="quick-contacts-dialer"><path d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm3.85-4h1.64L21 16l-1.99 1.99c-1.31-.98-2.28-2.38-2.73-3.99-.18-.64-.28-1.31-.28-2s.1-1.36.28-2c.45-1.62 1.42-3.01 2.73-3.99L21 8l-1.51 2h-1.64c-.22.63-.35 1.3-.35 2s.13 1.37.35 2z"/></g><g id="quick-contacts-mail"><path d="M21 8V7l-3 2-3-2v1l3 2 3-2zm1-5H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm8-6h-8V6h8v6z"/></g><g id="ring-volume"><path d="M23.71 16.67C20.66 13.78 16.54 12 12 12 7.46 12 3.34 13.78.29 16.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73s3.15.25 4.6.72v3.1c0 .39.23.74.56.9.98.49 1.87 1.12 2.66 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.27-.11-.52-.29-.7zM21.16 6.26l-1.41-1.41-3.56 3.55 1.41 1.41s3.45-3.52 3.56-3.55zM13 2h-2v5h2V2zM6.4 9.81L7.81 8.4 4.26 4.84 2.84 6.26c.11.03 3.56 3.55 3.56 3.55z"/></g><g id="stay-current-landscape"><path d="M1.01 7L1 17c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3c-1.1 0-1.99.9-1.99 2zM19 7v10H5V7h14z"/></g><g id="stay-current-portrait"><path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></g><g id="stay-primary-landscape"><path d="M1.01 7L1 17c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3c-1.1 0-1.99.9-1.99 2zM19 7v10H5V7h14z"/></g><g id="stay-primary-portrait"><path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></g><g id="swap-calls"><path d="M18 4l-4 4h3v7c0 1.1-.9 2-2 2s-2-.9-2-2V8c0-2.21-1.79-4-4-4S5 5.79 5 8v7H2l4 4 4-4H7V8c0-1.1.9-2 2-2s2 .9 2 2v7c0 2.21 1.79 4 4 4s4-1.79 4-4V8h3l-4-4z"/></g><g id="textsms"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></g><g id="voicemail"><path d="M18.5 6C15.46 6 13 8.46 13 11.5c0 1.33.47 2.55 1.26 3.5H9.74c.79-.95 1.26-2.17 1.26-3.5C11 8.46 8.54 6 5.5 6S0 8.46 0 11.5 2.46 17 5.5 17h13c3.04 0 5.5-2.46 5.5-5.5S21.54 6 18.5 6zm-13 9C3.57 15 2 13.43 2 11.5S3.57 8 5.5 8 9 9.57 9 11.5 7.43 15 5.5 15zm13 0c-1.93 0-3.5-1.57-3.5-3.5S16.57 8 18.5 8 22 9.57 22 11.5 20.43 15 18.5 15z"/></g><g id="vpn-key"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></g></defs></svg>',
        'img/icons/sets/core-icons.svg': '<svg><defs><g id="3d-rotation"><path d="M7.52 21.48C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32zm.89-6.52c-.19 0-.37-.03-.52-.08-.16-.06-.29-.13-.4-.24-.11-.1-.2-.22-.26-.37-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.68.21.95.14.27.33.5.56.69.24.18.51.32.82.41.3.1.62.15.96.15.37 0 .72-.05 1.03-.15.32-.1.6-.25.83-.44s.42-.43.55-.72c.13-.29.2-.61.2-.97 0-.19-.02-.38-.07-.56-.05-.18-.12-.35-.23-.51-.1-.16-.24-.3-.4-.43-.17-.13-.37-.23-.61-.31.2-.09.37-.2.52-.33.15-.13.27-.27.37-.42.1-.15.17-.3.22-.46.05-.16.07-.32.07-.48 0-.36-.06-.68-.18-.96-.12-.28-.29-.51-.51-.69-.2-.19-.47-.33-.77-.43C9.1 8.05 8.76 8 8.39 8c-.36 0-.69.05-1 .16-.3.11-.57.26-.79.45-.21.19-.38.41-.51.67-.12.26-.18.54-.18.85h1.3c0-.17.03-.32.09-.45s.14-.25.25-.34c.11-.09.23-.17.38-.22.15-.05.3-.08.48-.08.4 0 .7.1.89.31.19.2.29.49.29.86 0 .18-.03.34-.08.49-.05.15-.14.27-.25.37-.11.1-.25.18-.41.24-.16.06-.36.09-.58.09H7.5v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.22.24.29.4.07.16.1.35.1.57 0 .41-.12.72-.35.93-.23.23-.55.33-.95.33zm8.55-5.92c-.32-.33-.7-.59-1.14-.77-.43-.18-.92-.27-1.46-.27H12v8h2.3c.55 0 1.06-.09 1.51-.27.45-.18.84-.43 1.16-.76.32-.33.57-.73.74-1.19.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57-.18-.47-.43-.87-.75-1.2zm-.39 3.16c0 .42-.05.79-.14 1.13-.1.33-.24.62-.43.85-.19.23-.43.41-.71.53-.29.12-.62.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69.38.46.57 1.12.57 1.99v.4zM12 0l-.66.03 3.81 3.81 1.33-1.33c3.27 1.55 5.61 4.72 5.96 8.48h1.5C23.44 4.84 18.29 0 12 0z"/></g><g id="accessibility"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></g><g id="account-balance"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/></g><g id="account-balance-wallet"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></g><g id="account-box"><path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/></g><g id="account-child"><circle cx="12" cy="13.49" r="1.5"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2.5c1.24 0 2.25 1.01 2.25 2.25S13.24 9 12 9 9.75 7.99 9.75 6.75 10.76 4.5 12 4.5zm5 10.56v2.5c-.45.41-.96.77-1.5 1.05v-.68c0-.34-.17-.65-.46-.92-.65-.62-1.89-1.02-3.04-1.02-.96 0-1.96.28-2.65.73l-.17.12-.21.17c.78.47 1.63.72 2.54.82l1.33.15c.37.04.66.36.66.75 0 .29-.16.53-.4.66-.28.15-.64.09-.95.09-.35 0-.69-.01-1.03-.05-.5-.06-.99-.17-1.46-.33-.49-.16-.97-.38-1.42-.64-.22-.13-.44-.27-.65-.43l-.31-.24c-.04-.02-.28-.18-.28-.23v-4.28c0-1.58 2.63-2.78 5-2.78s5 1.2 5 2.78v1.78z"/></g><g id="account-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></g><g id="add"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></g><g id="add-box"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></g><g id="add-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></g><g id="add-circle-outline"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></g><g id="add-shopping-cart"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/></g><g id="alarm"><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></g><g id="alarm-add"><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"/></g><g id="alarm-off"><path d="M12 6c3.87 0 7 3.13 7 7 0 .84-.16 1.65-.43 2.4l1.52 1.52c.58-1.19.91-2.51.91-3.92 0-4.97-4.03-9-9-9-1.41 0-2.73.33-3.92.91L9.6 6.43C10.35 6.16 11.16 6 12 6zm10-.28l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM2.92 2.29L1.65 3.57 2.98 4.9l-1.11.93 1.42 1.42 1.11-.94.8.8C3.83 8.69 3 10.75 3 13c0 4.97 4.02 9 9 9 2.25 0 4.31-.83 5.89-2.2l2.2 2.2 1.27-1.27L3.89 3.27l-.97-.98zm13.55 16.1C15.26 19.39 13.7 20 12 20c-3.87 0-7-3.13-7-7 0-1.7.61-3.26 1.61-4.47l9.86 9.86zM8.02 3.28L6.6 1.86l-.86.71 1.42 1.42.86-.71z"/></g><g id="alarm-on"><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-1.46-5.47L8.41 12.4l-1.06 1.06 3.18 3.18 6-6-1.06-1.06-4.93 4.95z"/></g><g id="android"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/></g><g id="announcement"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/></g><g id="apps"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></g><g id="archive"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/></g><g id="arrow-back"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></g><g id="arrow-drop-down"><path d="M7 10l5 5 5-5z"/></g><g id="arrow-drop-down-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 12l-4-4h8l-4 4z"/></g><g id="arrow-drop-up"><path d="M7 14l5-5 5 5z"/></g><g id="cached"><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/></g></defs></svg>',
        'img/icons/sets/device-icons.svg': '<svg><defs><g id="access-alarm"><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></g><g id="access-alarms"><path d="M22 5.7l-4.6-3.9-1.3 1.5 4.6 3.9L22 5.7zM7.9 3.4L6.6 1.9 2 5.7l1.3 1.5 4.6-3.8zM12.5 8H11v6l4.7 2.9.8-1.2-4-2.4V8zM12 4c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"/></g><g id="access-time"><path fill-opacity=".9" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></g><g id="add-alarm"><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"/></g><g id="airplanemode-off"><path d="M13 9V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v3.68l7.83 7.83L21 16v-2l-8-5zM3 5.27l4.99 4.99L2 14v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-3.73L18.73 21 20 19.73 4.27 4 3 5.27z"/></g><g id="airplanemode-on"><path d="M10.18 9"/><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></g><g id="battery-20"><path d="M7 17v3.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V17H7z"/><path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V17h10V5.33z"/></g><g id="battery-30"><path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V15h10V5.33z"/><path d="M7 15v5.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V15H7z"/></g><g id="battery-50"><path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V13h10V5.33z"/><path d="M7 13v7.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V13H7z"/></g><g id="battery-60"><path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V11h10V5.33z"/><path d="M7 11v9.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V11H7z"/></g><g id="battery-80"><path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V9h10V5.33z"/><path d="M7 9v11.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V9H7z"/></g><g id="battery-90"><path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V8h10V5.33z"/><path d="M7 8v12.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V8H7z"/></g><g id="battery-alert"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/></g><g id="battery-charging-20"><path d="M11 20v-3H7v3.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V17h-4.4L11 20z"/><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V17h4v-2.5H9L13 7v5.5h2L12.6 17H17V5.33C17 4.6 16.4 4 15.67 4z"/></g><g id="battery-charging-30"><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v9.17h2L13 7v5.5h2l-1.07 2H17V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M11 20v-5.5H7v6.17C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V14.5h-3.07L11 20z"/></g><g id="battery-charging-50"><path d="M14.47 13.5L11 20v-5.5H9l.53-1H7v7.17C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V13.5h-2.53z"/><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v8.17h2.53L13 7v5.5h2l-.53 1H17V5.33C17 4.6 16.4 4 15.67 4z"/></g><g id="battery-charging-60"><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V11h3.87L13 7v4h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9l1.87-3.5H7v9.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V11h-4v1.5z"/></g><g id="battery-charging-80"><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V9h4.93L13 7v2h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9L11.93 9H7v11.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V9h-4v3.5z"/></g><g id="battery-charging-90"><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V8h5.47L13 7v1h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9L12.47 8H7v12.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V8h-4v4.5z"/></g><g id="battery-charging-full"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z"/></g><g id="battery-full"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></g><g id="battery-std"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></g><g id="battery-unknown"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zm-2.72 13.95h-1.9v-1.9h1.9v1.9zm1.35-5.26s-.38.42-.67.71c-.48.48-.83 1.15-.83 1.6h-1.6c0-.83.46-1.52.93-2l.93-.94c.27-.27.44-.65.44-1.06 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5H9c0-1.66 1.34-3 3-3s3 1.34 3 3c0 .66-.27 1.26-.7 1.69z"/></g><g id="bluetooth"><path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/></g><g id="bluetooth-connected"><path d="M7 12l-2-2-2 2 2 2 2-2zm10.71-4.29L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88zM19 10l-2 2 2 2 2-2-2-2z"/></g><g id="bluetooth-disabled"><path d="M13 5.83l1.88 1.88-1.6 1.6 1.41 1.41 3.02-3.02L12 2h-1v5.03l2 2v-3.2zM5.41 4L4 5.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l4.29-4.29 2.3 2.29L20 18.59 5.41 4zM13 18.17v-3.76l1.88 1.88L13 18.17z"/></g><g id="bluetooth-searching"><path d="M14.24 12.01l2.32 2.32c.28-.72.44-1.51.44-2.33 0-.82-.16-1.59-.43-2.31l-2.33 2.32zm5.29-5.3l-1.26 1.26c.63 1.21.98 2.57.98 4.02s-.36 2.82-.98 4.02l1.2 1.2c.97-1.54 1.54-3.36 1.54-5.31-.01-1.89-.55-3.67-1.48-5.19zm-3.82 1L10 2H9v7.59L4.41 5 3 6.41 8.59 12 3 17.59 4.41 19 9 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM11 5.83l1.88 1.88L11 9.59V5.83zm1.88 10.46L11 18.17v-3.76l1.88 1.88z"/></g><g id="brightness-auto"><path d="M10.85 12.65h2.3L12 9l-1.15 3.65zM20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM14.3 16l-.7-2h-3.2l-.7 2H7.8L11 7h2l3.2 9h-1.9z"/></g><g id="brightness-high"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></g><g id="brightness-low"><path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></g><g id="brightness-medium"><path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/></g><g id="data-usage"><path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/></g><g id="developer-mode"><path d="M7 5h10v2h2V3c0-1.1-.9-1.99-2-1.99L7 1c-1.1 0-2 .9-2 2v4h2V5zm8.41 11.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42zM10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17zM17 19H7v-2H5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4h-2v2z"/></g><g id="devices"><path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/></g><g id="dvr"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-2-9H8v2h11V8zm0 4H8v2h11v-2zM7 8H5v2h2V8zm0 4H5v2h2v-2z"/></g><g id="gps-fixed"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></g><g id="gps-not-fixed"><path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></g><g id="gps-off"><path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06c-1.13.12-2.19.46-3.16.97l1.5 1.5C10.16 5.19 11.06 5 12 5c3.87 0 7 3.13 7 7 0 .94-.19 1.84-.52 2.65l1.5 1.5c.5-.96.84-2.02.97-3.15H23v-2h-2.06zM3 4.27l2.04 2.04C3.97 7.62 3.25 9.23 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c1.77-.2 3.38-.91 4.69-1.98L19.73 21 21 19.73 4.27 3 3 4.27zm13.27 13.27C15.09 18.45 13.61 19 12 19c-3.87 0-7-3.13-7-7 0-1.61.55-3.09 1.46-4.27l9.81 9.81z"/></g><g id="location-disabled"><path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06c-1.13.12-2.19.46-3.16.97l1.5 1.5C10.16 5.19 11.06 5 12 5c3.87 0 7 3.13 7 7 0 .94-.19 1.84-.52 2.65l1.5 1.5c.5-.96.84-2.02.97-3.15H23v-2h-2.06zM3 4.27l2.04 2.04C3.97 7.62 3.25 9.23 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c1.77-.2 3.38-.91 4.69-1.98L19.73 21 21 19.73 4.27 3 3 4.27zm13.27 13.27C15.09 18.45 13.61 19 12 19c-3.87 0-7-3.13-7-7 0-1.61.55-3.09 1.46-4.27l9.81 9.81z"/></g><g id="location-searching"><path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></g><g id="multitrack-audio"><path d="M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z"/></g><g id="network-cell"><path fill-opacity=".3" d="M2 22h20V2z"/><path d="M17 7L2 22h15z"/></g><g id="network-wifi"><path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/></g><g id="nfc"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"/></g><g id="now-wallpaper"><path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/></g><g id="now-widgets"><path d="M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z"/></g><g id="screen-lock-landscape"><path d="M21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-2 12H5V7h14v10zm-9-1h4c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1v-1c0-1.11-.9-2-2-2-1.11 0-2 .9-2 2v1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm.8-6c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2v1h-2.4v-1z"/></g><g id="screen-lock-portrait"><path d="M10 16h4c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1v-1c0-1.11-.9-2-2-2-1.11 0-2 .9-2 2v1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm.8-6c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2v1h-2.4v-1zM17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/></g><g id="screen-lock-rotation"><path d="M23.25 12.77l-2.57-2.57-1.41 1.41 2.22 2.22-5.66 5.66L4.51 8.17l5.66-5.66 2.1 2.1 1.41-1.41L11.23.75c-.59-.59-1.54-.59-2.12 0L2.75 7.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12zM8.47 20.48C5.2 18.94 2.86 15.76 2.5 12H1c.51 6.16 5.66 11 11.95 11l.66-.03-3.81-3.82-1.33 1.33zM16 9h5c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1v-.5C21 1.12 19.88 0 18.5 0S16 1.12 16 2.5V3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm.8-6.5c0-.94.76-1.7 1.7-1.7s1.7.76 1.7 1.7V3h-3.4v-.5z"/></g><g id="screen-rotation"><path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/></g><g id="sd-storage"><path d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 6h-2V4h2v4zm3 0h-2V4h2v4zm3 0h-2V4h2v4z"/></g><g id="settings-system-daydream"><path d="M9 16h6.5c1.38 0 2.5-1.12 2.5-2.5S16.88 11 15.5 11h-.05c-.24-1.69-1.69-3-3.45-3-1.4 0-2.6.83-3.16 2.02h-.16C7.17 10.18 6 11.45 6 13c0 1.66 1.34 3 3 3zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"/></g><g id="signal-cellular-0-bar"><path fill-opacity=".3" d="M2 22h20V2z"/></g><g id="signal-cellular-1-bar"><path fill-opacity=".3" d="M2 22h20V2z"/><path d="M12 12L2 22h10z"/></g><g id="signal-cellular-2-bar"><path fill-opacity=".3" d="M2 22h20V2z"/><path d="M14 10L2 22h12z"/></g><g id="signal-cellular-3-bar"><path fill-opacity=".3" d="M2 22h20V2z"/><path d="M17 7L2 22h15z"/></g><g id="signal-cellular-4-bar"><path d="M2 22h20V2z"/></g><g id="signal-cellular-connected-no-internet-0-bar"><path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M20 22h2v-2h-2v2zm0-12v8h2v-8h-2z"/></g><g id="signal-cellular-connected-no-internet-1-bar"><path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M20 10v8h2v-8h-2zm-8 12V12L2 22h10zm8 0h2v-2h-2v2z"/></g><g id="signal-cellular-connected-no-internet-2-bar"><path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M14 22V10L2 22h12zm6-12v8h2v-8h-2zm0 12h2v-2h-2v2z"/></g><g id="signal-cellular-connected-no-internet-3-bar"><path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M17 22V7L2 22h15zm3-12v8h2v-8h-2zm0 12h2v-2h-2v2z"/></g><g id="signal-cellular-connected-no-internet-4-bar"><path d="M20 18h2v-8h-2v8zm0 4h2v-2h-2v2zM2 22h16V8h4V2L2 22z"/></g><g id="signal-cellular-no-sim"><path d="M18.99 5c0-1.1-.89-2-1.99-2h-7L7.66 5.34 19 16.68 18.99 5zM3.65 3.88L2.38 5.15 5 7.77V19c0 1.1.9 2 2 2h10.01c.35 0 .67-.1.96-.26l1.88 1.88 1.27-1.27L3.65 3.88z"/></g><g id="signal-cellular-null"><path d="M20 6.83V20H6.83L20 6.83M22 2L2 22h20V2z"/></g><g id="signal-cellular-off"><path d="M21 1l-8.59 8.59L21 18.18V1zM4.77 4.5L3.5 5.77l6.36 6.36L1 21h17.73l2 2L22 21.73 4.77 4.5z"/></g><g id="signal-wifi-0-bar"><path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/></g><g id="signal-wifi-1-bar"><path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"/></g><g id="signal-wifi-2-bar"><path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"/></g><g id="signal-wifi-3-bar"><path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/></g><g id="signal-wifi-4-bar"><path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/></g><g id="signal-wifi-off"><path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/></g><g id="storage"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></g><g id="usb"><path d="M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07c.7-.37 1.2-1.08 1.2-1.93 0-1.21-.99-2.2-2.2-2.2-1.21 0-2.2.99-2.2 2.2 0 .85.5 1.56 1.2 1.93V13c0 1.11.89 2 2 2h3v3.05c-.71.37-1.2 1.1-1.2 1.95 0 1.22.99 2.2 2.2 2.2 1.21 0 2.2-.98 2.2-2.2 0-.85-.49-1.58-1.2-1.95V15h3c1.11 0 2-.89 2-2v-2h1V7h-4z"/></g><g id="wifi-lock"><path d="M20.5 9.5c.28 0 .55.04.81.08L24 6c-3.34-2.51-7.5-4-12-4S3.34 3.49 0 6l12 16 3.5-4.67V14.5c0-2.76 2.24-5 5-5zM23 16v-1.5c0-1.38-1.12-2.5-2.5-2.5S18 13.12 18 14.5V16c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1zm-1 0h-3v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V16z"/></g><g id="wifi-tethering"><path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 2c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.75-2 3.45l1 1.74c1.79-1.04 3-2.97 3-5.19zM12 3C6.48 3 2 7.48 2 13c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 18.53 4 15.96 4 13c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.61 5.53-4 6.92l1 1.73c2.99-1.73 5-4.95 5-8.65 0-5.52-4.48-10-10-10z"/></g></defs></svg>',
        'img/icons/sets/social-icons.svg': '<svg><defs><g id="cake"><path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z"/></g><g id="domain"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></g><g id="group"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></g><g id="group-add"><path d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86s-.34 2.04-.9 2.86c.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"/></g><g id="location-city"><path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/></g><g id="mood"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></g><g id="notifications"><path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/></g><g id="notifications-none"><path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2zm-2 1H7v-6.5C7 8.01 9.01 6 11.5 6S16 8.01 16 10.5V17z"/></g><g id="notifications-off"><path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zM18 10.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-.51.12-.99.32-1.45.56L18 14.18V10.5zm-.27 8.5l2 2L21 19.73 4.27 3 3 4.27l2.92 2.92C5.34 8.16 5 9.29 5 10.5V16l-2 2v1h14.73z"/></g><g id="notifications-on"><path d="M6.58 3.58L5.15 2.15C2.76 3.97 1.18 6.8 1.03 10h2c.15-2.65 1.51-4.97 3.55-6.42zM19.97 10h2c-.15-3.2-1.73-6.03-4.13-7.85l-1.43 1.43c2.05 1.45 3.41 3.77 3.56 6.42zm-1.97.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2v-5.5zM11.5 22c.14 0 .27-.01.4-.04.65-.13 1.19-.58 1.44-1.18.1-.24.16-.5.16-.78h-4c0 1.1.9 2 2 2z"/></g><g id="notifications-paused"><path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2zm-4-6.2l-2.8 3.4H14V15H9v-1.8l2.8-3.4H9V8h5v1.8z"/></g><g id="pages"><path d="M3 5v6h5L7 7l4 1V3H5c-1.1 0-2 .9-2 2zm5 8H3v6c0 1.1.9 2 2 2h6v-5l-4 1 1-4zm9 4l-4-1v5h6c1.1 0 2-.9 2-2v-6h-5l1 4zm2-14h-6v5l4-1-1 4h5V5c0-1.1-.9-2-2-2z"/></g><g id="party-mode"><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 3c1.63 0 3.06.79 3.98 2H12c-1.66 0-3 1.34-3 3 0 .35.07.69.18 1H7.1c-.06-.32-.1-.66-.1-1 0-2.76 2.24-5 5-5zm0 10c-1.63 0-3.06-.79-3.98-2H12c1.66 0 3-1.34 3-3 0-.35-.07-.69-.18-1h2.08c.07.32.1.66.1 1 0 2.76-2.24 5-5 5z"/></g><g id="people"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></g><g id="people-outline"><path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></g><g id="person"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></g><g id="person-add"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></g><g id="person-outline"><path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/></g><g id="plus-one"><path d="M10 8H8v4H4v2h4v4h2v-4h4v-2h-4zm4.5-1.92V7.9l2.5-.5V18h2V5z"/></g><g id="poll"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></g><g id="public"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></g><g id="school"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></g><g id="share"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></g><g id="whatshot"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></g></defs></svg>',
        'img/icons/share-arrow.svg': '<svg version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g><g><path fill="#7d7d7d" d="M21,11l-7-7v4C7,9,4,14,3,19c2.5-3.5,6-5.1,11-5.1V18L21,11z"/><rect fill="none" width="24" height="24"/></g></g></svg>',
        'img/icons/tabs-arrow.svg': '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Header"> <g> <rect x="-618" y="-1208" fill="none" width="1400" height="3600"/> </g></g><g id="Label"></g><polygon points="15.4,7.4 14,6 8,12 14,18 15.4,16.6 10.8,12 "/><g id="Grid" display="none"></g></svg>',
        'img/icons/twitter.svg': '<svg version="1.1" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"><g><g><g><path fill="#7d7d7d" d="M40,4H8C5.8,4,4,5.8,4,8l0,32c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V8C44,5.8,42.2,4,40,4z M35.4,18.7c-0.1,9.2-6,15.6-14.8,16c-3.6,0.2-6.3-1-8.6-2.5c2.7,0.4,6-0.6,7.8-2.2c-2.6-0.3-4.2-1.6-4.9-3.8c0.8,0.1,1.6,0.1,2.3-0.1c-2.4-0.8-4.1-2.3-4.2-5.3c0.7,0.3,1.4,0.6,2.3,0.6c-1.8-1-3.1-4.7-1.6-7.2c2.6,2.9,5.8,5.3,11,5.6c-1.3-5.6,6.1-8.6,9.2-4.9c1.3-0.3,2.4-0.8,3.4-1.3c-0.4,1.3-1.2,2.2-2.2,2.9c1.1-0.1,2.1-0.4,2.9-0.8C37.5,16.9,36.4,17.9,35.4,18.7z"/></g><g><rect fill="none" width="48" height="48"/></g></g></g></svg>',
        'img/icons/upload.svg': '<svg version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g><g><rect x="-618" y="-2232" fill="none" width="1400" height="3600"/></g></g><g><g><rect fill="none" width="24" height="24"/><path fill="#7d7d7d" d="M19.4,10c-0.7-3.4-3.7-6-7.4-6C9.1,4,6.6,5.6,5.4,8C2.3,8.4,0,10.9,0,14c0,3.3,2.7,6,6,6h13c2.8,0,5-2.2,5-5C24,12.4,21.9,10.2,19.4,10z M14,13v4h-4v-4H7l5-5l5,5H14z"/></g></g></svg>',
        'icons/avatar-icons.svg': '<svg><defs> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-1" x="128"> <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-10" x="256" y="256"> <path fill="#FFCC80" d="M41.6 123.8s0 .1-.1.1l.3-.4c-.1.2-.1.2-.2.3z"/> <path fill="#8C9EFF" d="M0 0h128v128H0z"/> <path fill="#C2C2C2" d="M34.8 79.5c-2.5-3.4-5.9-6.4-6.9-10.3v-.1l-.6-.5c-.3-1.2.6-2 .5-3l-2.4-1h-6.9s0 17 17.4 17.3c-.9-.9-.7-1.8-1.1-2.4z"/> <path fill="#CFD8DC" d="M21.9 64.2l-.1-.3c0-.1 0-.2-.1-.4v-1l.1-.3c.1-.1.1-.2.1-.3.1-.1.1-.2.1-.2.2-.4.1-.8-.2-1.1-.4-.4-1-.4-1.3 0l-.2.2-.2.2c-.1.1-.2.2-.3.4l-.3.6-.3.6c-.1.2-.2.4-.2.7 0 .2-.1.5-.1.8v.5h3c.2-.2.1-.3 0-.4z"/> <path fill="#eee" d="M116.5 65.2c.1.1.2.1.2.2 0-.1-.1-.2-.2-.2zm8.2 6.1l.6.3c-.3-.1-.4-.2-.6-.3zm1.7 1l.6.3c-.2 0-.4-.1-.6-.3zm-3.4-2.1l.5.3c-.2 0-.4-.2-.5-.3zm-8-6.5zm-.1 64.1c-12-17.2-7.6-52-3.1-67.6v-.1c-3.5-4.2-7.8-11.7-10.2-18.7-1.7-5-4-8.8-6.4-11.8l-1.6-2-10.7 11.8c-1.5 2.1-3.3 1.8-4.1-.6l-7.1-17.3c-.3-.9-.3-1.9 0-2.7.3-1.1-.1-2.1.7-3l-2-.1c-1.3 0-2.5.1-3.7.3-1.7-.3-3.4-.5-5.1-.5-11.9 0-21.9 8.1-24.8 19.2-.5 1.8-.7 3.7-.8 5.6-1.2 3.6-4.2 7.7-11.5 8.4 1.3.4 2.2 1.9 2 3.6l-.5 2.8c-.3 2-1.2 2.4-2.2.9l1.6 8.6.2.9c.1 1.1.3 2.2.6 3.4 1 4 3.2 8.2 7.8 10.9.3.6 1 1.3 2 2.1 8.2 6.7 36 20.7 27.8 46.1h51.3c0-.1-.1-.1-.2-.2zM34.5 59.3c.5 0 1 .4 1 1 0 .5-.4 1-1 1-.5 0-1-.4-1-1s.4-1 1-1zm7.4 3.9c.5 0 1 .4 1 1 0 .5-.4 1-1 1-.5 0-1-.4-1-1 0-.5.5-1 1-1zm-1-8.5c-.5 0-1-.4-1-1 0-.5.4-1 1-1 .5 0 1 .4 1 1s-.5 1-1 1zm3.9-10.9c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6zm73.3 22.7c.1.1.2.2.4.3-.2-.1-.3-.2-.4-.3zm3.2 2.6l.5.3-.5-.3zm-1.6-1.3l.4.3c-.1 0-.3-.1-.4-.3z"/> <path fill="#C2C2C2" d="M114.9 127.8l.2.2H128V73.2l-1-.6-.6-.3-1.2-.7-.6-.3-1.2-.7-.5-.3-1.2-.8-.5-.3-1.2-.9-.4-.3-1.2-1c-.1-.1-.2-.2-.4-.3l-1.3-1.2c-.1-.1-.2-.1-.2-.2l-1.5-1.5c-1.5-1.6-3-3.3-4.4-5.1-4.6 15.4-13 52.7 4.3 69.1z"/> <path fill="#646464" d="M26 55.1l.4-2.8c.2-1.8-.6-3.2-2-3.6-.3-.1-.7-.2-1.1-.1-2 .1-2.7 1.9-1.6 3.8l1.8 3.3c.1.2.2.3.3.4 1 1.3 1.9 1 2.2-1z"/> <circle fill="#444" cx="44.8" cy="42.2" r="2"/> <circle fill="#CFD8DC" cx="34.5" cy="60.3" r="1"/> <circle fill="#CFD8DC" cx="40.9" cy="53.7" r="1"/> <circle fill="#CFD8DC" cx="41.9" cy="64.2" r="1"/> <path fill="#646464" d="M70.7 18.8c-.3.8-.3 1.8 0 2.7l8.1 19.3c.8 2.5 2.6 2.7 4.1.6l12.3-11.8 1.4-1.3c.3-.4.5-.9.6-1.3.4-1.2.3-2.4-.1-3.6-1.1-4.3-5.6-8.9-11.2-10.3-5.6-1.4-10.9-.2-13.6 2.7-.8.8-1.3 1.8-1.6 3z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-11" y="128"> <path fill="#FFCC80" d="M41.6 123.8s0 .1-.1.1l.3-.4c-.1.2-.1.2-.2.3z"/> <path fill="#FFFF8D" d="M0 0h128v128H0z"/> <path fill="#F4B400" d="M110.3 91.4l-.5-.5c.1.2.3.4.5.5zm-4.4-4.5l.4.5c-.1-.2-.3-.4-.4-.5zm9.8 9.5c.2.2.4.4.7.6-.3-.2-.5-.4-.7-.6zM104.3 85c.2.2.3.4.5.5-.2-.1-.4-.3-.5-.5zm3.7 4.1zm16.9 14l.9.6c-.3-.3-.6-.4-.9-.6zm-28.5-29l.1.2c-.1 0-.1-.1-.1-.2zm15.2 18.6c.2.2.4.4.7.6l-.7-.6zm10 8.2l.9.6-.9-.6zm-18.8-17.7l.4.5c-.1-.1-.3-.3-.4-.5zm-1.4-1.7c.1.1.1.2.2.2-.1 0-.1-.1-.2-.2zm12.2 13l.7.6c-.2-.1-.5-.4-.7-.6zm-15-16.8c.1.1.1.2.2.2l-.2-.2zm-1.2-1.8l.2.3c0-.1-.1-.2-.2-.3zm28.4 27.7l-.9-.6-2.4-1.5-.9-.6c-1-.7-2.1-1.4-3.1-2.2l-2.2-1.8c-.2-.2-.4-.4-.7-.6-.5-.4-1-.8-1.4-1.2l-.7-.6-1.3-1.2-.7-.6c-.5-.4-.9-.9-1.3-1.3l-.5-.5-1.8-1.8c-.6-.6-1.1-1.2-1.6-1.8l-.4-.5-1.2-1.3c-.2-.2-.3-.4-.5-.5l-1.1-1.3-.4-.5-1.2-1.5c-.1-.1-.1-.2-.2-.2-.9-1.2-1.8-2.4-2.6-3.6-.1-.1-.1-.2-.2-.2l-1-1.5-.2-.3c-.3-.5-.6-1-1-1.5l-.1-.2c-1.1-1.8-2-3.5-2.9-5.2-3.1-6-4.8-11.4-5.7-15.9-.2-.9-.3-1.7-.4-2.6L85 13l-8 10.2c-3.7-2.6-8.2-4.2-13.1-4.2s-9.4 1.5-13.1 4.1L42.7 13l-1.8 29-7.7 71.8h.2c-.1 1-.2 2-.2 3 0 4 .8 7.7 2.1 11.2H128v-23.1c-.7-.4-1.5-.8-2.2-1.3zM55 38.4c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .8-.7 1.6-1.6 1.6zm17.9 0c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .8-.7 1.6-1.6 1.6z"/> <circle fill="#444" cx="72.9" cy="36.7" r="2"/> <circle fill="#444" cx="55" cy="36.7" r="2"/> <path fill="#444" d="M61.6 39.5c-.5 1-.1 1.7 1 1.7h4.6c1.1 0 1.6-.8 1-1.7l-2.3-4c-.5-1-1.4-1-2 0l-2.3 4z"/> <path fill="#FF5722" d="M92.5 102.7c8.3 11.3 23.6 14.4 35.5 7.8v-5.6l-2.2-1.3-.9-.6-2.4-1.5-.9-.6c-1-.7-2.1-1.4-3.1-2.2l-2.2-1.8c-.2-.2-.4-.4-.7-.6-.5-.4-1-.8-1.4-1.2l-.7-.6-1.3-1.2-.7-.6c-.5-.4-.9-.9-1.3-1.3l-.5-.5-1.8-1.8c-.6-.6-1.1-1.2-1.6-1.8l-.4-.5-1.2-1.3c-.2-.2-.3-.4-.5-.5l-1.1-1.3-.4-.5-1.2-1.5c-.1-.1-.1-.2-.2-.2-.9-1.2-1.8-2.4-2.6-3.6-.1-.1-.1-.2-.2-.2l-1-1.5-.2-.3c-.3-.5-.6-1-1-1.5l-.1-.2c-1.1-1.8-2-3.5-2.9-5.2-7.7 9.4-8.4 23.4-.8 33.7z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-12" x="128" y="128"> <path fill="#B9F6CA" d="M0 0h128v128H0z"/> <path fill="#444" d="M50.4 75.7c-1.6-1.6-3.2-2.9-4.7-4-.9-.6-1-1.7-1.7-2.2-1.8-1-3.2-5.9-5.3-3.4l-.5.8-.4-.9c-1.3-1.2-1-.4-1.3-2.3-.5-4.2 1.2-7.2 5.1-7.8 1-.1 2-.1 2.9.2 9.5-1.8 13.7-7.4 15.2-10 4 5.7 14.3 11.4 38.3 7.8 2.8-4.7 4.5-10.2 4.5-16C102.4 20.8 88.6 7 71.6 7c-6.7 0-12.8 2.1-17.9 5.7L27.9 31C16.3 36.6 8.3 48.5 8.3 62.2c0 19.1 15.5 34.6 34.6 34.6 4.6 0 9-.9 13-2.5.2-8.4-1.4-14.5-5.5-18.6zm-5.9-21.6z"/> <path fill="#8D6E63" d="M73.7 122c6.1.5 13.4-.3 22-3.5-.1-.7-.3-1.4-.5-2.1-.3-1.3-3.8-21.4-4-28.1-.1-7.3.8-11.9 2-14.7h8.7l-2.5-10.1c-.2-2.4-.4-4.7-.7-6.6-.2-1.8-.3-2.3-.8-3.9-24 3.6-34.2-3.7-38.2-9.4-1.4 2.5-5.7 8.8-15.3 10.5-.9-.3-1.9-.3-2.9-.2-3.9.6-6.7 4.5-6.1 8.8.3 2 1.2 3.6 2.5 4.8.2.1 1.5.6 3.3 1.7.7.4 1.6.9 2.4 1.6 1.5 1.1 3.1 2.4 4.7 4 4 4.1 7.6 10.2 7.4 18.5-.1 4.9-1.6 10.6-5.1 17.2.1 0 7.3 10.2 23.1 11.5zM44.5 54.1z"/> <path fill="#FFCC80" d="M41.6 123.8s.1-.2.2-.3c-.1.2-.1.2-.2.3z"/> <circle fill="#444" cx="83.5" cy="63.1" r="2"/> <path fill="#0097A7" d="M73.7 122c-15.9-1.3-23-11.5-23-11.5-2.1 4-5.1 8.4-8.9 13.1l-.3.4c-.5.6-1.1 1.3-1.7 2-.5.6-1 1.3-1.6 2.1h59.7c-.7-3.2-1.5-6.4-2.1-9.5-8.7 3.1-16 3.9-22.1 3.4z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-13" x="256"> <path fill="#448AFF" d="M0 0h128v128H0z"/> <g fill="#00BFA5"> <path d="M73 18.7c-4.8 0-9.7.8-14 2.3-.1.1-.2.2-.4.3l-7.3 4.6c-.6.4-1.4.4-2 .1-.3-.2-.6-.4-.8-.7l-.7-1.1c-.6-1-.3-2.2.6-2.8l7.3-4.6c.4-.2.8-.3 1.2-.3-5.5-3-23.7-10.7-33.7 10.7-11.8 25.4 11 50.2-14.4 62.6 0 0 26.2 13.7 40.9-24.8 3.7 3.2 8.8 5.8 16 7.4-.6-5.6.8-9.8-2.1-12.8-1.3-1.4-2.7-1.5-4-2.4-.7-.5-1.4-.9-2-1.3-1.5-.9-2.6-1.3-2.8-1.4-1.1-1-1.9-2.4-2.1-4.1-.5-3.6-2.2-6.9 1.1-7.4.8-.1 1.6-.1 2.4.2 8-1.5 11.6-6.7 12.8-8.9 3.4 4.8 11.7 9.8 31.9 6.8.3 1.1.6 1.2.8 2.4l.5-1.3c-.1-13-13.2-23.5-29.2-23.5zM56.1 43.2zm5.3 46.5s6 8.6 19.4 9.7c5.1.4 11.3-.3 18.6-2.9-.1-.6-.3-1.2-.4-1.7-.2-1.1-3.2-18-3.4-23.6-.2-6.2.6-10 1.6-12.4h7.3l-2.1-8.5c-.1-2-.4-3.9-.6-5.6 0-.3-.1-.7-.2-1-.2-1.1-.4-2.3-.8-3.4-20.2 3-28.5-2-31.9-6.8-1.2 2.1-4.8 7.4-12.8 8.9-.8-.2-1.6-.3-2.4-.2-3.3.5-5.6 3.8-5.1 7.4.2 1.7 1 3.1 2.1 4.1.2.1 1.3.5 2.8 1.4.6.4 1.3.8 2 1.3 1.3.9 2.6 2 4 3.4 2.9 3 5.6 7.2 6.1 12.8.5 4.5-.6 10.2-4.2 17.1zm27.5-41.2c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3-1.3-.6-1.3-1.3.6-1.3 1.3-1.3zm-32.8-5.3c.1-.1 0-.1 0 0zm-2.4 57.7l.2-.2-.2.2z"/> <circle cx="88.9" cy="49.8" r="2"/> <path d="M80.8 99.3c-13.3-1.1-19.4-9.7-19.4-9.7-1.8 3.4-4.3 7.1-7.5 11l-.3.3c-.4.5-.9 1.1-1.4 1.7-.7.9-1.6 2.1-2.8 3.7-2.3 3.2-5.4 7.8-8.8 13.5-1.4 2.4-2.9 5.1-4.4 8 0 0 0 .1-.1.1h71.3c-.6-1.6-1.3-3.2-1.7-4.8-2.2-8.6-4.6-17.9-6.5-26.8-7.2 2.8-13.3 3.5-18.4 3zM55.7 16.7l-7.3 4.6c-1 .6-1.3 1.9-.6 2.8l.7 1.1c.2.3.5.6.8.7.6.3 1.4.3 2-.1l7.3-4.6.4-.3c.7-.7.8-1.7.3-2.5l-.7-1.1c-.4-.6-1-.9-1.6-1-.5 0-1 .1-1.3.4z"/> </g> <path fill="#444" d="M73 18.7c-4.8 0-9.7.8-14 2.3-.1.1-.2.2-.4.3l-7.3 4.6c-.6.4-1.4.4-2 .1-.3-.2-.6-.4-.8-.7l-.7-1.1c-.6-1-.3-2.2.6-2.8l7.3-4.6c.4-.2.8-.3 1.2-.3-5.5-3-23.7-10.7-33.7 10.7-11.8 25.4 11 50.2-14.4 62.6 0 0 26.2 13.7 40.9-24.8 3.7 3.2 8.8 5.8 16 7.4-.6-5.6.8-9.8-2.1-12.8-1.3-1.4-2.7-1.5-4-2.4-.7-.5-1.4-.9-2-1.3-1.5-.9-2.6-1.3-2.8-1.4-1.1-1-1.9-2.4-2.1-4.1-.5-3.6-2.2-6.9 1.1-7.4.8-.1 1.6-.1 2.4.2 8-1.5 11.6-6.7 12.8-8.9 3.4 4.8 11.7 9.8 31.9 6.8.3 1.1.6 1.2.8 2.4l.5-1.3c-.1-13-13.2-23.5-29.2-23.5zM56.1 43.2z"/> <path fill="#FFE0B2" d="M61.4 89.7s6 8.6 19.4 9.7c5.1.4 11.3-.3 18.6-2.9-.1-.6-.3-1.2-.4-1.7-.2-1.1-3.2-18-3.4-23.6-.2-6.2.6-10 1.6-12.4h7.3l-2.1-8.5c-.1-2-.4-3.9-.6-5.6 0-.3-.1-.7-.2-1-.2-1.1-.4-2.3-.8-3.4-20.2 3-28.5-2-31.9-6.8-1.2 2.1-4.8 7.4-12.8 8.9-.8-.2-1.6-.3-2.4-.2-3.3.5-5.6 3.8-5.1 7.4.2 1.7 1 3.1 2.1 4.1.2.1 1.3.5 2.8 1.4.6.4 1.3.8 2 1.3 1.3.9 2.6 2 4 3.4 2.9 3 5.6 7.2 6.1 12.8.5 4.5-.6 10.2-4.2 17.1zm27.5-41.2c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3-1.3-.6-1.3-1.3.6-1.3 1.3-1.3zm-32.8-5.3c.1-.1 0-.1 0 0z"/> <path fill="#FFCC80" d="M53.7 100.9l.2-.2-.2.2z"/> <circle fill="#444" cx="88.9" cy="49.8" r="2"/> <path fill="#FF5722" d="M80.8 99.3c-13.3-1.1-19.4-9.7-19.4-9.7-1.8 3.4-4.3 7.1-7.5 11l-.3.3c-.4.5-.9 1.1-1.4 1.7-.7.9-1.6 2.1-2.8 3.7-2.3 3.2-5.4 7.8-8.8 13.5-1.4 2.4-2.9 5.1-4.4 8 0 0 0 .1-.1.1h71.3c-.6-1.6-1.3-3.2-1.7-4.8-2.2-8.6-4.6-17.9-6.5-26.8-7.2 2.8-13.3 3.5-18.4 3z"/> <path fill="#00BFA5" d="M55.7 16.7l-7.3 4.6c-1 .6-1.3 1.9-.6 2.8l.7 1.1c.2.3.5.6.8.7.6.3 1.4.3 2-.1l7.3-4.6.4-.3c.7-.7.8-1.7.3-2.5l-.7-1.1c-.4-.6-1-.9-1.6-1-.5 0-1 .1-1.3.4z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-14" x="256" y="128"> <path fill="#B388FF" d="M0 0h128v128H0z"/> <path fill="#1C3AA9" d="M70.5 128h12.4c-5.1-15.8-6.6-23.9-7.2-28.4-1.9 8.8-4 19.3-5.2 28.4z"/> <path d="M92.9 32.8l-.2.1c.1 0 .2 0 .2-.1zm-1.2.5l-.7.1.7-.1zm.6-.2l-.3.1.3-.1zm-52 .3c-.2 0-.5 0-.7-.1.3 0 .5.1.7.1zm-.9-.2l-.5-.1.5.1zm-.7-.2c-.2-.1-.4-.2-.5-.3.1.1.3.2.5.3z" fill="none"/> <path fill="#2A56C6" d="M82.9 90.8v.2-.2z"/> <path fill="#FFE0B2" d="M31.2 47.2zM45.8 93c5.8 5.5 13.6 9.1 22.3 9.3 2.8-.1 5.4-.5 8-1.2l.8-3.8c4.3-19.3 9.7-37.4 15-52.9h6.9L94 36.2c-.2-1.2-.4-2.5-.7-3.6l-.4.3-.2.1-.4.2-.3.1-.3.1-.7.1H40.3c-.2 0-.5 0-.7-.1-.1 0-.1 0-.2-.1l-.5-.1-.2-.1c-.2-.1-.4-.2-.5-.3 0 0-.1 0-.1-.1-.1.2-.1.4-.1.7-1-.3-2-.4-3-.3-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1 0 0 16.3 12.3 3.4 38 .1.2.2.3.3.4zm34.1-51.9c.8 0 1.5.7 1.5 1.6 0 .9-.7 1.6-1.5 1.6s-1.5-.7-1.5-1.6.6-1.6 1.5-1.6z"/> <path fill="#2A56C6" d="M68.1 102.3c-8.7-.2-16.5-3.8-22.3-9.3-.1-.1-.2-.2-.4-.3-3-.2-7.6.2-10.8.6-4.6.6-9.6 1.3-15 2.4-3.6.7-8.1 1.9-19.7 5.3v27h71.4c1.3-9.1 2.9-18.1 4.7-26.9-2.5.7-5.1 1.1-7.9 1.2z"/> <path fill="#6D4C41" d="M61.8 9.8c-7.3 1.1-13.6 5.1-17.9 10.8h43.7C81.5 12.7 71.9 8.3 61.8 9.8z"/> <path fill="#E65100" d="M38.7 33l.2.1c.2.1.3.1.5.1.1 0 .1 0 .2.1l.7.1H91c.2 0 .5 0 .7-.1l.3-.1.3-.1c.1 0 .3-.1.4-.2l.2-.1.4-.3c1-.7 1.6-1.9 1.6-3.2v-4.8c0-2.2-1.8-4-4-4H40.4c-2.2 0-4 1.8-4 4v4.8c0 1.4.7 2.6 1.8 3.3 0 0 .1 0 .1.1s.2.2.4.3z"/> <ellipse fill="#444" cx="79.9" cy="42.7" rx="2" ry="2.2"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-15" y="256"> <path fill="#FF80AB" d="M0 0h128v128H0z"/> <path fill="#5D4037" d="M87.3 11.7c-7.6 0-14.1 4.9-16.4 11.7-2.8-1.6-5.9-2.7-9.1-3.1-13.9-2.1-26.9 7.1-31.1 21.1 5 .8 9.5 3.1 13.4 3.1 1.4-.6 3-.9 4.6-.9 1.1 0 2.2.2 3.3.5 10-1.3 15.2-5.2 17.9-9 .3.5.6 1 1 1.6v.1c2.1 3.1 6.6 7.7 14.7 9.2.9-.3 1.9-.4 3-.2 1.5.2 2.8-1.1 3.8-.1 7-2.2 12.2-8.8 12.2-16.5 0-9.7-7.8-17.5-17.3-17.5z"/> <path d="M70.9 36.6c-.4-.6-.8-1.2-1-1.6.2.5.5 1 1 1.6z" fill="none"/> <path fill="#5D4037" d="M85.6 45.9z"/> <path fill="#FFCC80" d="M48.6 63.8c5.6 0 10.1-4.5 10.1-10.1s-4.5-10.1-10.1-10.1-10.1 4.5-10.1 10.1c.1 5.5 4.6 10.1 10.1 10.1zm-1.7-10.5c0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9-.1 1.6.7 1.6 1.6zm38.7-7.4z"/> <path fill="#F9A825" d="M35.6 117.3c0 2.5 2.1 4.6 4.6 4.6s4.6-2.1 4.6-4.6c0-1.7-.9-3.2-2.3-4-.8-.2-1.8-.3-2.7-.6-2.3.3-4.2 2.2-4.2 4.6z"/> <circle fill="#F9A825" cx="64.3" cy="117.1" r="4.6"/> <path fill="#F9A825" d="M83.4 117.3c0 2.5 2.1 4.6 4.6 4.6 1.5 0 2.8-.7 3.7-1.8l-.7-.9-.6-.8c-.6-.7-1.3-1.5-1.8-2.1l-.3-.4c-.4-.5-.8-.9-1.2-1.5-.3-.4-.6-.8-.9-1.3-1.7.8-2.8 2.4-2.8 4.2z"/> <path fill="#FFEE58" d="M91.6 119.8c-.8 1-2.1 1.7-3.5 1.7-2.4 0-4.4-2-4.4-4.4 0-1.8 1-3.3 2.5-4-3-3.9-5.3-7.5-7.2-11 .2.1-7.3 10.6-23.7 12-3.8.3-8 .1-12.8-.8 1.3.8 2.2 2.2 2.2 3.8 0 2.4-2 4.4-4.4 4.4s-4.4-2-4.4-4.4c0-2.3 1.8-4.2 4-4.4-2.4-.6-4.8-1.3-7.4-2.2-1.2 5.7-2.6 11.6-4.1 17.5h69c-1.4-2-2.6-3.8-3.7-5.3m-29.4-1.2c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4 2 4.4 4.4c0 2.4-2 4.4-4.4 4.4z"/> <path fill="#FFCC80" d="M92.4 45.6c-1-1-2.4-1.7-3.8-1.9-1-.2-2-.1-3 .2-8.1-1.5-12.6-6.1-14.7-9.2-.5-.7-.8-1.2-1.1-1.7-2.7 3.8-7.9 7.7-17.9 9l.9.3-9.4.4.6-.3c-3.9 0-8.3-.4-13.4-1.1-.5 1.7-.9 3.5-1.2 5.3-.2 1.8-.5 3.8-.6 6l-.3 2-2.3 9.4h9c1.2 3 2.1 7.7 1.9 15.3-.2 6.9-3.9 27.7-4.2 29-.1.7-.3 1.4-.5 2.1 2.6.9 5 2 7.3 2.5l2.7.5c4.8.9 9.2 1.4 13 1.1 16.4-1.3 24-12 24-12-9.8-18.4-4.6-30.7 2.1-37.5 1.6-1.7 3.3-3 4.9-4.1.9-.6 1.7-1.2 2.5-1.6 1.8-1.1 3.2-1.6 3.4-1.7 1.3-1.2 2.3-3 2.6-5 .3-2.6-.7-5.3-2.5-7zm-32.9 2.7c.5 1 .8 2 1 3.1l-1-3.1z"/> <path fill="#DB4437" d="M36.6 54.7c.5 6.2 5.7 11.1 12 11.1 6.7 0 12.1-5.4 12.1-12.1 0-5.5-3.7-10.2-8.8-11.6-1-.3-2.1-.5-3.3-.5-1.6 0-3.2.3-4.6.9-4.1 1.7-7.1 5.6-7.4 10.2h-7.7l-.1.9-.3 1.1h8.1zm12-11.1c5.6 0 10.1 4.5 10.1 10.1s-4.5 10.1-10.1 10.1-10.1-4.5-10.1-10.1c.1-5.6 4.6-10.1 10.1-10.1z"/> <circle fill="#444" cx="45.3" cy="53.3" r="2"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-16" x="128" y="256"> <path fill="#B388FF" d="M0 0h128v128H0z"/> <path fill="#444" d="M58.4 24c4.2 5.9 23.9 10.2 38.9 4.6-4.2-14-17.1-23.2-31.1-21.1-11.7 1.8-20.8 11.2-23.7 22.9 7 3.2 14.5-3.8 15.9-6.4z"/> <path fill="#689F38" d="M72.7 101.3C56.3 100 48.8 89.4 48.8 89.4c-2.2 4.2-5.2 8.7-9.2 13.5l-.3.4-1.7 2c-.9 1.1-2 2.6-3.4 4.5-2.8 3.9-6.6 9.5-10.8 16.6l-.8 1.4h80.1c-2.5-9.8-5.1-20.3-7.3-30.2-8.9 3.4-16.5 4.3-22.7 3.7z"/> <path fill="#FFCC80" d="M101.8 51.3l-2.6-10.4c-.2-2.5-.5-4.9-.7-6.9-.2-1.9-.6-3.6-1.2-5.3-24.8 3.7-35-2.5-39.1-8.4-1.5 2.6-5.8 8.4-15.6 10.2-.1.2-.1.5-.1.7-.9-.3-1.9-.4-3-.2-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1 6.6 6.8 12.1 18.6 2.4 37 0 0 7.4 10.6 23.8 11.9 6.3.5 13.8-.3 22.8-3.6l-.5-2.1c-.3-1.4-4-22.1-4.2-29-.2-7.6.7-12.3 1.9-15.3h9zM81.1 40.5c0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9.1-1.6-.7-1.6-1.6zm-41.7 62.8s0 .1-.1.1l.3-.4c0 .1-.1.2-.2.3z"/> <circle fill="#444" cx="82.7" cy="40.5" r="2"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-2"> <path fill="#B9F6CA" d="M0 0h128v128H0z"/> <path fill="#FFCC80" d="M70.1 122.5l.6-.1c6.1-.8 12-2.4 17.7-4.8 1.2-.5 2.4-1.1 3.2-2.1 1.3-1.7-.1-5.6-.5-7.7-.7-3.8-1.3-7.7-1.9-11.5-.7-4.5-1.5-9.1-1.6-13.7-.2-7.6.7-12.3 1.9-15.3h9l-2.6-10.4c-.2-2.4-.4-4.8-.7-6.8-.2-1.9-.6-3.6-1.2-5.3-14.9 2.2-24.5.9-30.7-1.8l-23.1 4.5-.7.1h-.7c-.4-.1-.9-.2-1.2-.4-.4 0-.9 0-1.4.1-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1 5.8 5.9 8.4 13.8 7.4 22-.6 4.7-2.2 9.4-4.4 13.6-.5 1-1 1.6-1.1 2.8-.1 1.1-.1 2.3.1 3.4.4 2.3 1.5 4.4 3 6.2 2.6 3.1 6.4 5 10.4 5.8 3.8.4 7.6.3 11.4-.1zm9.5-67.6c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6c-.1-.8.7-1.6 1.6-1.6zM128 97.7c-3.3 1.9-6.6 3.7-9.9 5.3-3.2 1.5-6.3 2.9-9.6 4.2-.9.4-2.1.5-2.9 1.1-1.1.8-1.9 2.5-2.3 3.7-.6 1.6-.6 3.4.3 4.8.8 1.2 2.1 2 3.5 2.6 5.9 2.9 12.2 5.1 18.6 6.5 1.4.3 2.3 1.8 2.4.1V97.9c-.1.1-.1-.1-.1-.2z"/> <path d="M38.9 47.4zm.7 0z" fill="none"/> <path fill="#444" d="M94.2 44.9c-.8-2.6-1.8-5-3.2-7.2l-7.2 1.4-20.4 4c6.3 2.7 15.9 4 30.8 1.8z"/> <path fill="#E65100" d="M38.9 48.4h.7c.2 0 .5 0 .7-.1l23.1-4.5 20.4-4 23.3-4.5c1.9-.4 3.2-2 2.9-3.6-.3-1.6-2.1-2.6-4.1-2.3l-19.6 3.8-1.3-6.8C83 15.5 70 8.7 55.9 11.5c-14 2.7-23.7 13.9-21.6 24.9h.1l1.7 9v.7c.2.8.7 1.4 1.4 1.9.5.1 1 .3 1.4.4z"/> <circle fill="#444" cx="79.6" cy="56.5" r="2"/> <path fill="#689F38" d="M128 128v-1.8L106.3 108l-.4.2-2.9 1.3c-3 1.3-6 2.6-9.2 3.8l-1.4.5c-9 3.3-16.5 4.1-22.8 3.6-16.4-1.3-23.8-11.9-23.8-11.9-2.2 4.2-5.2 8.7-9.2 13.5l-.3.4-1.7 2c-.9 1.1-2 2.6-3.4 4.5-.4.6-.9 1.3-1.4 2l98.2.1z"/> <path fill="#FFCC80" d="M36.3 119.3s.1-.2.2-.3c-.1.1-.2.2-.2.3z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-3" x="384"> <path fill="#80D8FF" d="M0 0h128v128H0z"/> <path fill="#5D4037" d="M53.7 68.3c.9-.1 1.7-.3 2-.9.1-.2.2-.4.2-.6.2-1-.2-2-.5-3-1.2-3.2-2-6.4-2.2-9.8-.3-3.9.4-7.8 1-11.6l12.7-8.1c.8-.5 1.8-1.5 2.7-1.7.9-.3 2.4.6 3.3.8 1.3.4 2.6.6 4 .9 5.4.9 10.9.7 16.2-.6 1.3-.3 2.7-1.1 4-1.3-.3-2.1-1.5-4.3-2.5-6.1-1-1.9-2.2-3.7-3.6-5.3-2.7-3.2-6-5.8-9.8-7.5-3.3-1.5-6.8-2.4-10.4-2.5 0 0-50.8-8.1-42.4 56.4l12.8.5 8.7.3c.9-.1 2.5.2 3.8.1z"/> <path d="M59.5 25.7l-.3-.4c0 .2.1.3.3.4zm-1-1.2c-.2-.2-.3-.4-.4-.6.1.2.2.4.4.6zm.4.6l-.3-.4.3.4zm1.1 1.2l-.4-.4c.2.1.3.3.4.4zM46.3 56.2zm.5.4l.3.3-.3-.3zm-.2-.2l.2.2-.2-.2zm-.2-.2l.1.1-.1-.1zm14.3-29.3l-.4-.4c.1.1.2.3.4.4zm8.6 4.7l-1-.3c.3 0 .6.2 1 .3zm1.3.3c-.4-.1-.8-.2-1.1-.3.3.1.7.2 1.1.3zm-23.4 25l.4.4c-.2-.1-.3-.3-.4-.4zm27-24.2l-.9-.2c.3.1.6.2.9.2zm-12.8-5.2l-.5-.4c.1.1.3.2.5.4zm6.7 3.7c-.3-.1-.6-.2-.9-.4.2.1.6.2.9.4zm-5.9-3.1l-.6-.5.6.5zm3.7 2.2c-1.4-.6-2.6-1.3-3.6-2.1 1 .7 2.2 1.4 3.6 2.1zm1.1.4l-.9-.4c.2.2.5.3.9.4zm20.1 2.7h-.8.8zm-3.2 0h1.4-1.4zm-3.9 0l1.9.1c-.6 0-1.1 0-1.7-.1H80zm2 0h1.6H82zm6.1-.1c.3 0 .7 0 1-.1h-.2c-.2.1-.5.1-.8.1zm6.2-.6l-.7.1c1.2-.1 2.4-.3 3.6-.5l-2.2.3c-.2.1-.5.1-.7.1zm-3.4.4c-.3 0-.6 0-.8.1.9-.1 1.9-.2 2.9-.3l-.8.1c-.5 0-.9 0-1.3.1zM51.1 61.9c.2.3.4.6.5 1-.2-.4-.3-.7-.5-1zm-3.5-4.6c.8.8 1.8 1.9 2.8 3.5-1-1.5-2-2.7-2.8-3.5zm2.9 3.6l.6.9c-.3-.3-.5-.6-.6-.9zm1.2 2.1l.6 1.1c-.3-.4-.4-.8-.6-1.1zm26.5-29.8l-.9-.1c-.2 0-.3 0-.5-.1l-.9-.1h-.2c1.3.2 2.6.3 4 .4-.3 0-.6 0-.9-.1-.2.1-.4.1-.6 0zm-3.8-.4l1.1.2-.9-.1c-.1-.1-.2-.1-.2-.1zm-3.7-.8c.7.2 1.5.4 2.3.5l-.9-.2-1.4-.3zM52.2 64.1c.6 1.2 1.1 2.6 1.5 4.1-.4-1.5-.9-2.9-1.5-4.1z" fill="none"/> <path fill="#E65100" d="M101.3 128h.3c-2.4-9.5-4.8-19.4-6.8-28.7-7.6 2.7-39.3.6-45.1-5.1-2.5 4.9-6 10.3-10.8 16.2H97l4.3 17.6z"/> <path fill="#2A56C6" d="M97.2 92.5v-.2.2z"/> <path fill="#00838F" d="M39.2 107.1l.3-.4-.3.3v.1z"/> <path fill="#EE8100" d="M101.6 128c-1.5-5.8-3-11.8-4.3-17.7H38.9c-.9 1.1-2.1 2.2-3.1 3.3-.2.2-.3.4-.5.5-4 4.6-7.5 9.2-10.4 13.8h76.7z"/> <path fill="#FFE0B2" d="M72.4 103.8c5.9-.2 14.8-1.8 22.4-4.5-.3-1.4-.6-2.7-.8-4.1-1.9-9.4-3.2-18.1-3.4-25-.5-19.6 6.6-20.2 6.6-20.2h2.1c0-4.2-.5-8.8-.9-12.3-.2-1.9-.6-3.6-1.2-5.3l-3.6.5-.6.1-2.9.3c-.3 0-.6 0-.9.1-.3 0-.7 0-1 .1-.3 0-.7 0-1 .1h-5.1c-.7 0-1.3 0-1.9-.1h-.3c-1.4-.1-2.8-.2-4-.4h-.2l-1.1-.2h-.2l-.9-.2c-.1 0-.2 0-.3-.1l-2.3-.5h-.1c-.4-.1-.8-.2-1.1-.3-.1 0-.1 0-.2-.1l-1-.3c-.1 0-.1 0-.2-.1-.3-.1-.6-.2-.9-.4-.1 0-.1 0-.2-.1l-.9-.4s-.1 0-.1-.1c-1.4-.6-2.6-1.3-3.6-2.1l-.1-.1-.6-.5-.2-.2-.5-.4-.2-.2-.4-.4-.2-.2-.4-.4-.2-.2-.3-.4-.2-.2-.3-.4-.1-.2c-.2-.2-.3-.4-.4-.6l-8 24.9-11.2-14.1c-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1h.1l.1.1.2.2.1.1.3.3.1.1.4.4c.8.8 1.8 1.9 2.8 3.5v.1l.6.9s0 .1.1.1c.2.3.4.6.5 1 0 0 0 .1.1.1l.6 1.1c.6 1.2 1.1 2.6 1.5 4.1 1.7 6.2 1.6 14.8-4 25.9 5.6 5.8 13.6 9.4 22.5 9.7z"/> <circle fill="#444" cx="84.2" cy="44.1" r="2"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-4" x="384" y="128"> <path fill="#84FFFF" d="M0 0h128v128H0z"/> <path fill="#444" d="M28 54.2c1-.2 1.5.5 2.8.8 1.3.3 2.7.2 4-.2 2.2-.7 4.1-2.1 6.1-3.4 12.6-8.2 28.9-10.4 43.2-5.8 3 1 6 2.3 8 4.7.9 1.1 1.6 2.4 2.5 3.6s2.1 2.2 3.5 2.4c5.2.8 4.9-8.6 4.9-11.8 0-21.3-17.3-38.6-38.6-38.6S25.8 23.2 25.8 44.5c0 3.2.2 7 1.4 10 .3-.1.6-.2.8-.3z"/> <path fill="#8D6E63" d="M44.3 103.5c0 .2-.1.4-.1.5-.5 3.9.3 7.9 2.3 11.3 2.1 3.7 5.4 6.6 9.2 8.3 3.1 1.4 6.5 2.1 10 2.1 5.3-.1 10.6-2 14.2-5.9 1.9-2.1 3.2-4.6 4.5-7.1.9-1.7 1.8-3.4 2.5-5.2.6-1.7.6-2.3-.5-3.6-2.2-2.6-4.1-5.7-4.9-9.1-.9-4.1.3-9.7 3.5-12.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.4-3.2-1.1-6.3-3.7-7.9-.5-.3-.9-.5-1.5-.7h-.1c-.2-.1-.5-.2-.7-.2h-.1c-.3-.1-.6-.1-.8-.2-1.4-.2-2.8 0-4 .5-.8-14-13.9-11-29.9-11-14.6 0-26.8-2.5-29.4 7.8-.2.9-.5 2-.8 3.1-1.2-.4-2.4-.6-3.8-.4-.3 0-.6.1-.9.2l-.3.1-.6.2-.3.1-.6.3-.2.1-.8.5c-2.3 1.7-3.6 4.5-3.2 7.6.3 2.1 1.3 3.8 2.8 5.1 0 0 10.9 9.3 11 9.3 4.6 3.9 8.2 10.7 8.6 16.7.1 1.8 0 3.7-.5 5.5-.1 1.5-1 3-1.3 4.6z"/> <path d="M100.4 53.6zm-.8-.3h-.1.1zm-70.5.3l-.3.1c.1 0 .2 0 .3-.1zm-.9.4l-.2.1s.1 0 .2-.1zm1.7-.7l-.3.1c.2 0 .3-.1.3-.1z" fill="none"/> <path fill="#8D6E63" d="M39.3 109.5c-.1.1-.1.2-.1.2l.5-.6c-.1.1-.2.3-.4.4z"/> <path fill="#FFEB3B" d="M62.8 128h6.8l-3.4-5zm-23.6-18.3c-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-1.3 1.6-2.8 3.6-4.4 5.8h28.6l-10.2-18.1zm72.3 16.6c-1.3-2.2-2.3-3.9-3.1-5.1-.9-1.3-1.3-2-1.3-2l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.1-3.4-7-5.2-10.9-5.7l-.3.4L83.6 128h28.9c-.3-.6-.7-1.2-1-1.7z"/> <circle fill="#444" cx="79.5" cy="62.7" r="2"/> <circle fill="#444" cx="53.8" cy="62.8" r="2"/> <path fill="#F57F17" d="M65.7 122.3l.5-.4L44 103.5l-4.3 5.6-.5.6L49.4 128h13.4l3.4-5zm0 0l.5.7 3.4 5h14l10.1-16.8.3-.4-6.4-6.2-.4.3-21 17z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-5" x="384" y="256"> <path fill="#FFFF8D" d="M0 0h128v128H0z"/> <path fill="#C2C2C2" d="M51.7 31.4v-22s-19.6 2.5-15.8 29.9c11 0 14.8-4.3 15.8-7.9z"/> <path fill="#848484" d="M94.1 39.8c.1-1 0-2-.1-3 0-1-.1-1.9-.2-2.9-.2-1.8-.4-3.5-.8-5.2-.6-2.9-1.5-5.8-2.9-8.4-1.1-2.2-2.6-4.2-4.3-6-1.6-1.6-3.3-2.9-5.3-3.9-1.8-1-3.8-1.7-5.8-2.2-2-.5-4-.8-6-.9-1.9-.1-3.8-.1-5.7 0-1.7.1-3.3.3-5 .6-1.3.2-2.5.5-3.8.8l-2.2.6-.4.1v20.8c0 1-.1 1.8.4 2.7.2.3.5.6.6.9.3.9.7 1.8 1.2 2.7 1.1 1.8 2.7 3.4 4.7 4.3 2.4 1.1 5.1 1.4 7.8 1.6 4.8.3 9.6.4 14.3.3 2.2 0 4.3-.3 6.4-.9 1.2-.3 2.4-.6 3.6-1 .6-.2 1.2-.4 1.8-.5.6-.2 1.2-.5 1.7-.5z"/> <path fill="#FFE0B2" d="M66.8 116.8l17.9-8.7 3.1-8.2c-15.1-17 1.2-31.6 2.3-32.5h.1l13.2-11.1c1.5-1.2 2.5-3 2.8-5 .6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.2-1-.5-1.9-.8-2.9-26.9 3.7-37.9-2.5-42.4-8.4-1.6 2.6-5.1 6.1-15.8 7.9-.2.9-.5 2-.8 3.1-1.2-.4-2.4-.6-3.8-.4-4.4.6-7.5 4.7-6.9 9.1.3 2 1.3 3.8 2.8 5l7.5 6.4c4.2 4.5 18.4 21.7 9 37l.7 3.7 4.7 4.6 17.6 8.9z"/> <path fill="#055524" d="M39.8 104.7zm54.3-.4l-.8 1.5-6.8 12.1V128H128v-2.3z"/> <path fill="#FFE0B2" d="M40.4 103.9c-.2.2-.3.4-.5.5 0 0-.1.1-.1.2v.1l.6-.8z"/> <circle fill="#444" cx="80" cy="51.7" r="2"/> <circle fill="#444" cx="54.3" cy="51.7" r="2"/> <path fill="#055524" d="M39.8 104.7c-3.2.9-6.1 2.7-8.6 5.5l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-2.3 2.9-5.1 6.7-8.3 11.4h31v-7.8l-8.7-15.5z"/> <path fill="#848484" d="M65.3 67.3s2.7 9.8 14.5 9.8c0 0 3.9-18.5-14.5-18.5v8.7z"/> <path fill="#C2C2C2" d="M65.3 67.3v-8.7C46.9 58.6 50.8 77 50.8 77c11.8 0 14.5-9.7 14.5-9.7z"/> <path fill="#A7FFEB" d="M80.9 128h5.6v-10.1zm-21 0h13.8l-6.9-10zm-11.5 0h4.3l-4.3-7.8z"/> <path fill="#1DE9B6" d="M66.8 118l-.5-.8.5-.4-22.9-17.3h-.1l-3.4 4.4-.6.8 8.6 15.5 4.3 7.8h7.2zm26.5-12.2l.8-1.5-6.4-4.4-20.9 16.9-.5.4.5.8 6.9 10h7.2l5.6-10.1z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-6" y="384"> <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#F2A600" d="M30.3 43.7c3.1-.4 6.1 1 7.7 3.4 10.3-2 11-11.5 12.6-14.1 4.5 5.8 13.3 17.8 39.5 14.5 1.6-2.7 4.7-4.3 8-3.8.4 0 .7-1.9 1-1.8-.1-2.2-.3-4.4-.8-6.4v-.1C94.9 19.6 80.8 7.8 64 7.8c-15 0-27.8 9.4-32.8 22.6C29.8 34 29 38 28.9 42.1l.7 1.8.7-.2z"/> <path d="M89.1 102.8l.4-.3c-.1 0-.3.1-.4.3zm2.2-1.9l-.5.4c.2-.2.3-.3.5-.4zm-18 9.2c-.1 0-.2 0-.3.1.1-.1.2-.1.3-.1zm-2.4.4h-.2.2zm16.1-6.2l.3-.2-.3.2zm-9 4.5l.5-.2-.5.2zm4.9-2.1l.2-.1c-.1.1-.1.1-.2.1zm2-1.1l.5-.3-.5.3zm-4.6 2.3l.4-.2c-.1.1-.2.2-.4.2zm12.6-8.6zM30.3 41.7c-.3 0-.5.1-.7.1.2 0 .5 0 .7-.1zm35.9 69.2c-.6 0-1.2 0-1.9-.1.6 0 1.2.1 1.9.1z" fill="none"/> <path fill="#F2A600" d="M41.5 101.3l.8.7c-.3-.3-.5-.5-.8-.7zm1.4 1.1c.2.2.5.4.8.6-.3-.2-.6-.4-.8-.6zm1.3 1.1c.2.2.5.4.8.5-.2-.1-.5-.3-.8-.5zm54.1-68.1zM38.7 98.3c.4.4.8.8 1.1 1.3-.4-.4-.8-.8-1.1-1.3zm-7.6-67.9zm15.4 74.7l.5.3-.5-.3zm4.6 2.4l.3.1c-.1 0-.2 0-.3-.1zm-3.1-1.6l.5.3c-.2-.1-.4-.2-.5-.3zm13.6 4.6l-.9-.1.9.1zM88.9 67c-1.6 1.4-3.1 2.7-4.4 3.9-3.3 3.8-6.3 10.3-1 18.7 5.7-8.1 10.6-17.7 13.2-29.1L88.9 67zM41 100.8l-.8-.8.8.8zm8.5 6l.4.2c-.1-.1-.2-.2-.4-.2zm9.5 3.3h.1-.1zm-46.1 17.3c4.5-7.1 8.6-12.7 11.7-16.6 1.5-2 2.8-3.5 3.7-4.5 1-1.1 1.5-1.7 1.5-1.7l.2-.2c2.4-2.7 5.3-4.5 8.4-5.4.1-.2.2-.4.2-.5 0-.1 0-.2.1-.2 13.6-13.3 4.7-26.5-1.5-32.9l-4.4-3.8c-2.6 8.7-8.5 18.2-20.1 26.9-6.4 4.1-10.6 11.4-10.6 19.7 0 8.2 4.1 15.4 10.4 19.8l.4-.6z"/> <path fill="#FFE0B2" d="M67.1 110.9h-2 2zM38.8 98.1c-.4.3 2.1 5.6 2.5 5.9 1.8 1.8 4.1 2.2 6.3 3.5 4.8 2.7 10.2 3.6 15.6 4.2 5.7.6 11.5-.5 16.8-2.6 2.5-1 4.8-2.3 7-3.8 1.2-.8 2.2-1.6 3.3-2.6.4-.3 2.4-3.6 2.7-3.3-4-3.3-8-6.9-10.4-11.6-2.2-4.2-2.6-9.1-.5-13.4 1.7-3.3 4.5-5.6 7.3-7.9 2.2-1.8 4.3-3.6 6.5-5.5l4.7-3.9c1-.8 2.1-1.6 2.8-2.7 1.5-2 1.9-4.6 1.2-7-1.4-4.8-7.1-7.2-11.5-4.9-1 .5-1.9 1.3-2.6 2.2l-.5.7-1.1.1c-.8.1-1.6.2-2.4.2-2.6.2-5.3.3-7.9.1-6.8-.3-13.5-2.1-19.1-6-3.6-2.4-6.3-5.6-8.9-9-.5.9-.8 1.9-1.1 2.8-.5 1.4-1 2.7-1.6 4-1.7 3.3-4.5 5.8-8.2 6.9-.5.2-1.1.3-1.7.4-.3-.5-.7-.9-1.1-1.3-.9-.6-2.1-1.3-3.3-1.6-2.5-.7-5.2-.2-7.2 1.4-3.9 3.1-4 9.2-.1 12.5l10.5 8.9c2.4 2 4.3 4.8 5.9 7.4 2.1 3.5 3.4 7.6 3.2 11.7-.3 5.6-3.3 10.4-7.1 14.2-.1.1 13.6-13.3 0 0z"/> <path fill="#80DEEA" d="M93 99.4l-.2-.1-1.5 1.5-.5.4c-.4.4-.9.8-1.3 1.1l-.4.3c-.6.5-1.2.9-1.8 1.3l-.3.2c-.5.4-1.1.7-1.6 1l-.5.3-1.8 1-.2.1c-.7.4-1.4.7-2.1 1l-.4.2-1.8.7-.5.2c-.8.3-1.5.5-2.3.7l-2.4.6c-.1 0-.2 0-.3.1l-2.1.4h-.2c-1.5.2-3 .3-4.5.4h2-1.9c-.6 0-1.2 0-1.9-.1l-2.7-.3-.9-.1-1.6-.3h-.1c-2.7-.6-5.2-1.4-7.6-2.4l-.3-.1c-.4-.2-.8-.4-1.2-.5l-.4-.2c-.4-.2-.7-.4-1-.5l-.5-.3-1-.6-.5-.3c-.5-.3-1-.6-1.5-1-.3-.2-.5-.4-.8-.5l-.6-.5-.8-.6-.6-.5c-.3-.2-.5-.4-.8-.7l-.5-.5-.8-.8-.4-.4c-.4-.4-.8-.8-1.1-1.3-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.1.2-.2.4-.4.6H118c-2.7-5.4-5.1-9.8-7.1-13.1-1.3-2.2-2.3-3.9-3.1-5.1-.9-1.3-1.3-2-1.3-2l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.3-3.3-7.4-5.2-11.4-5.5z"/> <circle fill="#444" cx="78.9" cy="51.3" r="2"/> <circle fill="#444" cx="53.2" cy="51.3" r="2"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-7" x="128" y="384"> <path fill="#FFCC80" d="M41.6 123.8s0 .1-.1.1l.3-.4c-.1.2-.1.2-.2.3z"/> <path fill="#80D8FF" d="M0 0h128v128H0z"/> <path fill="#5D4037" d="M29.3 123.1c4.1-6.9 7.8-12.4 10.5-16.2 1.4-1.9 2.5-3.4 3.3-4.4l1.7-2s0-.1.1-.1l.3-.3C49 95.4 51.9 91 54.1 87c9.5-17.8 6.1-29.3-.3-35.9-1.6-1.6-3.2-2.9-4.7-4-.9-.6-1.7-1.1-2.4-1.6-1.8-1-3.1-1.6-3.3-1.7-1.3-1.2-2.2-2.9-2.5-4.9-.5-4.3 2.2-6.2 6.1-6.8 1-.1 2-.1 2.9.2 9.6-1.8 11.9-8 13.3-10.6 4 5.7 13.9 9.8 38 6.1C97.1 14.3 84.5 5.4 71 7.4c-4.4.7-8.3 2.4-11.8 4.9l-.1.1c-1.1.8-2.1 1.6-3 2.6l-35 30C12.9 49.8 7.3 58.8 7.3 69.1c0 2.7.4 5.3 1.1 7.8.3 4.9-.1 11.7-2.9 18.6-.2.5-.5 1-.7 1.6-1.2 3.2-1.9 6.6-1.9 10.2 0 8.2 3.5 15.6 9.1 20.7h14.5c1-1.7 1.9-3.4 2.8-4.9zm20.5-90.8z"/> <path fill="#FFCC80" d="M63.1 19.8c-1.4 2.6-5.7 8.8-15.3 10.6-.9-.3-1.9-.3-2.9-.2-3.9.6-6.7 4.5-6.1 8.8.3 2 1.2 3.7 2.5 4.9.2.1 1.5.6 3.3 1.7.7.4 1.6 1 2.4 1.6 1.5 1.1 3.1 2.4 4.7 4 6.4 6.6 11.8 18.1 2.3 35.9 0 0 7.3 15.5 23.2 16.9 6.1.5 13.3-5.6 22.1-8.8-.1-.7-.3-1.4-.5-2.1-.3-1.3-3.9-21.5-4.1-28.2-.2-7.4.7-11.9 1.9-14.8h8.8L103 39.7c-.2-2.4-.4-4.7-.7-6.7-.2-1.8-.6-3.5-1.1-5.2-24.2 3.7-34-2.3-38.1-8zm22.3 19.6c0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6zm-35.6-7.1zm-4.9 68.1s0 .1-.1.1l.3-.4-.2.3z"/> <circle fill="#444" cx="86.9" cy="39.4" r="2"/> <path fill="#00BFA5" d="M77.2 98.5C61.3 97.2 54.1 87 54.1 87c-2.2 4-5.1 8.4-8.9 13.1l-.3.4c-.5.7-1.1 1.3-1.7 2-.8 1-2 2.5-3.3 4.4-2.8 3.8-6.5 9.2-10.5 16.2-.9 1.6-1.8 3.2-2.8 4.9h80.8l-.3-1c-2.6-10.3-5.4-21.4-7.7-31.9-8.8 3.1-16.1 3.9-22.2 3.4z"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-8" x="256" y="384"> <path fill="#FFCC80" d="M41.6 123.8s.1-.2.2-.3c-.1.2-.1.2-.2.3z"/> <path fill="#B388FF" d="M0 0h128v128H0z"/> <path d="M64.1 34.5c-.1.1-.2.2-.3.2.1-.1.2-.2.3-.2zm.9-.7c-.1.1-.2.1-.2.2l.2-.2zm-1.9 1.3c-.1.1-.2.2-.4.2.2 0 .3-.1.4-.2zm-5.4 2.6l-.5.2c.2-.1.4-.2.5-.2zm2.8-1.1l-.2.1s.1-.1.2-.1zm-1.3.5l-.4.2c.1 0 .2-.1.4-.2zm8.8-6.3l-.2.3c.1-.1.2-.2.2-.3zm-1.9 2.1l-.3.2.3-.2zm1.4-1.4l-.3.3c.1-.2.2-.3.3-.3zm-.7.6l-.3.3c.2-.1.3-.2.3-.3zM62 35.8l-.3.2.3-.2zm5 47l-.3 1.6.3-1.6zM56.2 38.1l-.5.1c.1 0 .3 0 .5-.1zm10.4 46.5c-.1.5-.2 1.1-.4 1.6.2-.5.3-1 .4-1.6zm.6-3.6l-.2 1.6c.1-.5.1-1 .2-1.6zm-5.6-20.8c.1.1.2.3.4.4l-.4-.4zm7.5-30.9l-.6.9c.5-.7.9-1.3 1.2-1.8-.1.2-.3.5-.5.7 0 .1 0 .2-.1.2zM67.2 81c1-10.6-2.4-17.3-5.2-20.4 2.7 3.1 6.2 9.8 5.2 20.4zm-1 5.5c-.1.6-.3 1.1-.5 1.7.2-.6.4-1.2.5-1.7zm-5.6-27.4l.2.2c-.1 0-.2-.1-.2-.2zm-.3-.2s.1.1.2.1c-.1 0-.1 0-.2-.1zm-.2-.1zm-.1-.1zm1.7 38.2c-.1-.1-.2-.2-.4-.3l.1.1.3.2zm-.5-37.1l.3.3-.3-.3zm-.3-.4l.3.3c-.2-.1-.2-.2-.3-.3z" fill="none"/> <path fill="#2A56C6" d="M98.8 94.8v.2-.2z"/> <path fill="#FFE0B2" d="M2.8 109.6L0 110.8V128h15.5L2.8 109.6z"/> <path fill="#DD2C00" d="M91.9 128h5.6c-3.8-12-4.4-16-4.9-20.1-.1-.5-.5-2.4-.5-2.9-2.6.7-5.2 1.1-8 1.2-8.7-.2-16.5-3.8-22.3-9.3l-.2-.2-.1-.1c-2.9.2-7.6.2-10.8.6-4.6.6-9.6 1.3-15 2.4-4.7.9-11.2 2.7-33.3 9.3l.5.7L15.5 128h70.2"/> <path fill="#FFEB3B" d="M66.2 86.5c0-.1 0-.1.1-.2.1-.6.3-1.1.4-1.6v-.2l.3-1.6v-.1l.2-1.6c1-10.6-2.4-17.3-5.2-20.4-.1-.1-.2-.3-.4-.4l-.1-.1-.3-.3-.1-.1-.3-.3-.1-.1-.2-.2-.1-.1c-.1-.1-.1-.1-.2-.1 0 0-.1 0-.1-.1l-.1-.1s-.1 0-.1-.1c-1.6-1.7-3.3-3-4.9-4.1-.9-.6-1.7-1.2-2.5-1.6-1.8-1.1-3.2-1.6-3.4-1.7-1.3-1.2-2.3-3-2.6-5-.6-4.4.3-6.4 4.3-7.1 1-.2 2-.1 3 .2l.1-.7c.6-.1 1.1-.2 1.6-.4l.5-.1 1.1-.3.5-.2 1-.3.4-.2c.4-.1.7-.3 1.1-.5l.2-.1 1.2-.6.3-.2c.3-.1.5-.3.8-.5.1-.1.3-.2.4-.2.2-.1.4-.3.7-.4.1-.1.2-.2.3-.2l.7-.5c.1-.1.2-.1.2-.2.3-.2.5-.4.8-.7.1-.1.2-.1.2-.2l.5-.5.3-.3.4-.4.3-.3.3-.4c.1-.1.2-.2.2-.3.2-.2.3-.4.4-.6l.6-.9.1-.2c.2-.3.3-.5.5-.7 4.2 5.9 14.5 10.4 39.3 6.7-4.2-14-17.3-23.5-31.3-21.4-5.3.8-10.1 3.2-14 6.6l-.2.2c-.5.4-1 .9-1.4 1.4-5.3 4.8-23.3 19.8-52.2 26.5-3.9 0-7.4 1.6-9.9 4.2v19.3c.3.3.6.6.9.8l-.3.9S30.9 96.4 64 90.3l1.6-1.8c0-.1 0-.1.1-.2.2-.7.4-1.3.5-1.8z"/> <path fill="#FFE0B2" d="M84 106.2c2.8-.1 5.4-.5 8-1.2l.8-3.8c4.3-19.3 9.7-37.4 15-52.9h6.9l-4.8-8.2c-.2-1.9-.6-3.6-1.2-5.3-24.8 3.7-35-2.5-39.1-8.4-.3.5-.7 1.1-1.2 1.8l-.4.6-.2.3-.3.4-.3.3-.4.4-.3.3-.5.5s-.1 0-.2.1c-.3.2-.5.4-.8.7-.1.1-.2.1-.2.2-.2.2-.4.3-.7.5-.1.1-.2.2-.3.2-.2.1-.4.3-.7.4-.1.1-.2.2-.4.2l-.8.5-.3.2-1.2.6-.2.1-1.1.5-.4.2c-.3.1-.6.2-1 .3l-.5.2c-.3.1-.7.2-1.1.3l-.5.1-1.6.4c-.1.2-.1.5-.1.7-.9-.3-1.9-.4-3-.2-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1l.1.1.1.1.1.1s.1.1.2.1c0 0 .1 0 .1.1l.2.2.1.1.3.3.1.1.3.3.1.1s.2.3.4.4c2.7 3.1 7.2 9.8 6.2 20.4l-.2 1.6v.1l-.3 1.6v.2c-.1.5-.2 1.1-.4 1.6 0 .1 0 .1-.1.2-.1.6-.3 1.1-.5 1.7 0 .1 0 .1-.1.2-.8 2.6-1.8 5.3-3.3 8.3.1.1.2.2.4.3 5.7 5.6 13.5 9.1 22.2 9.3z"/> <path fill="#DD2C00" d="M85.6 128h5.1"/> <circle fill="#444" cx="95.8" cy="46.5" r="2"/> </svg> <svg viewBox="0 0 128 128" height="128" width="128" id="svg-9" x="384" y="384"> <path fill="#FFCC80" d="M41.6 123.8s0 .1-.1.1l.3-.4c-.1.2-.1.2-.2.3z"/> <path fill="#FFFF8D" d="M0 0h128v128H0z"/> <path fill="#C2C2C2" d="M83.2 26.6c.1-.9.2-1.8.2-2.7C83.4 13.5 75 5 64.6 5s-18.8 8.4-18.8 18.8c0 1.4.2 2.7.4 4 5.4-4 12.2-6.4 19.4-6.4 6.5.1 12.5 2 17.6 5.2z"/> <path fill="#848484" d="M41.4 58.4c9.6-1.9 10.3-10.7 11.7-13.2 4.2 5.4 12.4 16.6 36.8 13.5 1.5-2.5 4.4-6 7.4-5.6.3 0 .6.1 1 .2C98 42 92 32.1 83.1 26.5 78 23.3 72 21.4 65.6 21.4c-7.3 0-14 2.4-19.4 6.4-7.9 5.9-13.1 15.2-13.3 25.7.4-.1.9 1.7 1.4 1.7 2.8-.4 5.6 1 7.1 3.2z"/> <path fill="#FF5722" d="M109.6 121.5c-1.2-2-2.2-3.6-2.9-4.8l-1.2-1.8-.2-.3c-.5-.8-1.1-1.6-1.8-2.3-3.1-3.3-6.9-5.1-10.8-5.3 0 0 .1 0 .1.1l-.2-.1c-3.4 3.7-7.8 6.6-12.7 8.5V128h33.4c-1.4-2.5-2.6-4.7-3.7-6.5zM42 106l-.2.5c-2.9.8-5.6 2.5-7.8 5.1l-.2.2s-.5.6-1.4 1.6c-.9 1-2 2.4-3.5 4.2-2.1 2.6-4.7 6.1-7.5 10.4h28v-15.7c-2.8-1.7-5.3-3.8-7.4-6.3z"/> <path fill="#E0F7FA" d="M67.7 117.7c-6.8-.2-13.1-2.1-18.3-5.4V128h30.5v-12.6c-3.8 1.4-7.9 2.2-12.2 2.3z"/> <path fill="#FFE0B2" d="M42 106c2.1 2.4 4.6 4.5 7.4 6.3 5.2 3.3 11.5 5.3 18.3 5.4 4.3-.1 8.4-.9 12.1-2.3 5-1.9 9.3-4.8 12.7-8.5l.2.1s-.1 0-.1-.1c-15.7-12.3-12-21.7-7.8-26.6 1.3-1.1 2.6-2.3 4.1-3.6l12.2-10.3c1.4-1.2 2.4-2.8 2.7-4.8.5-3.8-1.9-7.3-5.4-8.2-.3-.1-.6-.2-1-.2-3.1-.4-5.9 1.1-7.4 3.6-24.4 3.1-32.7-8.1-36.8-13.5-1.5 2.4-2.1 11.3-11.7 13.2-1.6-2.3-4.3-3.6-7.2-3.2l-1.4.3c-3.4 1.1-5.5 4.5-5 8.1.3 1.9 1.3 3.6 2.6 4.7l10.2 8.7c5.8 6 14.1 18.3 1.4 30.7-.1.1-.1.2-.1.2zm37.6-45.3c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c-.1-.9.6-1.5 1.5-1.5zm-24 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c-.1-.9.6-1.5 1.5-1.5z"/> <circle fill="#444" cx="79.6" cy="62.2" r="2"/> <circle fill="#444" cx="55.6" cy="62.2" r="2"/> </svg> </defs></svg>'
    };

    // Note: 'material.svgAssetsCache' is used with Angular Material docs
    // when launching code pen demos; @see codepen.js

    angular.module('material.svgAssetsCache', [])
        .run(['$templateCache', function ($templateCache) {
            angular.forEach(assetMap, function (value, key) {
                $templateCache.put(key, value);
            });
        }]);
})();
"use strict";
APP.CONTROLLERS.controller('Controller', Controller);
Controller.$inject = ['$rootScope', '$state', '$filter', '$location', '$anchorScroll', '$mdDialog', '$mdToast', 'SessionStorage', 'Common', 'ENV'];
function Controller($rootScope, $state, $filter, $location, $anchorScroll, $mdDialog, $mdToast, SessionStorage, Common, ENV) {
    var vm = this;
    //处理后端返回的数据
    $rootScope.handleMessage = function (response, successFunction, failedFunction) {
        if (response.success) {
            successFunction(response.value);
        } else {
            if (response['errCode'] && response['message']) {
                console.info("errCode:" + response['errCode'] + "," + response['message'] + ".");
            } else if (response['errCode']) {
                console.info("errCode:" + response['errCode'] + ".");
            } else {
                console.info(response['message'] + ".");
            }
            failedFunction(response);
        }
    };
    //判断权限
    $rootScope.isShow = function (JURISDICTION_CODE) {
        var b = true;
        if (ENV.runMode !== 'debug') {
            b = false;
            var loginInfo = SessionStorage.get('loginInfo');
            if (loginInfo
                && loginInfo['authorities']
                && loginInfo['authorities'].length > 0) {
                angular.forEach(loginInfo['authorities'], function (item) {
                    if (item['jurisdictionCode'] === JURISDICTION_CODE) {
                        b = true;
                        return false;
                    }
                });
            }
        }
        return b;
    };
    //判断页面权限
    $rootScope.checkAuth = function (url) {
        if (ENV.runMode === 'debug') {
            return true;
        }
        var urlNew='/'+url.replace(/\./g,'/');//将路径中所有的.替换为斜杠
        var loginInfo = SessionStorage.get('loginInfo');
        for(var i=0;i<loginInfo.resources.length;i++){
            if(loginInfo.resources[i].resourcePath===urlNew){
                return true;
            }
            if(loginInfo.resources[i].hcrmGpDetailResource) {
                for (var j = 0; j < loginInfo.resources[i].hcrmGpDetailResource.length; j++) {
                    if(loginInfo.resources[i].hcrmGpDetailResource[j].resourcePath===urlNew){
                        return true;
                    }
                }
            }
        }
        return false;
    };
    $rootScope.isContains=function(str, substr) {
        return str.indexOf(substr) >= 0;
    };
    //判断是否是detail页面
    $rootScope.isDetailView = function () {
        return $state.current.name.indexOf('detail') !== -1;
    };
    $rootScope.isEmptyObject = function (obj) {
        for (var n in obj) {
            return false
        }
        return true;
    };
    //查询list中是否包含某个字段为key属性为value的对象,返回index
    $rootScope.selectIndex = function (list, key, value) {
        var index = -1, l = list.length;
        for (var i = 0; i < l; i++) {
            if (list[i][key] === value) {
                index = i;
                return index;
            }
        }
        return index;
    };
    //查询list中是否包含某个字段为key值为value的对象,返回item
    $rootScope.selectItem = function (list, key, value) {
        var l = list.length;
        for (var i = 0; i < l; i++) {
            if (list[i][key] === value) {
                return list[i];
            }
        }
        return undefined;
    };
    //根据value删除数组中的值
    $rootScope.removeByValue=function(arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    };
    //弹出提示
    $rootScope.alertDialog = function (text) {
        return $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('提示')
                .textContent(text)
                .ok('确定')
        );
    };
    //弹出提示
    $rootScope.confirmDialog = function (text, successFunction, failedFunction) {
        var confirm = $mdDialog.confirm()
            .title('提示')
            .textContent(text)
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(successFunction, failedFunction);
    };
    $rootScope.showToast = function (message, vertical, horizonal, actionText, theme) {
        var position = {
            vertical: vertical || 'v-center',
            horizonal: horizonal || 'h-center'
        };
        var toast = $mdToast.simple()
            .textContent(message)
            .action(actionText)
            .hideDelay(1500)
            .theme(theme)
            .position(position.vertical + ' ' + position.horizonal);
        $mdToast.show(toast);
    };
    //获取服务器当前时间
    //日期格式 2016-08-08
    $rootScope.getCurrentDate = function (successFunction) {
        return $rootScope.getCurrentTime(function (data) {
            successFunction($filter('commonDate')(data));
        });
    };
    //new Date 格式
    $rootScope.getCurrentDateTime = function (successFunction) {
        return $rootScope.getCurrentTime(function (data) {
            successFunction(new Date(data));
        });
    };
    //时间戳格式 1475130600000
    $rootScope.getCurrentTime = function (successFunction) {
        Common.getCurrentTime({}).$promise.then(
            function (response) {
                $rootScope.handleMessage(
                    response,
                    function (data) {
                        successFunction(data);
                    },
                    function () {
                        $rootScope.alertDialog("获取服务器时间失败");
                    }
                )
            },
            function () {
                $rootScope.alertDialog("获取服务器时间失败");
            }
        );
    };
    //调用公共的service方法
    $rootScope.commonService = function (functionName, params, successFunction, failedFunction) {
        return Common[functionName](JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    //高血压评估
    $rootScope.calculateHypertensionEvaluation = function (params) {
        var bloodPressureGradingList = ['0028000010', '0028000020', '0028000030', '0028000040', '0028000050'];
        var gradingManagementList = ['0029000010', '0029000020', '0029000030', '0029000040', '0029000050'];
        var criticalityGradingList = ['0030000010', '0030000020', '0030000030', '0030000040'];

        var riskFactorsCount = 0;
        var bloodPressureGradingCount;
        var criticalityGradingCount;
        var gradingManagementCount;
        //计算血压分级
        function bloodPressureGrading(SYSTOLIC_PRESSURE, DIASTOLIC_PRESSURE) {
            //血压正常：收缩压<120且舒张压<80
            //血压偏高：收缩压120-139或舒张压80-89
            //1级高血压：收缩压140-159或舒张压90-99
            //2级高血压：收缩压160～179或舒张压100～109
            //3级高血压：收缩压>=180或舒张压>=110
            if (SYSTOLIC_PRESSURE >= 180 || DIASTOLIC_PRESSURE >= 110) {
                bloodPressureGradingCount = bloodPressureGradingList[4];
            } else if ((SYSTOLIC_PRESSURE >= 160 && SYSTOLIC_PRESSURE <= 179) || (DIASTOLIC_PRESSURE >= 100 && DIASTOLIC_PRESSURE <= 109)) {
                bloodPressureGradingCount = bloodPressureGradingList[3];
            } else if ((SYSTOLIC_PRESSURE >= 140 && SYSTOLIC_PRESSURE <= 159) || (DIASTOLIC_PRESSURE >= 90 && DIASTOLIC_PRESSURE <= 99)) {
                bloodPressureGradingCount = bloodPressureGradingList[2];
            } else if ((SYSTOLIC_PRESSURE >= 120 && SYSTOLIC_PRESSURE <= 139) || (DIASTOLIC_PRESSURE >= 80 && DIASTOLIC_PRESSURE <= 89)) {
                bloodPressureGradingCount = bloodPressureGradingList[1];
            } else if (SYSTOLIC_PRESSURE < 120 && DIASTOLIC_PRESSURE < 80) {
                bloodPressureGradingCount = bloodPressureGradingList[0];
            }
        }

        //统计危险因素个数,[心血管病危险因素、靶器官损害、并存相关疾病]三个多选字段中选中的选项数目之和
        function riskFactors(array) {
            angular.forEach(array, function (item) {
                riskFactorsCount += item;
            });
        }

        //计算危险程度分层和分级管理
        function criticalityGradingAndGradingManagement() {
            //一般人群，无危险：血压正常或(血压偏高&0危险因素)
            //高危人群，无危险：血压偏高&>=1危险因素
            //一级管理，低危：1级高血压&0危险因素
            //二级管理，中危：(2级高血压&0-2个危险因素)或(1级高血压&1-2个危险因素)
            //三级管理，高危：3级高血压或(2级高血压&>2个危险因素)或(1级高血压&>2个危险因素)
            if (bloodPressureGradingCount === bloodPressureGradingList[0]
                || (bloodPressureGradingCount === bloodPressureGradingList[1] && riskFactorsCount === 0)) {
                criticalityGradingCount = criticalityGradingList[0];
                gradingManagementCount = gradingManagementList[0];
            } else if (bloodPressureGradingCount === bloodPressureGradingList[1] && riskFactorsCount >= 1) {
                criticalityGradingCount = criticalityGradingList[0];
                gradingManagementCount = gradingManagementList[1];
            } else if (bloodPressureGradingCount === bloodPressureGradingList[2] && riskFactorsCount === 0) {
                criticalityGradingCount = criticalityGradingList[1];
                gradingManagementCount = gradingManagementList[2];
            } else if ((bloodPressureGradingCount === bloodPressureGradingList[3] && (riskFactorsCount >= 0 && riskFactorsCount <= 2))
                || (bloodPressureGradingCount === bloodPressureGradingList[2] && (riskFactorsCount >= 1 && riskFactorsCount <= 2))) {
                criticalityGradingCount = criticalityGradingList[2];
                gradingManagementCount = gradingManagementList[3];
            } else if (bloodPressureGradingCount === bloodPressureGradingList[4]
                || (bloodPressureGradingCount === bloodPressureGradingList[3] && riskFactorsCount >= 3)
                || (bloodPressureGradingCount === bloodPressureGradingList[2] && riskFactorsCount >= 3)) {
                criticalityGradingCount = criticalityGradingList[3];
                gradingManagementCount = gradingManagementList[4];
            }
        }

        bloodPressureGrading(params['SYSTOLIC_PRESSURE'], params['DIASTOLIC_PRESSURE']);
        riskFactors(params['lengthArray']);
        criticalityGradingAndGradingManagement();
        return {
            "bloodPressureGradingCount": bloodPressureGradingCount,
            "criticalityGradingCount": criticalityGradingCount,
            "gradingManagementCount": gradingManagementCount
        };
    };
    //判断是否超级管理员
    $rootScope.isSuperManager = function () {
        if (SessionStorage.get('loginInfo').organizationKeyId) {
            return false;
        }
        return true;
    };

    //提交前校验表单
    $rootScope.check = function (form) {
        function checkSubForm(form){
            if (form.$invalid) {
                for (var s in form) {
                    if (form[s]!==undefined && form[s].$invalid!==undefined && form[s].$invalid) {
                        var name = form[s].$name;
                        //判断子表单
                        if (form[s]['$$renameControl'] && s !== '$$parentForm') {
                            if (checkSubForm(form[s])) {
                                continue;
                            } else {
                                return false;
                            }
                        }
                        if(s === '$$parentForm'){
                            continue;
                        }
                        //前提id和name相同，以便通过id跳转锚点
                        var element = document.querySelector('#' + name);
                        $rootScope.scrollTo(name);
                        if (element.tagName === 'INPUT' || element.tagName === 'MD-SELECT' || element.tagName === 'MD-DATEPICKER' || element.tagName === 'TEXTAREA') {
                            form[name].$setTouched(true);
                        } else {
                            $rootScope.alertDialog('请选择相应的选项');
                        }
                        break;
                    }
                }
                return false;
            } else {
                return true;
            }
        }
        return checkSubForm(form);
    };

    //锚点跳转
    $rootScope.scrollTo = function (target) {
        $location.hash(target);
        $anchorScroll();
    };

    function watchEvent() {

        window.onscroll = function () {
            if (document.getElementsByTagName("md-sidenav").length === 0) {
                return;
            }
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            var left = document.getElementsByTagName("md-sidenav")[0].offsetLeft;
            if (top > 204) {
                for (var i = 0; i < document.getElementsByTagName('md-sidenav').length; i++) {
                    document.getElementsByClassName("sidenavDiv")[i].style.display = 'block';
                    document.getElementsByTagName('md-sidenav')[i].style.position = 'fixed';
                    document.getElementsByTagName('md-sidenav')[i].style.top = '0';
                    document.getElementsByTagName('md-sidenav')[i].style.marginTop = '0';
                    document.getElementsByTagName('md-sidenav')[i].style.left = (left + 300 * i) + "px";
                }
            } else {
                for (var i = 0; i < document.getElementsByTagName('md-sidenav').length; i++) {
                    document.getElementsByClassName("sidenavDiv")[i].style.display = 'none';
                    document.getElementsByTagName("md-sidenav")[i].removeAttribute('style');
                }
            }
        };
    }
    watchEvent();

    return vm;
}

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
APP.SERVICES.service('mainService', mainService);
mainService.$inject = [];
function mainService() {
    var vm = this;
    return vm;
}
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
"use strict";
APP.SERVICES.service('roleService', roleService);
roleService.$inject = ['$rootScope', 'Role', 'bootstrapTable'];
function roleService($rootScope, Role, bootstrapTable) {
    var vm = this;
    vm.getJurisdictionsOfRole = function (params, successFunction, failedFunction) {
        return Role.getJurisdictionsOfRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.createRole = function (params, successFunction, failedFunction) {
        return Role.createRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.updateRole = function (params, successFunction, failedFunction) {
        return Role.updateRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.deleteRole = function (params, successFunction, failedFunction) {
        return Role.deleteRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    vm.checkUser = function (params, successFunction, failedFunction) {
        return Role.checkUser(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };
    //用户缓存记录
    vm.JURISDICTION_LIST = [];
    vm.JURISDICTION_LIST_INDEX = [];
    vm.initJurisdictionList = function () {
        vm.JURISDICTION_LIST = [];
        vm.JURISDICTION_LIST_INDEX = [];
    };
    vm.getJurisdictionList = function () {
        return vm.JURISDICTION_LIST;
    };
    //绑定按钮点击
    vm.toggle = function (item, item2, item3) {
        if (item['IS_SELECT'] === "1"
            || item['IS_SELECT'] === 1) {
            item['IS_SELECT'] = '0';
            //从1到0的查询子元素
            vm.joinList(item);
            vm.cancelSubList(item);
        } else if (item['IS_SELECT'] === "0"
            || item['IS_SELECT'] === 0
            || item['IS_SELECT'] === undefined) {
            item['IS_SELECT'] = '1';
            //从0到1的查询父元素
            vm.joinList(item);
            if (item2 && (item2['IS_SELECT'] === "0"
                || item2['IS_SELECT'] === 0
                || item2['IS_SELECT'] === undefined)) {
                item2['IS_SELECT'] = '1';
                vm.joinList(item2);
                if (item3 && (item3['IS_SELECT'] === "0"
                    || item3['IS_SELECT'] === 0
                    || item3['IS_SELECT'] === undefined)) {
                    item3['IS_SELECT'] = '1';
                    vm.joinList(item3);
                }
            }
        }
    };
    //取消子元素选中状态
    vm.cancelSubList = function (item) {
        if (item['SUBLIST'] && item['SUBLIST'].length > 0) {
            angular.forEach(item['SUBLIST'], function (value) {
                if (value['IS_SELECT'] === "1"
                    || value['IS_SELECT'] === 1) {
                    value['IS_SELECT'] = '0';
                    vm.joinList(value);
                    vm.cancelSubList(value);
                }
            });
        }
    };
    //插入和更新用户点击过的数据
    vm.joinList = function (item) {
        //查询存在不存在
        var INDEX = vm.JURISDICTION_LIST_INDEX.indexOf(item["JURISDICTION_KEY_ID"]);
        //不存在就插入，存在就更新
        if (INDEX === -1) {
            vm.JURISDICTION_LIST_INDEX.push(item["JURISDICTION_KEY_ID"]);
            vm.JURISDICTION_LIST.push({
                "VALUE": item["JURISDICTION_KEY_ID"],
                "IS_SELECT": item["IS_SELECT"]
            });
        } else {
            vm.JURISDICTION_LIST[INDEX]['IS_SELECT'] = item['IS_SELECT'];
        }
    };
    //判断至少选择一个功能
    vm.isSelectOne = function (list) {
        var b = false;
        angular.forEach(list, function (item) {
            if (item['IS_SELECT'] === "1" || item['IS_SELECT'] === 1) {
                //查询是否有子节点
                if (item['SUBLIST'] && item['SUBLIST'].length > 0) {//若有检查子列表
                    //如果子列表为true
                    if (vm.isSelectOne(item['SUBLIST'])) {
                        b = true;
                        return false;
                    }
                } else {//若没有则返回 true
                    b = true;
                    return false;
                }
            }
        });
        return b;
    };
    function ajaxRequest(params, successFunction, failedFunction) {
        Role.getRoleList(JSON.stringify(params)).$promise
            .then(function (response) {
                $rootScope.handleMessage(response, function () {
                    successFunction(response.value || {total: 0, rows: []});
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                });
            }, function () {
                $rootScope.alertDialog("获取列表信息失败");
                failedFunction();
            });
    }

    vm.showTable = function ($vm, params, $state) {
        var list = {
            dataFunction: ajaxRequest,
            dataParams: params,
            columns: [{
                field: 'ROLE_NAME',
                title: '角色名称',
                align: 'center',
                width: 298,
                valign: 'middle',
                formatter: roleFormat,
                events: {
                    'click .flag': function (e, value, row) {
                        $state.go('main.baseData.roleEdit',
                            {
                                "ROLE_KEY_ID": row.ROLE_KEY_ID,
                                "ROLE_NAME": row.ROLE_NAME
                            });
                    }
                }
            }, {
                field: 'JURISDICTION_NAME',
                title: '拥有功能权限',
                align: 'center',
                width: 902,
                valign: 'middle'
            }]
        };

        function roleFormat(value) {
            return '<div class="flag" style="color: #428bca;cursor:pointer;">' + value + '</div>';
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
        return $vm;
    };
    return vm;
}
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
"use strict";
APP.SERVICES.service('userService', userService);
userService.$inject = ['$rootScope', '$state', 'User', 'bootstrapTable'];
function userService($rootScope, $state, User, bootstrapTable) {
    var vm = this;
    vm.getAllAccountRole = function (params, successFunction, failedFunction) {
        return User.getAllAccountRole(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.checkUserNameDuplicate = function (params, successFunction, failedFunction) {
        return User.checkUserNameDuplicate(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.createNewUser = function (params, successFunction, failedFunction) {
        return User.createNewUser(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getUserList = function (params, successFunction, failedFunction) {
        return User.getUserList(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getUserInfoByKeyId = function (params, successFunction, failedFunction) {
        return User.getUserInfoByKeyId(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.deleteUser = function (params, successFunction, failedFunction) {
        return User.deleteUser(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.editUser = function (params, successFunction, failedFunction) {
        return User.editUser(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    vm.merge = function (arr1, arr2) {
        var arr3 = [], arr4 = [];
        arr3 = arr3.concat(arr1, arr2);
        angular.forEach(arr3, function (value) {
            if (isNotContains(arr4, value) || arr4.length === 0) {
                arr4.push(value);
            }
        });
        function isNotContains(arr4, value) {
            var b = true;
            angular.forEach(arr4, function (item) {
                if (item['ORGANIZATION_KEY_ID'] === value['ORGANIZATION_KEY_ID']
                    || item['ORGANIZATION_NAME'] === value['ORGANIZATION_NAME']) {
                    b = false;
                    return false;
                }
            });
            return b;
        }

        return arr4;
    };

    vm.showTable = function ($vm, params, $state) {
        var list = {
            dataFunction: ajaxRequest,
            dataParams: params,
            columns: [{
                field: 'ACCOUNT',
                title: '用户名',
                align: 'center',
                valign: 'middle',
                width: 248,
                formatter: accountFormat,
                events: {
                    'click .flag': function (e, value, row) {
                        $state.go('main.baseData.userEdit', {"USER_KEY_ID": row.USER_KEY_ID});
                    }
                }
            }, {
                field: 'USER_ROLE',
                title: '用户所属角色',
                width: 288,
                align: 'center',
                valign: 'middle',
                formatter: userRoleFormatter
            }, {
                field: 'USER_MAILBOX',
                title: '用户邮箱',
                align: 'center',
                width: 198,
                valign: 'middle'
            }, {
                field: 'IS_ONLINE',
                title: '是否上线',
                width: 168,
                align: 'center',
                valign: 'middle',
                formatter: isOnlineFormatter
            }]
        };
        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };

        function accountFormat(value) {
            return '<div class="flag" style="color: #428bca;">' + value + '</div>';
        }

        function userRoleFormatter(value) {
            var htmlArr = [];
            for (var i = 0; i < value.length; i++) {
                htmlArr.push('<div>' + value[i].ROLE_NAME + '</div>');
            }
            return htmlArr.join('');
        }

        function isOnlineFormatter(value) {
            return value === 1 ? '是' : '否';
        }

        return $vm;
    };

    function ajaxRequest(params, successFunction, failedFunction) {
        User.getUserList(JSON.stringify(params)).$promise
            .then(function (response) {
                $rootScope.handleMessage(response, function () {
                    successFunction(response.value || {total: 0, rows: []});
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                });
            }, function () {
                $rootScope.alertDialog("获取列表信息失败");
                failedFunction();
            });
    }

    vm.isEmptyObject = function (obj) {
        for (var n in obj) {
            return false
        }
        return true;
    };

    vm.validJudge = function (form, roleList, organization_key_id, failedTip) {
        if (roleList.length === 0) {
            failedTip('请选择至少一个账号角色');
            return false;
        }
        if (!vm.isEmptyObject(form.clientName.$error)) {
            if (form.clientName.$error.required) {
                failedTip('用户名不能为空');
            } else {
                failedTip('用户名不符合规则');
            }
            return false;
        }
        if (!vm.isEmptyObject(form.password.$error)) {
            if (form.password.$error.required) {
                failedTip('账号密码不能为空');
            } else {
                failedTip('账号密码不符合规则');
            }
            return false;
        }
        if (!vm.isEmptyObject(form.email.$error)) {
            if (form.email.$error) {
                failedTip('账号邮箱不符合规则');
            }
            return false;
        }
        return true;
    };

    vm.downloadUserList = function (params, successFunction, failedFunction) {
        return User.downloadUserList(JSON.stringify(params)).$promise
            .then(successFunction, failedFunction);
    };

    return vm;
}
"use strict";
APP.CONTROLLERS.controller('keyPopulationDetailReportCtrl', keyPopulationDetailReportCtrl);
keyPopulationDetailReportCtrl.$inject = ['$rootScope', '$state', 'keyPopulationReportService','$filter'];
function keyPopulationDetailReportCtrl($rootScope, $state, keyPopulationReportService,$filter) {
    var vm = this;
    vm.isSearching=false;
    vm.years=[];
    vm.months=[1,2,3,4,5,6,7,8,9,10,11,12];
    vm.isTimeUsed = $state.params.DETAIL_CHART_VALUE === 'GlucoseAndWarning';

    if(vm.isTimeUsed){
        keyPopulationReportService.getSysDate('', function (response) {
            $rootScope.handleMessage(response, function (data) {
                vm.nowYear=new Date(data).getFullYear()+'';
                vm.nowMonth=new Date(data).getMonth()+1;
                for(var i=2015;i<=vm.nowYear;i++){
                    vm.years.push(i);
                }
                vm.Year=vm.nowYear;
                vm.Month=vm.months[vm.nowMonth-1];
                setChartsAndTable();
            }, function () {
                $rootScope.alertDialog("获取服务器时间失败");
                vm.nowYear=new Date().getFullYear()+'';
                vm.nowMonth=new Date().getMonth()+1;
                for(var i=2015;i<=vm.nowYear;i++){
                    vm.years.push(i);
                }
                vm.Year=vm.nowYear;
                vm.Month=vm.months[vm.nowMonth-1];
                setChartsAndTable();
            });
        },function () {
            $rootScope.alertDialog("获取服务器时间失败");
            vm.nowYear=new Date().getFullYear()+'';
            vm.nowMonth=new Date().getMonth()+1;
            for(var i=2015;i<=vm.nowYear;i++){
                vm.years.push(i);
            }
            vm.Year=vm.nowYear;
            vm.Month=vm.months[vm.nowMonth-1];
            setChartsAndTable();
        });
    }else{
        setChartsAndTable();
    }

    vm.changeYear=function () {
        vm.Month=1;
    };

    vm.refreshChart=function () {
        vm.isSearching=true;
        setChartsAndTable();
    };

    vm.returnBack=function () {
      $state.go('main.report.keyPopulationReportReturnBack',{
          TYPE:$state.params.DETAIL_CHART_TYPE
      });  
    };

    function setChartsAndTable() {
        if ($state.params.DETAIL_CHART_TYPE === 'diabetes' && $state.params.DETAIL_CHART_VALUE === 'GlucoseAndWarning') {
            vm.firstTitle="辖区内各机构本月血糖稳定与预警人数";
            vm.secondTitle="各机构本月血糖稳定与预警人数";
            keyPopulationReportService.getMoreGlucoseAndWarningData({
                SEARCH_YEAR_MONTH: $filter('commonDate')(new Date(vm.Year + '-' + vm.Month))
            }, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawGlucoseAndWarningCharts(data.HDP_DISTRIBUTION_DATA);
                    vm.isSearching=false;
                }, function () {
                    $rootScope.alertDialog("获取辖区内各机构本月血糖稳定及预警人数数据失败");
                    vm.isSearching=false;
                });
            }, function () {
                $rootScope.alertDialog("获取辖区内各机构本月血糖稳定及预警人数数据失败");
                vm.isSearching=false;
            });
            keyPopulationReportService.getPageGlucoseAndWarningData(vm,{
                SEARCH_YEAR_MONTH: $filter('commonDate')(new Date(vm.Year + '-' + vm.Month))
            });
        } else if ($state.params.DETAIL_CHART_TYPE === 'hypertension' && $state.params.DETAIL_CHART_VALUE === 'GlucoseAndWarning') {
            vm.firstTitle="辖区内各机构本月血压稳定与预警人数";
            vm.secondTitle="各机构本月血糖压稳定与预警人数";
            keyPopulationReportService.getMoreHBPGlucoseAndWarningData({
                SEARCH_YEAR_MONTH: $filter('commonDate')(new Date(vm.Year + '-' + vm.Month))
            }, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawGlucoseAndWarningCharts(data.HDP_DISTRIBUTION_DATA);
                    vm.isSearching=false;
                }, function () {
                    $rootScope.alertDialog("获取辖区内各机构本月血糖稳定及预警人数数据失败");
                    vm.isSearching=false;
                });
            }, function () {
                $rootScope.alertDialog("获取辖区内各机构本月血糖稳定及预警人数数据失败");
                vm.isSearching=false;
            });
            keyPopulationReportService.getPageHBPGlucoseAndWarningData(vm,{
                SEARCH_YEAR_MONTH: $filter('commonDate')(new Date(vm.Year + '-' + vm.Month))
            });
        }else if($state.params.DETAIL_CHART_TYPE === 'diabetes' && $state.params.DETAIL_CHART_VALUE === 'Distribution'){
            vm.firstTitle="辖区内各机构糖尿病人群分布";
            vm.secondTitle="各机构糖尿病人群人数比例表格";
            keyPopulationReportService.getMoreODPDistributionData({}, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawDistributionCharts(data.ODP_DISTRIBUTION_DATA);
                    vm.isSearching=false;
                }, function () {
                    $rootScope.alertDialog("获取辖区内各机构糖尿病人群分布(更多)数据失败");
                    vm.isSearching=false;
                });
            }, function () {
                $rootScope.alertDialog("获取辖区内各机构糖尿病人群分布(更多)数据失败");
                vm.isSearching=false;
            });
            keyPopulationReportService.getPageODPDistributionData(vm,{});
        }else if($state.params.DETAIL_CHART_TYPE === 'hypertension' && $state.params.DETAIL_CHART_VALUE === 'Distribution'){
            vm.firstTitle="辖区内各机构高血压人群分布";
            vm.secondTitle="各机构高血压人群人数比例表格";
            keyPopulationReportService.getMoreOHPDistributionData({}, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawDistributionCharts(data.HDP_DISTRIBUTION_DATA);
                    vm.isSearching=false;
                }, function () {
                    $rootScope.alertDialog("获取辖区内各机构高血压人群分布(更多)数据失败");
                    vm.isSearching=false;
                });
            }, function () {
                $rootScope.alertDialog("获取辖区内各机构高血压人群分布(更多)数据失败");
                vm.isSearching=false;
            });
            keyPopulationReportService.getPageOHPDistributionData(vm,{});
        }
    }
    
    function drawGlucoseAndWarningCharts(chartsData) {
        if(!chartsData){
            chartsData=[];
        }
        var nameList=[];
        var valueList_1=[];
        var valueList_2=[];

        for(var i=chartsData.length-1;i>=0;i--){
            nameList.push(chartsData[i].ORGANIZATION_NAME);
            valueList_1.push(chartsData[i].STABLE_COUNT);
            valueList_2.push(chartsData[i].UNSTABLE_COUNT);
        }

        vm.chartData={
            color:['#1d4fdc','#ff6b6b'],
            title:{
                text:$state.params.DETAIL_CHART_TYPE==='diabetes'?'辖区各机构本月血糖稳定与预警人数':'辖区各机构本月血压稳定与预警人数',
                left:'left'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function (a) {
                    if (!a) {
                        return;
                    }
                    
                    if((a[0].value+a[1].value)===0){
                        return "<div><span>" + a[0].name + "</span><br/><span>预警比例：-%</span><div>";
                    }
                    return "<div><span>" + a[0].name + "</span><br/><span>预警比例：" +(a[1].value*100/(a[0].value+a[1].value)).toFixed(2) + "%</span><div>";
                }
            },
            legend: {
                data: ['稳定人数', '预警人数'],
                left:'right'
            },
            grid: {
                left: '2%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            dataZoom: [
                {
                    type:'slider',
                    show: chartsData.length>15?true:false,
                    yAxisIndex: 0,
                    startValue:chartsData.length-15,
                    endValue:chartsData.length-1,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    showDataShadow: false,
                    left: '96%'
                }
            ],
            xAxis:  {
                type: 'value',
                minInterval: 1
            },
            yAxis: {
                type: 'category',
                data: nameList,
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        if (value && value.length > 10) {
                            return value.substring(0, 10) + "...";
                        }
                        return value;
                    }
                }
            },
            series: [
                {
                    name: '稳定人数',
                    type: 'bar',
                    stack: $state.params.DETAIL_CHART_TYPE==='diabetes'?'糖尿病患者':'高血压患者',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data:valueList_1
                },
                {
                    name: '预警人数',
                    type: 'bar',
                    stack: $state.params.DETAIL_CHART_TYPE==='diabetes'?'糖尿病患者':'高血压患者',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: valueList_2
                }
            ]
        };
    }
    
    function drawDistributionCharts(chartsData) {
        if(!chartsData){
            chartsData=[];
        }
        var nameList=[];
        var valueList=[];



        for(var i=chartsData.length-1;i>=0;i--){
                nameList.push(chartsData[i].ORGANIZATION_NAME);
            if($state.params.DETAIL_CHART_TYPE!=='diabetes'){
                valueList.push(chartsData[i].SUB_HYPERTENSION_TOTAL);
            }else{
                valueList.push(chartsData[i].SUB_DIABETES_TOTAL);
            }

        }

        vm.chartData={
            title:{
                text:$state.params.DETAIL_CHART_TYPE==='diabetes'?'辖区各机构糖尿病人群分布':'辖区各机构高血压人群分布',
                left:'left'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function (a) {
                    if (!a) {
                        return;
                    }
                    return "<div><span>" + a[0].name + 
                        "</span><br/><span>患病人群数："+ a[0].value +
                        "</span><br/><span>所占比例：" +
                        ($state.params.DETAIL_CHART_TYPE==='diabetes'?(chartsData[(chartsData.length-a[0].dataIndex-1)].DIABETES_TOTAL!==0?chartsData[(chartsData.length-a[0].dataIndex-1)].DIABETES_PERSENT:'-'):(chartsData[(chartsData.length-a[0].dataIndex-1)].HYPERTENSION_TOTAL!==0?chartsData[(chartsData.length-a[0].dataIndex-1)].HYPERTENSION_PERSENT:'-')) +
                        "%</span><div>";
                }
            },
            legend: {
                data: ['患病人群数'],
                left:'right'
            },
            grid: {
                left: '2%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            dataZoom: [
                {
                    type:'slider',
                    show: chartsData.length>15?true:false,
                    yAxisIndex: 0,
                    startValue:chartsData.length-15,
                    endValue:chartsData.length-1,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    showDataShadow: false,
                    left: '96%'
                }
            ],
            xAxis:  {
                type: 'value',
                minInterval: 1
            },
            yAxis: {
                type: 'category',
                data: nameList,
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        if (value && value.length > 10) {
                            return value.substring(0, 10) + "...";
                        }
                        return value;
                    }
                }
            },
            series: [
                {
                    name: '患病人群数',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data:valueList
                }
            ]
        };
    }


    return vm;
}
"use strict";
APP.CONTROLLERS.controller('keyPopulationReportCtrl', keyPopulationReportCtrl);
keyPopulationReportCtrl.$inject = ['$rootScope', '$state', 'keyPopulationReportService','contractReportService','$filter'];
function keyPopulationReportCtrl($rootScope, $state, keyPopulationReportService,contractReportService,$filter) {
    var vm = this;

    var lastLevel = null;
    var lastOrganization = null;
    vm.lastSearchParam=null;


    vm.isReset=false;
    vm.isSearching=false;
    vm.organizationReportName = '';
    vm.isLevel=null;//是否是分支机构，即是否有下属机构，'1'表示有下属机构，'0'表示没有


    vm.currentNavItem=$state.params.TYPE?$state.params.TYPE:'diabetes';
    vm.years=[];
    vm.months=['01','02','03','04','05','06','07','08','09','10','11','12'];



    vm.initLevelList = function () {
        if (!vm.organizationLevels) {
            contractReportService.getOrganizationLevel('', function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.organizationLevels = data;
                }, function () {
                    $rootScope.alertDialog("获取机构级别失败");
                });
            }, function () {
                $rootScope.alertDialog("获取机构级别失败");
            });
        }
    };

    vm.initOrangizationByLevel = function () {
        if (lastLevel && lastLevel === vm.organizationLevel.LEVEL) {
            return;
        }
        lastLevel = vm.organizationLevel.LEVEL;
        contractReportService.getOrganizationByLevel({
            ORGANIZATION_LEVEL: vm.organizationLevel.LEVEL
        }, function (response) {
            $rootScope.handleMessage(response, function (data) {
                vm.organizationNames = data;
            }, function () {
                $rootScope.alertDialog("获取机构级别失败");
            });
        }, function () {
            $rootScope.alertDialog("获取机构级别失败");
        });
    };

    vm.initAllDoctorData = function () {
        if (lastOrganization && lastOrganization === vm.organizationName.ORGANIZATION_KEY_ID) {
            return;
        }
        lastOrganization = vm.organizationName.ORGANIZATION_KEY_ID;
        contractReportService.getDoctorByOrganization({
            ORGANIZATION_KEY_ID: vm.organizationName.ORGANIZATION_KEY_ID
        }, function (response) {
            $rootScope.handleMessage(response, function (data) {
                vm.doctorNames = data.DOCTOR_LIST;
            }, function () {
                $rootScope.alertDialog("获取医生列表失败");
            });
        }, function () {
            $rootScope.alertDialog("获取医生列表失败");
        });
    };

    vm.getOrganizationList = function () {
        contractReportService.getOrganizationORDoctor({
            SEARCH_NAME: vm.searchTerm
        }, function (response) {
            $rootScope.handleMessage(response, function (data) {
                vm.organization = data.ORGANIZATION_OR_DOCTOR_LIST;
            }, function () {
                $rootScope.alertDialog("获取统计信息失败");
            });
        }, function () {
            $rootScope.alertDialog("获取统计信息失败");
        });
    };
    vm.searchTerm;
    vm.searchOrganizationOrDoctor = {};
    vm.clearSearchTerm = function () {
        vm.searchTerm = '';
        //关闭的时候判断已有的值是否在list中，在的话选中，不在的话把list赋值给list再选中
        if (vm.searchOrganizationOrDoctor !== undefined) {
            var temp;
            if(vm.searchOrganizationOrDoctor.FAMILY_DOCTOR_KEY_ID){
                temp = $rootScope.selectItem(vm.organization, "FAMILY_DOCTOR_KEY_ID", vm.searchOrganizationOrDoctor.FAMILY_DOCTOR_KEY_ID);
            }else{
                temp = $rootScope.selectItem(vm.organization, "ORGANIZATION_KEY_ID", vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID);
            }
            if (temp != null) {
                vm.searchOrganizationOrDoctor = temp;
            } else {
                vm.organization = [];
                vm.organization.push(temp);
                vm.searchOrganizationOrDoctor = vm.organization[0];
            }
        }
    };
    vm.getSearchTerm = function () {
        vm.searchTerm = vm.searchOrganizationOrDoctor ? vm.searchOrganizationOrDoctor.ORGANIZATION_OR_DOCTOR_NAME : undefined;
        vm.searchTermChange();
    };
    angular.element('input[name="organization"]').on('keydown', function (ev) {
        ev.stopPropagation();
    });
    vm.searchTermChange = function () {
        if (vm.searchTerm !== '' && vm.searchTerm !== undefined) {
            vm.getOrganizationList();
        } else {
            vm.organization = [];
        }
    };
    vm.changeSearchForAllSelect=function(searchData) {
        if(!searchData || !searchData.ORGANIZATION_OR_DOCTOR_NAME){
            return;
        }

        if(vm.organizationLevels){
            vm.organizationLevel=getIndexOrAdd({
                LEVEL:searchData.ORGANIZATION_LEVEL
            },vm.organizationLevels,'LEVEL');
        }else{
            contractReportService.getOrganizationLevel('', function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.organizationLevels = data;
                    vm.organizationLevel=getIndexOrAdd({
                        LEVEL:searchData.ORGANIZATION_LEVEL
                    },vm.organizationLevels,'LEVEL');
                }, function () {
                    $rootScope.alertDialog("获取机构级别失败");
                });
            }, function () {
                $rootScope.alertDialog("获取机构级别失败");
            });
        }



        if (lastLevel && lastLevel === searchData.ORGANIZATION_LEVEL) {
            vm.organizationName=getIndexOrAdd({
                ORGANIZATION_KEY_ID:searchData.ORGANIZATION_KEY_ID,
                ORGANIZATION_NAME:searchData.ORGANIZATION_NAME
            },vm.organizationNames,'ORGANIZATION_KEY_ID');
        }else{
            contractReportService.getOrganizationByLevel({
                ORGANIZATION_LEVEL: searchData.ORGANIZATION_LEVEL
            }, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.organizationNames = data;
                    vm.organizationName=getIndexOrAdd({
                        ORGANIZATION_KEY_ID:searchData.ORGANIZATION_KEY_ID,
                        ORGANIZATION_NAME:searchData.ORGANIZATION_NAME
                    },vm.organizationNames,'ORGANIZATION_KEY_ID');
                }, function () {
                    $rootScope.alertDialog("获取机构级别失败");
                });
            }, function () {
                $rootScope.alertDialog("获取机构级别失败");
            });
        }

        if(searchData.FAMILY_DOCTOR_KEY_ID){
            vm.searchObject='1';

            if (lastOrganization && lastOrganization === searchData.ORGANIZATION_KEY_ID) {
                vm.doctorName=getIndexOrAdd({
                    FAMILY_DOCTOR_KEY_ID:searchData.FAMILY_DOCTOR_KEY_ID,
                    DOCTOR_NAME:searchData.ORGANIZATION_OR_DOCTOR_NAME
                },vm.doctorNames,'FAMILY_DOCTOR_KEY_ID');
            }else{
                contractReportService.getDoctorByOrganization({
                    ORGANIZATION_KEY_ID: searchData.ORGANIZATION_KEY_ID
                }, function (response) {
                    $rootScope.handleMessage(response, function (data) {
                        vm.doctorNames = data.DOCTOR_LIST;
                        vm.doctorName=getIndexOrAdd({
                            FAMILY_DOCTOR_KEY_ID:searchData.FAMILY_DOCTOR_KEY_ID,
                            DOCTOR_NAME:searchData.ORGANIZATION_OR_DOCTOR_NAME
                        },vm.doctorNames,'FAMILY_DOCTOR_KEY_ID');
                    }, function () {
                        $rootScope.alertDialog("获取医生列表失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取医生列表失败");
                });
            }
        }else{
            vm.searchObject='0';
        }

        lastLevel= searchData.ORGANIZATION_LEVEL;
        lastOrganization = searchData.ORGANIZATION_KEY_ID;


        function getIndexOrAdd(selectValue, selectList, compareKey) {
            if (selectList) {
                for (var i = 0; i < selectList.length; i++) {
                    if ((selectList[i][compareKey]+'') === (selectValue[compareKey]+'')) {
                        return selectList[i];
                    }
                }
                selectList[selectList.length] = selectValue;
                return selectList[selectList.length-1];
            } else {
                selectList = [selectValue];
                return selectList[0];
            }
        }
    };
    vm.changeSelect = function (index) {
        switch (index) {
            case 0:
                vm.organizationLevel = null;
                vm.organizationName = null;
                vm.doctorName = null;
                vm.searchOrganizationOrDoctor=null;
                break;
            case 1:
                vm.organizationName = null;
                vm.doctorName = null;
                vm.searchOrganizationOrDoctor=null;
                break;
            case 2:
                vm.doctorName = null;
                vm.searchOrganizationOrDoctor=null;
                break;
            default:
                vm.searchOrganizationOrDoctor=null;
                break;
        }
    };


    vm.resetChart=function () {
        vm.lastSearchParam=null;
        vm.isReset = true;
        vm.searchObject = null;
        vm.organizationLevel = null;
        vm.organizationName = null;
        vm.doctorName = null;
        vm.searchOrganizationOrDoctor = null;
        vm.organizationReportName = '';
        resetTime();
        if(vm.currentNavItem==='diabetes'){
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:true,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:false,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
        }else if(vm.currentNavItem==='hypertension'){
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:true,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:true,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
        }
        getResetAllData(vm.currentNavItem);

    };

    vm.searchChart=function () {
        vm.isSearching=true;
        if ((!vm.searchOrganizationOrDoctor || !vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID) && (!vm.searchObject || (vm.searchObject === '0' && !vm.organizationName) || (vm.searchObject === '1' && !vm.doctorName))) {
            $rootScope.alertDialog("请输入正确的筛选条件！");
            vm.isSearching = false;
            return;
        }
        if(vm.currentNavItem==='diabetes'){

            vm.showLeftMiddle={
                chart:false,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:false,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
        }else if(vm.currentNavItem==='hypertension'){
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:false
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:false,
                date:false,
                more:false
            };
            vm.showRightMiddle={
                chart:true,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
        }
        getSearchData(vm.currentNavItem);

    };

    vm.changeNavItem=function (type) {
        if(type===vm.currentNavItem){
            return;
        }
        resetTime();
        if(!vm.lastSearchParam && type==='diabetes'){
            vm.isReset=true;
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:true,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:false,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
            getResetAllData(type);
        }else if(!vm.lastSearchParam && type!=='diabetes'){
            vm.isReset=true;
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:true,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:true,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
            getResetAllData(type);
        }else if(vm.lastSearchParam && type==='diabetes'){
            vm.isSearching=true;
            vm.showLeftMiddle={
                chart:false,
                date:true,
                more:true
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:false,
                date:false,
                more:true
            };
            vm.showRightMiddle={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
            getSearchData(type);
        }else if(vm.lastSearchParam && type!=='diabetes'){
            vm.isSearching=true;
            vm.showLeftMiddle={
                chart:true,
                date:true,
                more:false
            };
            vm.showLeftBottom={
                chart:true,
                date:true,
                more:false
            };
            vm.showRightTop={
                chart:false,
                date:false,
                more:false
            };
            vm.showRightMiddle={
                chart:true,
                date:false,
                more:false
            };
            vm.showRightBottom={
                chart:true,
                date:false,
                more:false
            };
            getSearchData(type);
        }
    };

    vm.moreInfo=function (value) {
        $state.go('main.report.keyPopulationDetailReport',{
            DETAIL_CHART_TYPE:vm.currentNavItem,
            DETAIL_CHART_VALUE:value
        });
    };
    
    function getResetAllData(type) {
        if(type==='diabetes'){
            keyPopulationReportService.getAllDiabetesData({
                SEARCH_TIME:vm.nowYear,
                SEARCH_YEAR_MONTH:$filter('commonDate')(new Date(vm.nowYear+'-'+vm.nowMonth))
            }, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.isLevel=data.ORGANIZATION_LEVEL;
                    vm.diabetesTotal=data.DIABETES_DATA.DIABETES_TOTAL||0;
                    vm.followupTotal=data.DIABETES_DATA.FOLLOW_UP_TOTAL||0;
                    vm.followupAverage=data.DIABETES_DATA.RESIDENT_FOLLOW_UP_ED_AVERAGE||0;
                    vm.averageTime=data.DIABETES_DATA.DIABETES_AVERAGE||0;
                    vm.doctorManageAverage=data.DIABETES_DATA.DOCTOR_PER_RESIDENT_MANAGEMENT||0;
                    drawLeftMiddle(data,'diabetes');
                    drawLeftBottom(data,'diabetes');
                    drawRightTop(data,'diabetes');
                    drawRightBottom(data,'diabetes');
                    vm.isReset = false;
                }, function () {
                    $rootScope.alertDialog("获取报表初始化数据失败");
                    vm.isReset = false;
                });
            },function () {
                $rootScope.alertDialog("获取报表初始化数据失败");
                vm.isReset = false;
            });
        }else{
            keyPopulationReportService.getAllHypertensionData({
                SEARCH_TIME:vm.nowYear,
                SEARCH_YEAR_MONTH:$filter('commonDate')(new Date(vm.nowYear+'-'+vm.nowMonth))
            }, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.isLevel=data.ORGANIZATION_LEVEL;
                    vm.hypertensionTotal=data.HYPERTENSION_DATA.HYPERTENSION_TOTAL||0;
                    vm.followupHypertensionTotal=data.HYPERTENSION_DATA.FOLLOW_UP_TOTAL||0;
                    vm.hypertensionDoctorAverage=data.HYPERTENSION_DATA.DOCTOR_PER_RESIDENT_MANAGEMENT||0;
                    vm.hypertensionFollowupAverage=data.HYPERTENSION_DATA.RESIDENT_FOLLOW_UP_ED_AVERAGE||0;
                    vm.hypertensionAverageTime=data.HYPERTENSION_DATA.DIABETES_AVERAGE||0;
                    vm.manageNumber_1=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_1||0;
                    vm.manageNumber_2=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_2||0;
                    vm.manageNumber_3=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_3||0;
                    vm.bloodPressure_1=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_1||0;
                    vm.bloodPressure_2=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_2||0;
                    vm.bloodPressure_3=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_3||0;
                    drawLeftMiddle(data,'hypertension');
                    drawLeftBottom(data,'hypertension');
                    drawRightTop(data,'hypertension');
                    drawRightMiddle(data,'hypertension');
                    drawRightBottom(data,'hypertension');
                    vm.isReset = false;
                }, function () {
                    $rootScope.alertDialog("获取报表初始化数据失败");
                    vm.isReset = false;
                });
            },function () {
                $rootScope.alertDialog("获取报表初始化数据失败");
                vm.isReset = false;
            });
        }
    }

    function getSearchData(type) {
        var param={
            SEARCH_TIME:vm.nowYear,
            SEARCH_YEAR_MONTH:$filter('commonDate')(new Date(vm.nowYear+'-'+vm.nowMonth))
        };
        if (vm.searchOrganizationOrDoctor && vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID && !vm.searchOrganizationOrDoctor.FAMILY_DOCTOR_KEY_ID) {
            param.ORGANIZATION_KEY_ID = vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID;
        } else if (vm.searchOrganizationOrDoctor && vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID && vm.searchOrganizationOrDoctor.FAMILY_DOCTOR_KEY_ID) {
            param.ORGANIZATION_KEY_ID = vm.searchOrganizationOrDoctor.ORGANIZATION_KEY_ID;
            param.FAMILY_DOCTOR_KEY_ID = vm.searchOrganizationOrDoctor.FAMILY_DOCTOR_KEY_ID;
        } else if (vm.searchObject === '0') {
            param.ORGANIZATION_KEY_ID = vm.organizationName.ORGANIZATION_KEY_ID;
        } else {
            param.ORGANIZATION_KEY_ID = vm.organizationName.ORGANIZATION_KEY_ID;
            param.FAMILY_DOCTOR_KEY_ID = vm.doctorName.FAMILY_DOCTOR_KEY_ID;
        }
        vm.organizationReportName=vm.organizationName.ORGANIZATION_NAME;
        vm.lastSearchParam=param;

        if(type==='diabetes'){
            vm.refreshRightMiddle();
            keyPopulationReportService.getAllDiabetesData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {

                    vm.diabetesTotal=data.DIABETES_DATA.DIABETES_TOTAL||0;
                    vm.followupTotal=data.DIABETES_DATA.FOLLOW_UP_TOTAL||0;
                    vm.followupAverage=data.DIABETES_DATA.RESIDENT_FOLLOW_UP_ED_AVERAGE||0;
                    vm.averageTime=data.DIABETES_DATA.DIABETES_AVERAGE||0;
                    vm.doctorManageAverage=data.DIABETES_DATA.DOCTOR_PER_RESIDENT_MANAGEMENT||0;
                    drawLeftMiddle(data,'diabetes');
                    drawLeftBottom(data,'diabetes');
                    drawRightTop(data,'diabetes');
                    drawRightBottom(data,'diabetes');
                    vm.isSearching=false;
                }, function () {
                    $rootScope.alertDialog("查询报表数据失败");
                    vm.isSearching=false;
                });
            },function () {
                $rootScope.alertDialog("查询报表数据失败");
                vm.isSearching=false;
            });
        }else{
            vm.refreshLeftMiddle('hypertension');
            keyPopulationReportService.getAllHypertensionData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    vm.isLevel=data.ORGANIZATION_LEVEL;
                    vm.hypertensionTotal=data.HYPERTENSION_DATA.HYPERTENSION_TOTAL||0;
                    vm.followupHypertensionTotal=data.HYPERTENSION_DATA.FOLLOW_UP_TOTAL||0;
                    vm.hypertensionDoctorAverage=data.HYPERTENSION_DATA.DOCTOR_PER_RESIDENT_MANAGEMENT||0;
                    vm.hypertensionFollowupAverage=data.HYPERTENSION_DATA.RESIDENT_FOLLOW_UP_ED_AVERAGE||0;
                    vm.hypertensionAverageTime=data.HYPERTENSION_DATA.DIABETES_AVERAGE||0;
                    vm.manageNumber_1=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_1||0;
                    vm.manageNumber_2=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_2||0;
                    vm.manageNumber_3=data.HYPERTENSION_DATA.GRADING_MANAGEMENT_3||0;
                    vm.bloodPressure_1=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_1||0;
                    vm.bloodPressure_2=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_2||0;
                    vm.bloodPressure_3=data.HYPERTENSION_DATA.BLOOD_PRESSURE_GRADING_3||0;
                    drawLeftBottom(data,'hypertension');
                    drawRightTop(data,'hypertension');
                    drawRightMiddle(data,'hypertension');
                    drawRightBottom(data,'hypertension');
                    vm.isSearching = false;
                }, function () {
                    $rootScope.alertDialog("获取报表数据失败");
                    vm.isSearching = false;
                });
            },function () {
                $rootScope.alertDialog("获取报表数据失败");
                vm.isSearching = false;
            });
        }
    }
    
    function resetTime() {
        vm.leftMiddleYear=vm.nowYear+'';
        vm.leftMiddleMonth=vm.nowMonth+'';
        vm.leftBottomYear=vm.nowYear+'';
        vm.rightTopYear=vm.nowYear+'';
        vm.rightTopMonth=vm.nowMonth+'';
        vm.rightMiddleYear=vm.nowYear+'';
        vm.rightMiddleMonth=vm.nowMonth+'';
        vm.rightBottomYear=vm.nowYear+'';
        vm.rightBottomMonth=vm.nowMonth+'';
    }


    vm.changeRightMiddleYear=function() {
        vm.rightMiddleMonth='01';
        vm.refreshRightMiddle();
    };

    vm.changeLeftMiddleYear=function() {
        vm.leftMiddleMonth='01';
        vm.refreshLeftMiddle();
    };

    vm.refreshRightMiddle=function() {
        var param=vm.lastSearchParam||{};
        param.SEARCH_YEAR_MONTH=vm.rightMiddleYear+'-'+vm.rightMiddleMonth+'-01';
        keyPopulationReportService.getGlucoseAndWarningData(param, function (response) {
            $rootScope.handleMessage(response, function (data) {
                drawRightMiddle(data,vm.currentNavItem);
            }, function () {
                $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
            });
        },function () {
            $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
        });

    };

    vm.refreshLeftMiddle=function(type) {
        var param=vm.lastSearchParam||{};
        param.SEARCH_YEAR_MONTH=vm.leftMiddleYear+'-'+vm.leftMiddleMonth+'-01'
        if((type && type==='hypertension') || vm.currentNavItem==='hypertension'){
            keyPopulationReportService.getHBPGlucoseAndWarningData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawLeftMiddle(data,vm.currentNavItem);
                }, function () {
                    $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
                });
            },function () {
                $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
            });
        }else{
            keyPopulationReportService.getGlucoseAndWarningData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawLeftMiddle(data,vm.currentNavItem);
                }, function () {
                    $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
                });
            },function () {
                $rootScope.alertDialog("获取月度稳定人数与预警人数失败");
            });
        }
    };

    vm.refreshLeftBottom=function () {
        var param=vm.lastSearchParam||{};
        param.SEARCH_TIME=vm.leftBottomYear;
        if(vm.currentNavItem==='hypertension') {
            keyPopulationReportService.getPerMonthHypertensionData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawLeftBottom(data,vm.currentNavItem);
                }, function () {
                    $rootScope.alertDialog("获取每月新增糖尿病患者数据失败");
                });
            },function () {
                $rootScope.alertDialog("获取每月新增糖尿病患者数据失败");
            });
        }else{
            keyPopulationReportService.getPerMonthDiabetesData(param, function (response) {
                $rootScope.handleMessage(response, function (data) {
                    drawLeftBottom(data,vm.currentNavItem);
                }, function () {
                    $rootScope.alertDialog("获取每月新增高血压患者数据失败");
                });
            },function () {
                $rootScope.alertDialog("获取每月新增高血压患者数据失败");
            });
        }
    };


    function drawLeftMiddle(chartData,type) {
        if (!vm.showLeftMiddle.chart) {
            return;
        }

        var axisList = [];
        var axisValueList_1 = [];
        var axisValueList_2 = [];

        if (type='hypertension' && vm.lastSearchParam) {
            if (!chartData.GLUCOSE_AND_WARNING) {
                chartData.GLUCOSE_AND_WARNING = [{}];
            }

            vm.leftMiddle={
                color:['#1d4fdc','#ff6b6b'],
                title : {
                    text: '月度血压稳定与预警人数数据',
                    x:'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '高血压患者',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:chartData.GLUCOSE_AND_WARNING[0].STABLE_COUNT||0, name:'稳定人数'},
                            {value:chartData.GLUCOSE_AND_WARNING[0].UNSTABLE_COUNT||0, name:'预警人数'}
                        ],
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        } else {
            if (!chartData.GLUCOSE_AND_WARNING) {
                chartData.GLUCOSE_AND_WARNING = [];
            }

            for (var i = 0; i < chartData.GLUCOSE_AND_WARNING.length; i++) {
                axisList.push(chartData.GLUCOSE_AND_WARNING[i].ORGANIZATION_NAME);
                axisValueList_1.push(chartData.GLUCOSE_AND_WARNING[i].UNSTABLE_COUNT || 0);
                axisValueList_2.push(chartData.GLUCOSE_AND_WARNING[i].STABLE_COUNT || 0);
            }

            vm.leftMiddle = {
                color:['#1d4fdc','#ff6b6b'],
                title: {
                    text: type === 'diabetes' ? '辖区内各机构本月血糖稳定及预警人数' : '辖区内各机构本月血压稳定及预警人数',
                    x: 'left'

                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    orient: 'vertical',
                    data: ['预警人数', '稳定人数'],
                    x: 'right'
                },
                grid: {
                    left: '8%',
                    right: '4%',
                    bottom: '16%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: axisList,
                        axisLabel: {
                            interval: 0,
                            rotate: 30,
                            formatter: function (value) {
                                if (value && value.length > 10) {
                                    return value.substring(0, 10) + "...";
                                }
                                return value;
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        minInterval: 1
                    }
                ],
                series: [
                    {
                        name: '稳定人数',
                        type: 'bar',
                        stack: type === 'diabetes' ? '糖尿病人数' : '高血压人数',
                        data: axisValueList_2
                    },
                    {
                        name: '预警人数',
                        type: 'bar',
                        stack: type === 'diabetes' ? '糖尿病人数' : '高血压人数',
                        data: axisValueList_1
                    }
                ]
            };
        }
    }

    function drawLeftBottom(chartData,type) {
        if(!vm.showLeftBottom.chart){
            return;
        }

        var axisList=[];
        var axisValueList=[];

        if(type==='diabetes') {
            for (var i = 0,j=0; i < chartData.TIME_LIST.length; i++) {
                axisList.push( chartData.TIME_LIST[i].TIME+'月');
                if(j<chartData.PER_MONTH_DIABETES_DATA.length && chartData.PER_MONTH_DIABETES_DATA[j].ADD_TIME===chartData.TIME_LIST[i].TIME){
                    axisValueList.push(chartData.PER_MONTH_DIABETES_DATA[j].DIABETES_TOTAL);
                    j++;
                }else{
                    axisValueList.push(0);
                }
            }

            vm.leftBottom={
                title: {
                    text: '每月新增糖尿病人数'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['新增糖尿病人数'],
                    orient: 'vertical',
                    x:'right'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : axisList,
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'新增糖尿病人数',
                        type:'line',
                        label: {
                            normal: {
                                show: true,
                                textStyle:{
                                    color:'#000'
                                }
                            }
                        },
                        data:axisValueList
                    }
                ]
            };
        }else {
            for (var i = 0,j=0; i < chartData.TIME_LIST.length; i++) {
                axisList.push( chartData.TIME_LIST[i].TIME+'月');
                if(j<chartData.PER_MONTH_HYPERTENSION_DATA.length && chartData.PER_MONTH_HYPERTENSION_DATA[j].ADD_TIME===chartData.TIME_LIST[i].TIME){
                    axisValueList.push(chartData.PER_MONTH_HYPERTENSION_DATA[j].HYPERTENSION_TOTAL);
                    j++;
                }else{
                    axisValueList.push(0);
                }
            }

            vm.leftBottom={
                title: {
                    text: '每月新增高血压人数'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['新增高血压人数'],
                    orient: 'vertical',
                    x:'right'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : axisList,
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'新增高血压人数',
                        type:'line',
                        label: {
                            normal: {
                                show: true,
                                textStyle:{
                                    color:'#000'
                                }
                            }
                        },
                        data:axisValueList
                    }
                ]
            };
        }
    }

    function drawRightTop(chartData,type) {
        if(!vm.showRightTop.chart || vm.isLevel==='0'){
            return;
        }
        var total=0;
        var axisList=[];
        var axisValueList=[];

        if(type==='diabetes') {
            for (var i = 0; i < chartData.ODP_DISTRIBUTION_DATA.length; i++) {
                axisList.push(chartData.ODP_DISTRIBUTION_DATA[i].ORGANIZATION_NAME);
                axisValueList.push({
                    value:chartData.ODP_DISTRIBUTION_DATA[i].SUB_DIABETES_TOTAL||0,
                    name:chartData.ODP_DISTRIBUTION_DATA[i].ORGANIZATION_NAME
                });
                total=total+chartData.ODP_DISTRIBUTION_DATA[i].SUB_DIABETES_TOTAL||0;
            }
            if(total!==vm.diabetesTotal){
                axisList.push('其他');
                axisValueList.push({
                    value:(vm.diabetesTotal-total),
                    name:'其他'
                });
            }
            vm.rightTop={
                title : {
                    text: '辖区内各机构糖尿病人群分布',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '糖尿病人群分布',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        data:axisValueList,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }else {
            for (var i = 0; i < chartData.OHP_DISTRIBUTION_DATA.length; i++) {
                axisList.push(chartData.OHP_DISTRIBUTION_DATA[i].ORGANIZATION_NAME);
                axisValueList.push({
                    value:chartData.OHP_DISTRIBUTION_DATA[i].SUB_HYPERTENSION_TOTAL||0,
                    name:chartData.OHP_DISTRIBUTION_DATA[i].ORGANIZATION_NAME
                });
                total=total+chartData.OHP_DISTRIBUTION_DATA[i].SUB_HYPERTENSION_TOTAL||0;
            }
            if(total!==vm.hypertensionTotal){
                axisList.push('其他');
                axisValueList.push({
                    value:(vm.hypertensionTotal-total),
                    name:'其他'
                });
            }
            vm.rightTop={
                title : {
                    text: '辖区内各机构高血压人群分布',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '高血压人群分布',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        data:axisValueList,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }
    }

    function drawRightMiddle(chartData,type) {
        if(!vm.showRightMiddle.chart){
            return;
        }

        if(type==='diabetes') {
            if(!chartData.GLUCOSE_AND_WARNING){
                chartData.GLUCOSE_AND_WARNING=[{}];
            }
            vm.rightMiddle={
                title : {
                    text: '月度血糖稳定与预警人数数据',
                    x:'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '糖尿病患者',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:chartData.GLUCOSE_AND_WARNING[0].STABLE_COUNT||0, name:'稳定人数'},
                            {value:chartData.GLUCOSE_AND_WARNING[0].UNSTABLE_COUNT||0, name:'预警人数'}
                        ],
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }else{
            if(!chartData.HBP_DISTRIBUTION){
                chartData.HBP_DISTRIBUTION={};
            }
            var dataList=[{
                value:chartData.HBP_DISTRIBUTION.BLOOD_PRESSURE_GRADING_1||0,
                name:'一级高血压人数'
            },{
                value:chartData.HBP_DISTRIBUTION.BLOOD_PRESSURE_GRADING_2||0,
                name:'二级高血压人数'
            },{
                value:chartData.HBP_DISTRIBUTION.BLOOD_PRESSURE_GRADING_3||0,
                name:'三级高血压人数'
            }];

            vm.rightMiddle={
                title : {
                    text: '高血压人群血压级别分布',
                    x:'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '高血压人群',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:dataList,
                        label: {
                            normal: {
                                formatter:function(val){
                                    return val.name+'-'+val.percent+'%';
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }
    }

    function drawRightBottom(chartData,type) {
        if(!vm.showRightBottom.chart){
            return;
        }

        if(type==='diabetes') {
            if(!chartData.DIABETES_FACTORS){
                chartData.DIABETES_FACTORS={};
            }
            vm.rightBottom={
                color: ['#3398DB'],
                title : {
                    text: '相关人群生活状态统计'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['吸烟', '饮酒', '超重', '肥胖', '规律运动'],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'人数',
                        type:'bar',
                        barWidth: '60%',
                        data:[chartData.DIABETES_FACTORS.SMOKING||0,
                            chartData.DIABETES_FACTORS.DRINK||0,
                            chartData.DIABETES_FACTORS.OVERWEIGHT||0,
                            chartData.DIABETES_FACTORS.OBESITY||0,
                            chartData.DIABETES_FACTORS.REGULAR_MOVEMENT||0]
                    }
                ]
            };
        }else{
            if(!chartData.HYPERTENSION_FACTORS){
                chartData.HYPERTENSION_FACTORS={};
            }
            vm.rightBottom={
                color: ['#3398DB'],
                title : {
                    text: '高血压因素统计情况'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['吸烟', '饮酒', '超重', '肥胖', '低盐饮食'],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'人数',
                        type:'bar',
                        barWidth: '60%',
                        data:[chartData.HYPERTENSION_FACTORS.SMOKING||0,
                            chartData.HYPERTENSION_FACTORS.DRINK||0,
                            chartData.HYPERTENSION_FACTORS.OVERWEIGHT||0,
                            chartData.HYPERTENSION_FACTORS.OBESITY||0,
                            chartData.HYPERTENSION_FACTORS.LOW_SALT_DIET||0]
                    }
                ]
            };
        }
    }
    keyPopulationReportService.getSysDate('', function (response) {
        $rootScope.handleMessage(response, function (data) {
            vm.nowYear=new Date(data).getFullYear()+'';
            vm.nowMonth=new Date(data).getMonth()+1;
            for(var i=2015;i<=vm.nowYear;i++){
                vm.years.push(i);
            }
            vm.resetChart();
            vm.resetChart();
        }, function () {
            $rootScope.alertDialog("获取服务器时间失败");
            vm.nowYear=new Date().getFullYear()+'';
            vm.nowMonth=new Date().getMonth()+1;
            for(var i=2015;i<=vm.nowYear;i++){
                vm.years.push(i);
            }
        });
    },function () {
        $rootScope.alertDialog("获取服务器时间失败");
        vm.nowYear=new Date().getFullYear()+'';
        vm.nowMonth=new Date().getMonth()+1;
        for(var i=2015;i<=vm.nowYear;i++){
            vm.years.push(i);
        }
    });
    return vm;
}
"use strict";
APP.SERVICES.service('keyPopulationReportService', keyPopulationReportService);
keyPopulationReportService.$inject = ['Report','bootstrapTable','$rootScope'];
function keyPopulationReportService(Report,bootstrapTable,$rootScope) {
    var vm = this;

    vm.getAllDiabetesData = function (param, successFunction, failedFunction) {
        Report.getAllDiabetesData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getGlucoseAndWarningData = function (param, successFunction, failedFunction) {
        Report.getGlucoseAndWarningData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getHBPGlucoseAndWarningData = function (param, successFunction, failedFunction) {
        Report.getHBPGlucoseAndWarningData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getPerMonthDiabetesData = function (param, successFunction, failedFunction) {
        Report.getPerMonthDiabetesData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getAllHypertensionData = function (param, successFunction, failedFunction) {
        Report.getAllHypertensionData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getSysDate = function (param, successFunction, failedFunction) {
        Report.getSysDate(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getPerMonthHypertensionData = function (param, successFunction, failedFunction) {
        Report.getPerMonthHypertensionData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getMoreGlucoseAndWarningData = function (param, successFunction, failedFunction) {
        Report.getMoreGlucoseAndWarningData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getMoreHBPGlucoseAndWarningData = function (param, successFunction, failedFunction) {
        Report.getMoreHBPGlucoseAndWarningData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getMoreODPDistributionData = function (param, successFunction, failedFunction) {
        Report.getMoreODPDistributionData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };

    vm.getMoreOHPDistributionData = function (param, successFunction, failedFunction) {
        Report.getMoreOHPDistributionData(JSON.stringify(param)).$promise
            .then(successFunction, failedFunction);
    };
    
    vm.getPageGlucoseAndWarningData = function ($vm, listPara) {
        var list = {
            dataFunction: getDataList,
            dataParams: listPara,
            columns: [{
                field: 'ORGANIZATION_NAME',
                title: '机构名称',
                align: 'center'
            }, {
                field: 'STABLE_COUNT',
                title: '血糖稳定人数',
                align: 'center'
            }, {
                field: 'UNSTABLE_COUNT',
                title: '血糖预警人数',
                align: 'center'
            }, {
                field: 'DIABETES_PERSENT',
                title: '预警比例',
                align: 'center',
                sortable:true,
                formatter:function (value,row) {
                    if(row.STABLE_COUNT===0 && row.UNSTABLE_COUNT===0){
                        return '-';
                    }
                    return (row.UNSTABLE_COUNT*100/(row.STABLE_COUNT+row.UNSTABLE_COUNT)).toFixed(2)+'%';
                }
            }]
        };

        function getDataList(param, successFunction, failedFunction) {
            Report.getPageGlucoseAndWarningData(JSON.stringify(param)).$promise
                .then(function (res) {
                    $rootScope.handleMessage(res, function () {
                        successFunction(res.value || {total: 0, rows: []});
                    }, function () {
                        $rootScope.alertDialog("获取列表信息失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                    failedFunction();
                });
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
    };

    vm.getPageHBPGlucoseAndWarningData = function ($vm, listPara) {
        var list = {
            dataFunction: getDataList,
            dataParams: listPara,
            columns: [{
                field: 'ORGANIZATION_NAME',
                title: '机构名称',
                align: 'center'
            }, {
                field: 'STABLE_COUNT',
                title: '血压稳定人数',
                align: 'center'
            }, {
                field: 'UNSTABLE_COUNT',
                title: '血压预警人数',
                align: 'center'
            }, {
                field: 'HYPERTENSION_PERSENT',
                title: '预警比例',
                align: 'center',
                sortable:true,
                formatter:function (value,row) {
                    if(row.STABLE_COUNT===0 && row.UNSTABLE_COUNT===0){
                        return '-';
                    }
                    return (row.UNSTABLE_COUNT*100/(row.STABLE_COUNT+row.UNSTABLE_COUNT)).toFixed(2)+'%';
                }
            }]
        };

        function getDataList(param, successFunction, failedFunction) {
            Report.getPageHBPGlucoseAndWarningData(JSON.stringify(param)).$promise
                .then(function (res) {
                    $rootScope.handleMessage(res, function () {
                        successFunction(res.value || {total: 0, rows: []});
                    }, function () {
                        $rootScope.alertDialog("获取列表信息失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                    failedFunction();
                });
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
    };

    vm.getPageODPDistributionData=function ($vm, listPara) {
        var list = {
            dataFunction: getDataList,
            dataParams: listPara,
            columns: [{
                field: 'ORGANIZATION_NAME',
                title: '机构名称',
                align: 'center'
            }, {
                field: 'SUB_DIABETES_TOTAL',
                title: '糖尿病人群数',
                align: 'center'
            }, {
                field: 'DIABETES_PERSENT',
                title: '所占比例',
                align: 'center',
                sortable:true,
                formatter:function (value) {
                    if(value){
                        return value+'%';
                    }
                    return "-";
                }
            }]
        };

        function getDataList(param, successFunction, failedFunction) {
            Report.getPageODPDistributionData(JSON.stringify(param)).$promise
                .then(function (res) {
                    $rootScope.handleMessage(res, function () {
                        successFunction(res.value || {total: 0, rows: []});
                    }, function () {
                        $rootScope.alertDialog("获取列表信息失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                    failedFunction();
                });
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
    };

    vm.getPageOHPDistributionData=function ($vm, listPara) {
        var list = {
            dataFunction: getDataList,
            dataParams: listPara,
            columns: [{
                field: 'ORGANIZATION_NAME',
                title: '机构名称',
                align: 'center'
            }, {
                field: 'SUB_HYPERTENSION_TOTAL',
                title: '高血压人群数',
                align: 'center'
            }, {
                field: 'HYPERTENSION_PERSENT',
                title: '所占比例',
                align: 'center',
                sortable:true,
                formatter:function (value) {
                    if(value){
                        return value+'%';
                    }
                    return "-";
                }
            }]
        };

        function getDataList(param, successFunction, failedFunction) {
            Report.getPageOHPDistributionData(JSON.stringify(param)).$promise
                .then(function (res) {
                    $rootScope.handleMessage(res, function () {
                        successFunction(res.value || {total: 0, rows: []});
                    }, function () {
                        $rootScope.alertDialog("获取列表信息失败");
                    });
                }, function () {
                    $rootScope.alertDialog("获取列表信息失败");
                    failedFunction();
                });
        }

        $vm.tableData = {
            bsTableControl: {
                options: bootstrapTable.initOption(list)
            }
        };
    };

    return vm;
}