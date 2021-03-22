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
var equalObjects_1 = require("../utils/equalObjects");
var RequestSubscriber_1 = __importDefault(require("../RequestSubscriber"));
var uuid_1 = require("uuid");
var operators_1 = require("rxjs/operators");
var Results_1 = require("../utils/Results");
var RxRequest = /** @class */ (function (_super) {
    __extends(RxRequest, _super);
    function RxRequest() {
        var _this = _super.call(this, function (observer) {
            observer.add(_this.optionsListener(observer));
            observer.add(_this.stateListener(observer));
            observer.add(_this.initialStateListener());
            _this.initialState$.next(_this.getInitialState());
        }) || this;
        _this.options$ = new rxjs_1.BehaviorSubject({});
        _this.requestId$ = new rxjs_1.BehaviorSubject(uuid_1.v4());
        _this.initialState$ = new rxjs_1.BehaviorSubject({});
        _this.state$ = new rxjs_1.BehaviorSubject({});
        _this.getInitialState = function () {
            var _a = _this.options$.getValue(), method = _a.method, url = _a.url, body = _a.body, params = _a.params;
            return new Results_1.IdleRxRequest(_this.requestId$.getValue(), {
                method: method,
                url: url,
                body: body,
                params: params
            });
        };
        _this.initialStateListener = function () {
            return _this.initialState$
                .pipe(operators_1.distinctUntilKeyChanged("status"))
                .subscribe(function (initialState) { return _this.state$.next(initialState); });
        };
        _this.stateListener = function (observer) {
            var onSuccess = _this.options$.getValue().onSuccess;
            var onError = _this.options$.getValue().onError;
            return _this.state$
                .pipe(operators_1.distinctUntilKeyChanged("status"))
                .subscribe(function (state) {
                if (onSuccess) {
                    if (state.status === "success") {
                        onSuccess(state);
                    }
                }
                if (onError) {
                    if (state.status === "error") {
                        onError(state);
                    }
                }
                observer.next(state);
            });
        };
        _this.optionsListener = function (observer) {
            return _this.options$
                .pipe(operators_1.distinctUntilChanged())
                .subscribe(function (_a) {
                var fetchOnMount = _a.fetchOnMount, refetchInterval = _a.refetchInterval;
                if (fetchOnMount && !refetchInterval) {
                    _this.fetch();
                }
                if (!fetchOnMount && refetchInterval) {
                    observer.add(rxjs_1.interval(refetchInterval)
                        .pipe(operators_1.startWith(0), operators_1.takeWhile(function () { return _this.state$.getValue().status !== "loading"; }))
                        .subscribe(function () { return _this.fetch(); }));
                }
            });
        };
        _this.configure = function (options) {
            var equal = equalObjects_1.equalObjects(_this.options$.getValue(), options);
            if (!equal) {
                _this.options$.next(options);
            }
        };
        _this.fetch = function (config) {
            if (config) {
                return _this.options$
                    .pipe(operators_1.map(function (_a) {
                    var method = _a.method, url = _a.url, body = _a.body, params = _a.params;
                    var state = _this.state$.getValue();
                    return new rxjs_1.Observable(function (observer) {
                        return new RequestSubscriber_1["default"](observer, __assign({ method: method,
                            url: url,
                            body: body,
                            params: params, requestId: _this.requestId$.getValue() }, config), state);
                    });
                }), operators_1.mergeMap(function (v) { return v; }), operators_1.distinctUntilKeyChanged("status"))
                    .forEach(function (result) {
                    _this.state$.next(result);
                });
            }
            return _this.options$
                .pipe(operators_1.map(function (_a) {
                var method = _a.method, url = _a.url, body = _a.body, params = _a.params;
                var state = _this.state$.getValue();
                return new rxjs_1.Observable(function (observer) {
                    return new RequestSubscriber_1["default"](observer, {
                        method: method,
                        url: url,
                        body: body,
                        params: params,
                        requestId: _this.requestId$.getValue()
                    }, state);
                });
            }), operators_1.mergeMap(function (v) { return v; }), operators_1.distinctUntilKeyChanged("status"))
                .forEach(function (result) {
                _this.state$.next(result);
            });
        };
        _this.configure = _this.configure.bind(_this);
        _this.optionsListener = _this.optionsListener.bind(_this);
        _this.getInitialState = _this.getInitialState.bind(_this);
        _this.initialStateListener = _this.initialStateListener.bind(_this);
        _this.stateListener = _this.stateListener.bind(_this);
        _this.fetch = _this.fetch.bind(_this);
        return _this;
    }
    return RxRequest;
}(rxjs_1.Observable));
exports["default"] = RxRequest;
