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