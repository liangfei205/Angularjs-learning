// JavaScript source code
(function () {
    if (typeof angular === 'undefined') {
        return;
    }
    angular.module('bsTable', [])
        .constant('uiBsTables', {bsTables: {}})
        .directive('bsTableControl', ['uiBsTables', function (uiBsTables) {
            var CONTAINER_SELECTOR = '.bootstrap-table';
            var SCROLLABLE_SELECTOR = '.fixed-table-body';
            var SEARCH_SELECTOR = '.search input';
            var bsTables = uiBsTables.bsTables;

            function isEmptyObject(obj) {
                for (var n in obj) {
                    return false
                }
                return true;
            };

            function getBsTable(el) {
                var result;
                $.each(bsTables, function (id, bsTable) {
                    if (!bsTable.$el.closest(CONTAINER_SELECTOR).has(el).length) return;
                    result = bsTable;
                    return true;
                });
                return result;
            }

            $(window).resize(function () {
                $.each(bsTables, function (id, bsTable) {
                    bsTable.$el.bootstrapTable('resetView');
                });
            });
            function onScroll() {
                var bsTable = this;
                var state = bsTable.$s.bsTableControl.state;
                bsTable.$s.$applyAsync(function () {
                    state.scroll = bsTable.$el.bootstrapTable('getScrollPosition');
                });
            }

            $(document)
                .on('post-header.bs.table', CONTAINER_SELECTOR + ' table', function (evt) { // bootstrap-table calls .off('scroll') in initHeader so reattach here
                    var bsTable = getBsTable(evt.target);
                    if (!bsTable) return;
                    bsTable.$el
                        .closest(CONTAINER_SELECTOR)
                        .find(SCROLLABLE_SELECTOR)
                        .on('scroll', onScroll.bind(bsTable));
                })
                .on('sort.bs.table', CONTAINER_SELECTOR + ' table', function (evt, sortName, sortOrder) {
                    var bsTable = getBsTable(evt.target);
                    if (!bsTable) return;
                    var state = bsTable.$s.bsTableControl.state;
                    var options = bsTable.$s.bsTableControl.options;
                    bsTable.$s.$applyAsync(function () {
                        state.sortName = sortName;
                        state.sortOrder = sortOrder;
                        // bsTable.$s.bsTableControl.options=angular.extend(angular.copy(options), state);
                    });
                })
                .on('page-change.bs.table', CONTAINER_SELECTOR + ' table', function (evt, pageNumber, pageSize) {
                    var bsTable = getBsTable(evt.target);
                    if (!bsTable) return;
                    var state = bsTable.$s.bsTableControl.state;
                    var options = bsTable.$s.bsTableControl.options;
                    bsTable.$s.$applyAsync(function () {
                        state.pageNumber = pageNumber;
                        state.pageSize = pageSize;
                        // bsTable.$s.bsTableControl.options=angular.extend(angular.copy(options), state);
                    });
                })
                .on('search.bs.table', CONTAINER_SELECTOR + ' table', function (evt, searchText) {
                    var bsTable = getBsTable(evt.target);
                    if (!bsTable) return;
                    var state = bsTable.$s.bsTableControl.state;
                    var options = bsTable.$s.bsTableControl.options;
                    bsTable.$s.$applyAsync(function () {
                        state.searchText = searchText;
                        // bsTable.$s.bsTableControl.options=angular.extend(angular.copy(options), state);
                    });
                })
                .on('focus blur', CONTAINER_SELECTOR + ' ' + SEARCH_SELECTOR, function (evt) {
                    var bsTable = getBsTable(evt.target);
                    if (!bsTable) return;
                    var state = bsTable.$s.bsTableControl.state;
                    var options = bsTable.$s.bsTableControl.options;
                    bsTable.$s.$applyAsync(function () {
                        state.searchHasFocus = $(evt.target).is(':focus');
                    });
                });

            return {
                restrict: 'EA',
                scope: {bsTableControl: '='},
                link: function ($s, $el) {
                    var bsTable = bsTables[$s.$id] = {$s: $s, $el: $el};
                    $s.instantiated = false;
                    $s.$watch('bsTableControl.options', function (options) {
                        if (!options) options = $s.bsTableControl.options = {};
                        var state = $s.bsTableControl.state || {};
                        if ($s.instantiated) $el.bootstrapTable('destroy');
                        var optioncopy = angular.copy(options);
                        if (optioncopy.dataFunction && optioncopy.dataParams) {
                            var params = {
                                offset: state.pageNumber ?
                                state.pageSize * (state.pageNumber - 1) : 0,
                                limit: state.pageSize ?
                                    state.pageSize : optioncopy.pageSize,
                                search: state.searchText ? state.searchText : null,
                                sort: state.sortName ? state.sortName : null,
                                order: state.sortOrder ? state.sortOrder : null
                            };
                            params = angular.extend(params, optioncopy.dataParams);
                            var returndata = {rows: [], total: 0};
                            optioncopy.dataFunction(params, function (res) {
                                returndata = res;
                                optioncopy.data = returndata.rows;
                                optioncopy.totalRows = returndata.total;
                                $el.bootstrapTable(optioncopy);
                                $s.instantiated = true;

                                // Update the UI for state that isn't settable via options
                                if ('scroll' in state) $el.bootstrapTable('scrollTo', state.scroll);
                                if ('searchHasFocus' in state) $el.closest(CONTAINER_SELECTOR).find(SEARCH_SELECTOR).focus(); // $el gets detached so have to recompute whole chain
                            }, function () {
                                optioncopy.data = returndata.rows;
                                optioncopy.totalRows = returndata.total;
                                $el.bootstrapTable(optioncopy);
                                $s.instantiated = true;

                                // Update the UI for state that isn't settable via options
                                if ('scroll' in state) $el.bootstrapTable('scrollTo', state.scroll);
                                if ('searchHasFocus' in state) $el.closest(CONTAINER_SELECTOR).find(SEARCH_SELECTOR).focus(); // $el gets detached so have to recompute whole chain
                            });
                        }
                    }, true);
                    $s.$watch('bsTableControl.state', function (state) {
                        if (!state) {
                            state = $s.bsTableControl.state = {};
                            return;
                        } else if (isEmptyObject(state)) {
                            return;
                        }
                        var optioncopy = angular.copy($s.bsTableControl.options);
                        if (optioncopy.dataFunction && optioncopy.dataParams) {
                            $el.parent().find('.fixed-table-loading').show()
                            var params = {
                                offset: state.pageNumber ?
                                state.pageSize * (state.pageNumber - 1) : 0,
                                limit: state.pageSize ?
                                    state.pageSize : optioncopy.pageSize,
                                search: state.searchText ? state.searchText : null,
                                sort: state.sortName ? state.sortName : null,
                                order: state.sortOrder ? state.sortOrder : null
                            };
                            params = angular.extend(params, optioncopy.dataParams);
                            var returndata = {rows: [], total: 0};
                            optioncopy.dataFunction(params, function (res) {
                                returndata = res;
                                $el.bootstrapTable('load', returndata);
                                $el.trigger('directive-updated.bs.table', [state]);
                                $el.parent().find('.fixed-table-loading').hide()
                            }, function () {
                                $el.bootstrapTable('load', returndata);
                                $el.trigger('directive-updated.bs.table', [state]);
                                $el.parent().find('.fixed-table-loading').hide()
                            });
                        }
                    }, true);
                    $s.$watch('bsTableControl.operat', function (operat) {
                        if (!operat) {
                            operat = $s.bsTableControl.operat = '';
                            return;
                        }
                        if (operat === 'refresh') {
                            var optioncopy = angular.copy($s.bsTableControl.options);
                            var state = $s.bsTableControl.state;
                            if (optioncopy.dataFunction && optioncopy.dataParams) {
                                var params = {
                                    offset: state.pageNumber ?
                                    state.pageSize * (state.pageNumber - 1) : 0,
                                    limit: state.pageSize ? state.pageSize : optioncopy.pageSize,
                                    search: state.searchText ? state.searchText : null,
                                    sort: state.sortName ? state.sortName : null,
                                    order: state.sortOrder ? state.sortOrder : null
                                };
                                params = angular.extend(params, optioncopy.dataParams);
                                var returndata = {rows: [], total: 0};
                                optioncopy.dataFunction(params, function (res) {
                                    returndata = res;
                                    if (returndata.rows.length === 0 && state.pageNumber && state.pageNumber !== 1) {
                                        $s.$applyAsync(function () {
                                            state.pageNumber--;
                                            // bsTable.$s.bsTableControl.options=angular.extend(angular.copy(options), state);
                                        });
                                        return;
                                    }
                                    $el.bootstrapTable('load', returndata);
                                }, function () {
                                    if (returndata.rows.length === 0 && state.pageNumber && state.pageNumber !== 1) {
                                        $s.$applyAsync(function () {
                                            state.pageNumber--;
                                            // bsTable.$s.bsTableControl.options=angular.extend(angular.copy(options), state);
                                        });
                                        return;
                                    }
                                    $el.bootstrapTable('load', returndata);
                                });
                            }
                            $s.bsTableControl.operat = '';
                        }else if(operat === 'getSelections'){
                            var data = $el.bootstrapTable('getAllSelections');
                            $s.bsTableControl.operat = '';
                            $s.bsTableControl.getSelectionsBack(data);
                        }
                    }, true);
                    $s.$on('$destroy', function () {
                        delete bsTables[$s.$id];
                    });
                }
            };
        }])
})();
