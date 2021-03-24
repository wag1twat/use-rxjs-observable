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
var reduce_1 = __importDefault(require("lodash/reduce"));
var values_1 = __importDefault(require("lodash/values"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var equalObjects_1 = require("../utils/equalObjects");
var Results_1 = require("../utils/Results");
var RxRequestsOptions = /** @class */ (function (_super) {
    __extends(RxRequestsOptions, _super);
    function RxRequestsOptions(value) {
        var _this = _super.call(this, value) || this;
        _this.state$ = new rxjs_1.BehaviorSubject({});
        _this.fetch = function () {
            var configs = _this.getValue().configs;
            if (configs) {
                rxjs_1.from(configs)
                    .pipe(operators_1.mergeMap(function (v) { return rxjs_1.of(v); }), operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }), operators_1.mergeMap(function (axiosConfig) {
                    return rxjs_1.from(axios_1["default"]
                        .request(axiosConfig)
                        .then(function (response) {
                        return new Results_1.Success(axiosConfig.requestId, response);
                    })["catch"](function (error) {
                        return new Results_1.Error(axiosConfig.requestId, error);
                    })).pipe(operators_1.startWith(new Results_1.Loading(axiosConfig.requestId)), operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }));
                }), operators_1.mergeScan(function (acc, current) {
                    var _a, _b;
                    var _c, _d, _e, _f;
                    if (current.status === "loading") {
                        var response = ((_c = _this.state$.value[current.requestId]) === null || _c === void 0 ? void 0 : _c.response) ? (_d = _this.state$.value[current.requestId]) === null || _d === void 0 ? void 0 : _d.response : null;
                        var error = ((_e = _this.state$.value[current.requestId]) === null || _e === void 0 ? void 0 : _e.error) ? (_f = _this.state$.value[current.requestId]) === null || _f === void 0 ? void 0 : _f.error : null;
                        return rxjs_1.of(__assign(__assign({}, acc), (_a = {}, _a[current.requestId] = __assign(__assign({}, current), { response: response,
                            error: error }), _a))).pipe(operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }));
                    }
                    return rxjs_1.of(__assign(__assign({}, acc), (_b = {}, _b[current.requestId] = current, _b))).pipe(operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }));
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
                _this.state$.next(reduce_1["default"](options.configs, function (acc, current) {
                    var _a;
                    return (__assign(__assign({}, acc), (_a = {}, _a[current.requestId] = new Results_1.Idle(current.requestId), _a)));
                }, {}));
                var _a = _this.getValue(), fetchOnMount = _a.fetchOnMount, refetchInterval = _a.refetchInterval;
                if (fetchOnMount && !refetchInterval) {
                    _this.fetch();
                }
                if (!fetchOnMount && refetchInterval) {
                    _this.interval$ = rxjs_1.interval(refetchInterval)
                        .pipe(operators_1.startWith(0), operators_1.takeWhile(function () {
                        return values_1["default"](_this.state$.getValue()).every(function (item) { return (item === null || item === void 0 ? void 0 : item.status) && item.status !== "loading"; });
                    }))
                        .subscribe(function () { return _this.fetch(); });
                }
            }
        });
        _this.onResults$ = _this.state$
            .pipe(operators_1.map(function (state) { return values_1["default"](state); }), operators_1.filter(function (state) {
            return state.every(function (item) { return (item === null || item === void 0 ? void 0 : item.status) && item.status !== "idle"; });
        }), operators_1.filter(function (state) {
            return state.every(function (item) { return (item === null || item === void 0 ? void 0 : item.status) && item.status !== "loading"; });
        }), operators_1.concatMap(function (state) {
            return rxjs_1.of({
                successes: reduce_1["default"](state.filter(function (item) { return (item === null || item === void 0 ? void 0 : item.status) && item.status === "success"; }), function (acc, current) {
                    var _a;
                    if (current) {
                        return __assign(__assign({}, acc), (_a = {}, _a[String(current === null || current === void 0 ? void 0 : current.requestId)] = current, _a));
                    }
                    return acc;
                }, {}),
                errors: reduce_1["default"](state.filter(function (item) { return (item === null || item === void 0 ? void 0 : item.status) && item.status === "error"; }), function (acc, current) {
                    var _a;
                    if (current) {
                        return __assign(__assign({}, acc), (_a = {}, _a[String(current === null || current === void 0 ? void 0 : current.requestId)] = current, _a));
                    }
                    return acc;
                }, {})
            });
        }), operators_1.distinctUntilChanged(function (prev, next) { return equalObjects_1.equalObjects(prev, next); }))
            .subscribe(function (state) {
            var onSuccess = _this.getValue().onSuccess;
            var onError = _this.getValue().onError;
            if (onSuccess) {
                onSuccess(state.successes);
            }
            if (onError) {
                onError(state.errors);
            }
        });
        _this.next = _this.next.bind(_this);
        _this.fetch = _this.fetch.bind(_this);
        return _this;
    }
    return RxRequestsOptions;
}(rxjs_1.BehaviorSubject));
exports.RxRequestsOptions = RxRequestsOptions;
