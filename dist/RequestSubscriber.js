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
exports.RequestSubscriber = void 0;
var axios_1 = __importDefault(require("axios"));
var rxjs_1 = require("rxjs");
var result_1 = require("./result");
var RequestSubscriber = /** @class */ (function (_super) {
    __extends(RequestSubscriber, _super);
    function RequestSubscriber(observer, config) {
        var _this = _super.call(this, observer) || this;
        axios_1["default"].interceptors.request.use(function (axiosConfig) {
            _this.next(result_1.Loading());
            return axiosConfig;
        });
        axios_1["default"]
            .request(config)
            .then(function (response) {
            _this.next(result_1.Success(response));
        })["catch"](function (error) {
            _this.next(result_1.Error(error));
        })["finally"](function () {
            _this.complete();
        });
        return _this;
    }
    return RequestSubscriber;
}(rxjs_1.Subscriber));
exports.RequestSubscriber = RequestSubscriber;
