"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.RxRequestsOptions = void 0;
var axios_1 = __importDefault(require("axios"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var equalObjects_1 = require("../utils/equalObjects");
var Results_1 = require("../utils/Results");
var lodash_1 = require("lodash");
var RxRequestsOptions = /** @class */ (function (_super) {
    __extends(RxRequestsOptions, _super);
    function RxRequestsOptions(options) {
        var _this = _super.call(this, options) || this;
        _this.state$ = new rxjs_1.BehaviorSubject({});
        _this.fetch = function () {
            var configs = _this.getValue().configs;
            if (configs) {
                rxjs_1.of(configs)
                    .pipe(operators_1.mergeMap(function (v) { return rxjs_1.pairs(v); }), operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }), operators_1.mergeMap(function (_a) {
                    var _b;
                    var key = _a[0], axiosConfig = _a[1];
                    var state = _this.state$.getValue();
                    return rxjs_1.from(axios_1["default"]
                        .request(axiosConfig)
                        .then(function (response) {
                        var _a;
                        return _a = {}, _a[key] = new Results_1.Success(response), _a;
                    })["catch"](function (error) {
                        var _a;
                        return _a = {}, _a[key] = new Results_1.Error(error), _a;
                    })).pipe(operators_1.startWith((_b = {},
                        _b[key] = __assign(__assign({}, new Results_1.Loading()), { response: state[key].response, error: state[key].error }),
                        _b)), operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }));
                }), operators_1.mergeScan(function (acc, current) {
                    return rxjs_1.of(__assign(__assign({}, acc), current)).pipe(operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }));
                }, _this.state$.getValue()), operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }))
                    .forEach(function (result) {
                    _this.state$.next(result);
                });
            }
        };
        _this.next = function (value) {
            var equal = equalObjects_1.equalObjects(_this.getValue(), value);
            if (!equal) {
                _super.prototype.next.call(_this, value);
            }
        };
        _this.unsubscribe = function () {
            _super.prototype.unsubscribe.call(_this);
            _this.state$.unsubscribe();
            _this.onResults$.unsubscribe();
            if (_this.interval$) {
                _this.interval$.unsubscribe();
            }
        };
        _this.subscribe(function (options) {
            if (options.configs) {
                _this.state$.next(lodash_1.reduce(Object.keys(options.configs), function (acc, current) {
                    var _a;
                    return __assign(__assign({}, acc), (_a = {}, _a[current] = new Results_1.Idle(), _a));
                }, {}));
                var _a = _this.getValue(), fetchOnMount = _a.fetchOnMount, refetchInterval = _a.refetchInterval;
                if (fetchOnMount && !refetchInterval) {
                    _this.fetch();
                }
                if (!fetchOnMount && refetchInterval) {
                    _this.interval$ = rxjs_1.interval(refetchInterval)
                        .pipe(operators_1.startWith(0), operators_1.takeWhile(function () {
                        var entries = Object.values(_this.state$.getValue());
                        return entries.every(function (item) { return (item === null || item === void 0 ? void 0 : item.status) && item.status !== "loading"; });
                    }))
                        .subscribe(function () { return _this.fetch(); });
                }
            }
        });
        _this.onResults$ = _this.state$
            .pipe(operators_1.map(function (v) {
            return Object.entries(v);
        }), operators_1.filter(function (v) {
            return v.every(function (_a) {
                var _ = _a[0], state = _a[1];
                return state.status !== "idle";
            });
        }), operators_1.filter(function (v) {
            return v.every(function (_a) {
                var _ = _a[0], state = _a[1];
                return state.status !== "loading";
            });
        }), operators_1.map(function (v) {
            var successes = v
                .filter(function (_a) {
                var _ = _a[0], state = _a[1];
                return state.status === "success";
            })
                .reduce(function (acc, _a) {
                var _b;
                var key = _a[0], state = _a[1];
                return __assign(__assign({}, acc), (_b = {}, _b[key] = state, _b));
            }, {});
            var errors = v
                .filter(function (_a) {
                var _ = _a[0], state = _a[1];
                return state.status === "error";
            })
                .reduce(function (acc, _a) {
                var _b;
                var key = _a[0], state = _a[1];
                return __assign(__assign({}, acc), (_b = {}, _b[key] = state, _b));
            }, {});
            return { successes: successes, errors: errors };
        }), operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }))
            .subscribe(function (_a) {
            var successes = _a.successes, errors = _a.errors;
            var onSuccess = _this.getValue().onSuccess;
            var onError = _this.getValue().onError;
            if (onSuccess) {
                onSuccess(successes);
            }
            if (onError) {
                onError(errors);
            }
        });
        _this.next = _this.next.bind(_this);
        _this.fetch = _this.fetch.bind(_this);
        return _this;
    }
    return RxRequestsOptions;
}(rxjs_1.BehaviorSubject));
exports.RxRequestsOptions = RxRequestsOptions;
