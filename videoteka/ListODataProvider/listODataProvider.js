var sffw;
(function (sffw) {
    var ColumnFilter = /** @class */ (function () {
        function ColumnFilter(name, type, val, datetimeFrom, datetimeTo) {
            this.columnName = name;
            this.dataType = type;
            this.value = val;
            this.from = datetimeFrom;
            this.to = datetimeTo;
        }
        return ColumnFilter;
    }());
    sffw.ColumnFilter = ColumnFilter;
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var ListODataProvider = /** @class */ (function () {
        function ListODataProvider(LightContext, capitalizeFirst, dc, args) {
            var _this = this;
            this.currentPageSize = ko.observable(20);
            this.SetFilterModel = function (filterModelArray) {
                _this.filterModel = filterModelArray;
            };
            this.CreateFilter = function (filterColumns) {
                var oDataParams = [];
                var oDataFilter = [];
                // filtering
                _.each(filterColumns, function (col) {
                    var filterText = col.value;
                    var from = col.from;
                    var to = col.to;
                    if (filterText && filterText.length > 0 || ((from && from.length > 0) || (to && to.length > 0))) {
                        var columnName_1 = col.columnName;
                        switch (col.dataType) {
                            case 'string':
                                oDataFilter.push("startswith(" + columnName_1 + ", '" + filterText.trim() + "')");
                                break;
                            case 'integer':
                                oDataFilter.push(columnName_1 + " eq " + filterText);
                                break;
                            case 'decimal':
                                // 'm' as suffix means OData decimal; if it should be double, it would be 'd'
                                oDataFilter.push(columnName_1 + " eq " + filterText + "m");
                                break;
                            case 'date':
                                if (from && from.length > 0) {
                                    oDataFilter.push("(" + columnName_1 + " ge datetime'" + from + "')");
                                }
                                if (to && to.length > 0) {
                                    oDataFilter.push("(" + columnName_1 + " le datetime'" + to + "')");
                                }
                                break;
                            case 'bool':
                                oDataFilter.push(columnName_1 + " eq " + filterText);
                                break;
                            case 'enum':
                                {
                                    var filterArray_1 = [];
                                    _.forEach(col.value, function (colValue) {
                                        filterArray_1.push("startswith(" + columnName_1 + ", '" + colValue + "')");
                                    });
                                    oDataFilter.push("( " + filterArray_1.join(' or ') + " )");
                                    break;
                                }
                            case 'enum-integer':
                                {
                                    var filterArray_2 = [];
                                    _.forEach(col.value, function (colValue) {
                                        var numValue = +colValue;
                                        if (!isNaN(numValue)) {
                                            filterArray_2.push(columnName_1 + " eq " + numValue);
                                        }
                                    });
                                    oDataFilter.push("( " + filterArray_2.join(' or ') + " )");
                                    break;
                                }
                            default:
                                break;
                        }
                    }
                });
                if (oDataFilter.length > 0) {
                    return oDataFilter;
                }
                else {
                    return null;
                }
            };
            this.SetPage = function (page) {
                if (page != null && typeof page !== 'undefined') {
                    _this.currentPage = page;
                }
            };
            this.SetPageSize = function (args) {
                if (args != null && typeof args !== 'undefined') {
                    if (args.newPageSize !== null && typeof args.newPageSize !== 'undefined') {
                        _this.currentPageSize(args.newPageSize);
                    }
                    else {
                        _this.currentPageSize(args);
                    }
                }
            };
            this.SetCurrentPageAt = function (newPage) {
                if (newPage != null && typeof newPage !== 'undefined') {
                    _this.currentPageSize = newPage;
                }
            };
            this.SetAdditionalFilter = function (additionalFilter) {
                if (typeof additionalFilter !== 'undefined') {
                    _this.additionalODatafilter = additionalFilter;
                }
            };
            this.SetDatasetColumns = function (column) {
                if (column.columnName === undefined) {
                    _this.columns.push(column);
                }
                else {
                    _this.columns.push(column.columnName);
                }
            };
            this.SetDataFilter = function (filter) {
                _this.additionalODatafilter = filter;
            };
            this.SetGroupBy = function (args) {
                if (args.orderBy !== '' && args.orderBy !== null) {
                    _this.orderBy = args.orderBy;
                }
                if (args.descending) {
                    _this.descending = 'desc';
                }
                else {
                    _this.descending = 'asc';
                }
            };
            this.SetOrderBy = function (orderBy, descending) {
                if (orderBy !== '' && orderBy !== null) {
                    _this.orderBy = orderBy;
                }
                if (descending) {
                    _this.descending = 'desc';
                }
                else {
                    _this.descending = 'asc';
                }
            };
            this.SetPageMaxAtt = function (maxPage) {
                _this.maxPage = maxPage;
            };
            this.SetRecordsCountAtt = function (recordCount) {
                _this.currentRecountCount = recordCount;
            };
            if (args.server) {
                if (args.server.IsGlobal) {
                    this.serverConnection = dc.$globals.$api[args.server.Reference];
                }
                else {
                    this.serverConnection = dc.$api[args.server.Reference];
                }
                sffw.assert(this.serverConnection, 'Failed to find ServerConnection');
            }
            if (args.dataCollectionReference) {
                this.dataStoreCollection = dc.$dataContext[args.dataCollectionReference];
            }
            if (args.recordsCountReference) {
                this.recordsCount = dc.$dataContext[args.recordsCountReference];
            }
            this.groupBy = '';
            this.descending = 'desc';
            this.declistName = args.datasetName;
            this.currentPageSize.subscribe(function (newVal) {
                _this.LoadData();
            });
            this.currentPage = 1;
            this.columns = [];
        }
        ListODataProvider.prototype.LoadData = function () {
            var _this = this;
            var baseUrl = (this.serverConnection.listsUrl || '') + this.declistName;
            var oDataParams = [];
            var oDataFilter = [];
            // columns
            if (typeof this.columns !== 'undefined' && this.columns != null) {
                oDataParams.push('$select=' + this.columns.join(','));
            }
            // paging
            oDataParams.push('$top=' + this.currentPageSize() + '');
            if (this.currentPage > 1) {
                oDataParams.push('$skip=' + (this.currentPageSize() * (this.currentPage - 1)));
            }
            oDataParams.push('$inlinecount=allpages');
            // sorting
            if (this.orderBy) {
                var orderByParam = '$orderby=' + this.orderBy;
                orderByParam += ' ' + this.descending;
                oDataParams.push(orderByParam);
            }
            oDataFilter = this.CreateFilter(this.filterModel);
            if (oDataFilter == null) {
                oDataFilter = [];
            }
            if (this.additionalODatafilter) {
                var additionalFilterStr = ko.unwrap(this.additionalODatafilter);
                if (additionalFilterStr && additionalFilterStr.length > 0) {
                    oDataFilter.push(additionalFilterStr);
                }
            }
            if (oDataFilter != null && oDataFilter.length > 0) {
                oDataParams.push('$filter=' + oDataFilter.join(' and '));
            }
            return this.serverConnection.sendRequest(baseUrl + '?' + oDataParams.join('&'))
                .then(function (response) {
                if (response.isError()) {
                    throw new Error(response.getErrorMessage());
                }
                else {
                    var result = JSON.parse(response.getJsonString());
                    var countStr = result['odata.count'];
                    if (!_.isUndefined(countStr)) {
                        var count_1 = Number(countStr);
                        if (_.isArray(result.value) && _.isFinite(count_1)) {
                            _this.dataRecords = result.value;
                            return _this.dataStoreCollection.$fromJson(_this.dataRecords).then(function () {
                                _this.currentRecountCount = count_1;
                                return _this.recordsCount.$setValueAsync(_this.currentRecountCount)
                                    .then(function () { return _this.currentRecountCount; });
                            });
                        }
                    }
                    throw new Error('Failed to load decList ' + _this.declistName);
                }
            });
        };
        return ListODataProvider;
    }());
    sffw.ListODataProvider = ListODataProvider;
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define(['runtime/data/LightContext', 'runtime/runtime.utils'], function (LightContext, utils) {
        return function (dc, args) {
            return new sffw.ListODataProvider(LightContext.default, utils.capitalizeFirst, dc, args);
        };
    });
}
var sffw;
(function (sffw) {
    function assert(condition, message) {
        if (!condition) {
            if (message) {
                console.error('Assertion failed: ' + message);
            }
            else {
                console.error('Assertion failed');
            }
        }
    }
    sffw.assert = assert;
})(sffw || (sffw = {}));
