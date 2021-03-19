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
var lodash_1 = require("lodash");
var RequestSubscriber_1 = __importDefault(require("../RequestSubscriber"));
var uuid_1 = require("uuid");
var operators_1 = require("rxjs/operators");
var Results_1 = require("../utils/Results");
var SingleObservable = /** @class */ (function (_super) {
    __extends(SingleObservable, _super);
    function SingleObservable() {
        var _this = _super.call(this, function (observer) {
            observer.add(_this.state$
                .pipe(operators_1.distinctUntilKeyChanged("status"))
                .subscribe(_this.stateListener(observer)));
            observer.add(_this.initialState$
                .pipe(operators_1.distinctUntilKeyChanged("status"))
                .subscribe(_this.initialStateListener));
            _this.initialState$.next(_this.getInitialState());
            observer.add(_this.singleRxObservableConfig
                .pipe(operators_1.distinctUntilChanged())
                .subscribe(_this.singleRxObservableConfigListener(observer)));
        }) || this;
        _this.config = new rxjs_1.BehaviorSubject({});
        _this.singleRxObservableConfig = new rxjs_1.BehaviorSubject({});
        _this.initialState$ = new rxjs_1.BehaviorSubject({});
        _this.state$ = new rxjs_1.BehaviorSubject({});
        _this.getInitialState = function () {
            var config = _this.config.getValue();
            return new Results_1.IdleRequest(config.requestId, config);
        };
        _this.initialStateListener = function (initialState) { return _this.state$.next(initialState); };
        _this.stateListener = function (observer) { return function (state) {
            if (_this.onSuccess) {
                if (state.status === "success") {
                    _this.onSuccess(state);
                }
            }
            if (_this.onError) {
                if (state.status === "error") {
                    _this.onError(state);
                }
            }
            observer.next(state);
        }; };
        _this.singleRxObservableConfigListener = function (observer) { return function (singleRxObservableConfig) {
            var fetchOnMount = singleRxObservableConfig.fetchOnMount, refetchInterval = singleRxObservableConfig.refetchInterval;
            if (fetchOnMount && !refetchInterval) {
                _this.fetch();
            }
            if (!fetchOnMount && refetchInterval) {
                observer.add(rxjs_1.interval(refetchInterval)
                    .pipe(operators_1.startWith(0), operators_1.takeWhile(function () { return _this.state$.getValue().status !== "loading"; }))
                    .subscribe(function () { return _this.fetch(); }));
            }
        }; };
        _this.configure = function (_a) {
            var method = _a.method, url = _a.url, body = _a.body, params = _a.params, refetchInterval = _a.refetchInterval, fetchOnMount = _a.fetchOnMount, fetchOnUpdateConfig = _a.fetchOnUpdateConfig, onSuccess = _a.onSuccess, onError = _a.onError;
            if (method && url) {
                _this.config.next({ method: method, url: url, body: body, params: params, requestId: uuid_1.v4() });
            }
            if (onSuccess) {
                _this.onSuccess = lodash_1.memoize(onSuccess);
            }
            if (onError) {
                _this.onError = lodash_1.memoize(onError);
            }
            _this.singleRxObservableConfig.next({
                refetchInterval: refetchInterval,
                fetchOnMount: fetchOnMount,
                fetchOnUpdateConfig: fetchOnUpdateConfig
            });
        };
        _this.fetch = function (_config) {
            if (_config) {
                return _this.config
                    .pipe(operators_1.map(function (config) {
                    var state = _this.state$.getValue();
                    return new rxjs_1.Observable(function (observer) {
                        return new RequestSubscriber_1["default"](observer, __assign(__assign({}, config), _config), state);
                    });
                }), operators_1.mergeMap(function (v) { return v; }), operators_1.distinctUntilKeyChanged("status"))
                    .forEach(function (result) {
                    _this.state$.next(result);
                });
            }
            return _this.config
                .pipe(operators_1.map(function (config) {
                var state = _this.state$.getValue();
                return new rxjs_1.Observable(function (observer) {
                    return new RequestSubscriber_1["default"](observer, config, state);
                });
            }), operators_1.mergeMap(function (v) { return v; }), operators_1.distinctUntilKeyChanged("status"))
                .forEach(function (result) {
                _this.state$.next(result);
            });
        };
        // bindings
        _this.configure = _this.configure.bind(_this);
        _this.singleRxObservableConfigListener = _this.singleRxObservableConfigListener.bind(_this);
        _this.getInitialState = _this.getInitialState.bind(_this);
        _this.initialStateListener = _this.initialStateListener.bind(_this);
        _this.stateListener = _this.stateListener.bind(_this);
        _this.fetch = _this.fetch.bind(_this);
        return _this;
    }
    return SingleObservable;
}(rxjs_1.Observable));
exports["default"] = SingleObservable;
