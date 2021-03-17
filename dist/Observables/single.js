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
var uuid_1 = require("uuid");
var operators_1 = require("rxjs/operators");
var Results_1 = require("../utils/Results");
var SingleObservable = /** @class */ (function (_super) {
    __extends(SingleObservable, _super);
    function SingleObservable() {
        var _this = _super.call(this, function (observer) {
            observer.add(_this.state$.subscribe(_this.stateListener(observer)));
            observer.add(_this.initialState$.subscribe(_this.initialStateListener));
            _this.initialState$.next(_this.getInitialState());
            observer.add(_this.subscriberConfig.subscribe(_this.subscriberConfigListener(observer)));
        }) || this;
        // @ts-ignore //TODO: thinking for typing
        _this.config = new rxjs_1.BehaviorSubject({});
        _this.subscriberConfig = new rxjs_1.BehaviorSubject({});
        // @ts-ignore //TODO: thinking for typing
        _this.initialState$ = new rxjs_1.BehaviorSubject({});
        // @ts-ignore //TODO: thinking for typing
        _this.state$ = new rxjs_1.BehaviorSubject({});
        _this.getInitialState = function () {
            var config = _this.config.getValue();
            return new Results_1.IdleRequest(config.requestId, config);
        };
        _this.initialStateListener = function (initialState) {
            return _this.state$.next(initialState);
        };
        _this.stateListener = function (observer) { return function (state) { return observer.next(state); }; };
        _this.subscriberConfigListener = function (observer) { return function (subscriberConfig) {
            var fetchOnMount = subscriberConfig.fetchOnMount, refetchInterval = subscriberConfig.refetchInterval;
            if (fetchOnMount && !refetchInterval) {
                _this.fetch();
            }
            if (!fetchOnMount && refetchInterval) {
                observer.add(rxjs_1.interval(refetchInterval)
                    .pipe(operators_1.startWith(0), operators_1.takeWhile(function () { return _this.state$.getValue().status !== "loading"; }))
                    .subscribe(function () { return _this.fetch(); }));
            }
        }; };
        _this.configure = function (config, subscriberConfig) {
            _this.config.next(__assign(__assign({}, config), { requestId: uuid_1.v4() }));
            _this.subscriberConfig.next(subscriberConfig);
            var self = _this;
            return self;
        };
        _this.fetch = function (_config) {
            var self = _this;
            if (_config) {
                return _this.config
                    .pipe(operators_1.map(function (config) {
                    var state = self.state$.getValue();
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
                var state = self.state$.getValue();
                return new rxjs_1.Observable(function (observer) {
                    return new RequestSubscriber_1["default"](observer, config, state);
                });
            }), operators_1.mergeMap(function (v) { return v; }), operators_1.distinctUntilKeyChanged("status"))
                .forEach(function (result) {
                _this.state$.next(result);
            });
        };
        _this.configure = _this.configure.bind(_this);
        _this.subscriberConfigListener = _this.subscriberConfigListener.bind(_this);
        _this.getInitialState = _this.getInitialState.bind(_this);
        _this.initialStateListener = _this.initialStateListener.bind(_this);
        _this.stateListener = _this.stateListener.bind(_this);
        _this.fetch = _this.fetch.bind(_this);
        return _this;
    }
    return SingleObservable;
}(rxjs_1.Observable));
exports["default"] = SingleObservable;
