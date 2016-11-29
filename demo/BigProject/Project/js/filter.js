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