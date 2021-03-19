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
var rxjs_1 = require("rxjs");
var RequestSubscriber_1 = __importDefault(require("../RequestSubscriber"));
var lodash_1 = require("lodash");
var uuid_1 = require("uuid");
var operators_1 = require("rxjs/operators");
var equals_1 = require("../utils/equals");
var Results_1 = require("../utils/Results");
var MultiObservable = /** @class */ (function (_super) {
    __extends(MultiObservable, _super);
    function MultiObservable() {
        var _this = _super.call(this, function (observer) {
            observer.add(_this.state$.subscribe(_this.stateListener(observer)));
            observer.add(_this.initialState$.subscribe(_this.initialStateListener));
            _this.initialState$.next(_this.getInitialState());
            observer.add(_this.state$
                .pipe(operators_1.map(function (state) { return lodash_1.values(state); }), operators_1.filter(function (state) { return state.every(function (_a) {
                var status = _a.status;
                return status !== "idle";
            }); }), operators_1.filter(function (state) {
                return state.every(function (_a) {
                    var status = _a.status;
                    return status !== "loading";
                });
            }), operators_1.concatMap(function (state) {
                var successes = state.filter(function (_a) {
                    var status = _a.status;
                    return status === "success";
                });
                var errors = state.filter(function (_a) {
                    var status = _a.status;
                    return status === "error";
                });
                return rxjs_1.of({ successes: successes, errors: errors });
            }), operators_1.distinctUntilChanged())
                .subscribe(function (_a) {
                var successes = _a.successes, errors = _a.errors;
                if (_this.onSuccess) {
                    if (successes.length) {
                        _this.onSuccess(successes);
                    }
                }
                if (_this.onError) {
                    if (errors.length) {
                        _this.onError(errors);
                    }
                }
            }));
            observer.add(_this.multiRxObservableConfig.subscribe(_this.multiRxObservableConfigListener(observer)));
            observer.add(rxjs_1.from(_this.configs)
                .pipe(operators_1.takeWhile(function () {
                return Boolean(_this.multiRxObservableConfig.getValue().fetchOnUpdateConfigs);
            }))
                .subscribe(function () { return _this.fetch(); }));
        }) || this;
        _this.configs = [];
        _this.multiRxObservableConfig = new rxjs_1.BehaviorSubject({});
        _this.initialState$ = new rxjs_1.BehaviorSubject({});
        _this.state$ = new rxjs_1.BehaviorSubject({});
        _this.getInitialState = function () {
            return lodash_1.reduce(_this.configs, function (acc, mutableRequestConfig) {
                var _a;
                return __assign(__assign({}, acc), (_a = {}, _a[mutableRequestConfig.requestId] = new Results_1.IdleRequest(mutableRequestConfig.requestId, mutableRequestConfig), _a));
            }, {});
        };
        _this.initialStateListener = function (initialState) { return _this.state$.next(initialState); };
        _this.stateListener = function (observer) { return function (state) { return observer.next(lodash_1.values(state)); }; };
        _this.multiRxObservableConfigListener = function (observer) { return function (multiRxObservableConfig) {
            var fetchOnMount = multiRxObservableConfig.fetchOnMount, refetchInterval = multiRxObservableConfig.refetchInterval;
            if (fetchOnMount && !refetchInterval) {
                _this.fetch();
            }
            if (!fetchOnMount && refetchInterval) {
                observer.add(rxjs_1.interval(refetchInterval)
                    .pipe(operators_1.startWith(0), operators_1.takeWhile(function () {
                    return lodash_1.values(_this.state$.getValue()).every(function (result) { return result.status !== "loading"; });
                }))
                    .subscribe(function () { return _this.fetch(); }));
            }
        }; };
        _this.configure = function (_a) {
            var configs = _a.configs, refetchInterval = _a.refetchInterval, fetchOnUpdateConfigs = _a.fetchOnUpdateConfigs, fetchOnMount = _a.fetchOnMount, onSuccess = _a.onSuccess, onError = _a.onError;
            if (configs) {
                _this.configs = lodash_1.map(configs, function (config) { return (__assign(__assign({}, config), { requestId: uuid_1.v4() + "-xhr-id" })); });
            }
            if (onSuccess) {
                _this.onSuccess = lodash_1.memoize(onSuccess);
            }
            if (onError) {
                _this.onError = lodash_1.memoize(onError);
            }
            _this.multiRxObservableConfig.next({
                refetchInterval: refetchInterval,
                fetchOnMount: fetchOnMount,
                fetchOnUpdateConfigs: fetchOnUpdateConfigs
            });
        };
        _this.fetch = function () {
            rxjs_1.from(_this.configs)
                .pipe(operators_1.map(function (config) {
                var state = _this.state$.getValue()[config.requestId];
                return new rxjs_1.Observable(function (observer) {
                    return new RequestSubscriber_1["default"](observer, __assign(__assign({}, config), { body: { uuid: uuid_1.v4(), body: { uuid: uuid_1.v4() } }, params: { uuid: uuid_1.v4(), params: { uuid: uuid_1.v4() } } }), state);
                });
            }), operators_1.mergeMap(function (observable) { return observable; }), operators_1.scan(function (acc, requestResult) {
                var _a;
                return __assign(__assign({}, acc), (_a = {}, _a[requestResult.requestId] = requestResult, _a));
            }, _this.state$.getValue()), operators_1.map(function (v) { return lodash_1.values(v); }), operators_1.pairwise(), operators_1.filter(function (_a) {
                var prev = _a[0], next = _a[1];
                return !equals_1.arraysOfObjectsEqual(prev, next);
            }), operators_1.map(function (_a) {
                var _ = _a[0], next = _a[1];
                return next;
            }), operators_1.map(function (result) {
                return lodash_1.reduce(result, function (acc, current) {
                    var _a;
                    return __assign(__assign({}, acc), (_a = {}, _a[current.requestId] = current, _a));
                }, {});
            }))
                .forEach(function (result) { return _this.state$.next(result); });
        };
        _this.configure = _this.configure.bind(_this);
        _this.multiRxObservableConfigListener = _this.multiRxObservableConfigListener.bind(_this);
        _this.getInitialState = _this.getInitialState.bind(_this);
        _this.initialStateListener = _this.initialStateListener.bind(_this);
        _this.stateListener = _this.stateListener.bind(_this);
        _this.fetch = _this.fetch.bind(_this);
        return _this;
    }
    return MultiObservable;
}(rxjs_1.Observable));
exports["default"] = MultiObservable;
