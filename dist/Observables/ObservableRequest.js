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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ObservableRequest = void 0;
var axios_1 = __importDefault(require("axios"));
var rxjs_1 = require("rxjs");
var Results_1 = require("../utils/Results");
var source;
var SubscribeRequest = /** @class */ (function (_super) {
    __extends(SubscribeRequest, _super);
    function SubscribeRequest(key, observer, config) {
        var _this = _super.call(this, observer) || this;
        _this.unsubscribe = function () {
            _super.prototype.unsubscribe.call(_this);
            source = undefined;
        };
        var self = _this;
        if (source) {
            source.cancel("Canceled previous request");
        }
        source = axios_1["default"].CancelToken.source();
        axios_1["default"].interceptors.request.use(function (axiosConfig) {
            var _a;
            var loading = new Results_1.Loading(null, null);
            self.next((_a = {}, _a[key] = loading, _a));
            if (source) {
                axiosConfig.cancelToken = source.token;
            }
            return axiosConfig;
        });
        axios_1["default"]
            .request(config)
            .then(function (response) {
            var _a;
            var success = new Results_1.Success(response);
            self.next((_a = {}, _a[key] = success, _a));
            self.complete();
        })["catch"](function (e) {
            var _a, _b;
            if (axios_1["default"].isCancel(e)) {
                var error_1 = new Results_1.CanceledRequest(e.message);
                self.next((_a = {}, _a[key] = error_1, _a));
                self.complete();
            }
            var error = new Results_1.Error(e);
            self.next((_b = {}, _b[key] = error, _b));
            self.complete();
        });
        return _this;
    }
    return SubscribeRequest;
}(rxjs_1.Subscriber));
var ObservableRequest = /** @class */ (function (_super) {
    __extends(ObservableRequest, _super);
    function ObservableRequest(key, config) {
        return _super.call(this, function (observer) {
            new SubscribeRequest(key, observer, config);
        }) || this;
    }
    return ObservableRequest;
}(rxjs_1.Observable));
exports.ObservableRequest = ObservableRequest;
