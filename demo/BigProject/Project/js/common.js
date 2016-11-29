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