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
                    url: ENV.urlBase + "/getSysDate.json",
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
                    url: ENV.urlBase + "/statisticsReport/getAllDiabetesData.json",
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
                    url: ENV.urlBase + "/getSysDate.json",
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