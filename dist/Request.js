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
exports.__esModule = true;
exports.Request = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var objects_1 = require("./equals/objects");
var RequestSubscriber_1 = require("./RequestSubscriber");
var result_1 = require("./result");
var Request = /** @class */ (function (_super) {
    __extends(Request, _super);
    function Request(config, updater) {
        var _this = _super.call(this) || this;
        _this.config$ = new rxjs_1.BehaviorSubject({});
        _this.unsubscribe = function () {
            if (_this.subscription) {
                _this.subscription.unsubscribe();
            }
            _this.config$.unsubscribe();
            _super.prototype.unsubscribe.call(_this);
        };
        if (!objects_1.equalObjects(_this.config$.value, config)) {
            _this.config$.next(config);
            updater(result_1.Init());
        }
        _this.fetch = function (axiosConfig) {
            if (axiosConfig === void 0) { axiosConfig = {}; }
            _this.subscription = _this.config$
                .pipe(operators_1.switchMap(function (v) {
                return new rxjs_1.Observable(function (observer) {
                    new RequestSubscriber_1.RequestSubscriber(observer, Object.assign(v, axiosConfig));
                });
            }))
                .subscribe(updater);
        };
        return _this;
    }
    return Request;
}(rxjs_1.Subscriber));
exports.Request = Request;
