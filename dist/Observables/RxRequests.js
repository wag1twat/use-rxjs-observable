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
var rxjs_1 = require("rxjs");
var RxRequestsOptions_1 = require("./RxRequestsOptions");
var RxRequests = /** @class */ (function (_super) {
    __extends(RxRequests, _super);
    function RxRequests() {
        var _this = _super.call(this, function (observer) {
            observer.add(_this.options$.state$.subscribe(function (state) {
                observer.next(state);
            }));
        }) || this;
        _this.options$ = new RxRequestsOptions_1.RxRequestsOptions({});
        _this.configure = function (options) {
            _this.options$.next(options);
        };
        _this.fetch = function () {
            _this.options$.fetch();
        };
        _this.configure = _this.configure.bind(_this);
        _this.fetch = _this.fetch.bind(_this);
        return _this;
    }
    return RxRequests;
}(rxjs_1.Observable));
exports["default"] = RxRequests;
