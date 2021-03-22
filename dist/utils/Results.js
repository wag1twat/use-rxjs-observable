"use strict";
exports.__esModule = true;
exports.IdleRxRequest = exports.LoadingRxRequest = exports.ErrorRxRequest = exports.SuccessRxRequest = void 0;
var SuccessRxRequest = /** @class */ (function () {
    function SuccessRxRequest(requestId, response, _a) {
        var url = _a.url, method = _a.method, body = _a.body, params = _a.params;
        this.isLoading = false;
        this.response = response;
        this.error = null;
        this.status = "success";
        this.requestId = requestId;
        this.url = url;
        this.method = method;
        this.body = body;
        this.params = params;
        this.timestamp = new Date();
    }
    return SuccessRxRequest;
}());
exports.SuccessRxRequest = SuccessRxRequest;
var ErrorRxRequest = /** @class */ (function () {
    function ErrorRxRequest(requestId, error, _a) {
        var url = _a.url, method = _a.method, body = _a.body, params = _a.params;
        this.isLoading = false;
        this.response = null;
        this.error = error;
        this.status = "error";
        this.requestId = requestId;
        this.url = url;
        this.method = method;
        this.body = body;
        this.params = params;
        this.timestamp = new Date();
    }
    return ErrorRxRequest;
}());
exports.ErrorRxRequest = ErrorRxRequest;
var LoadingRxRequest = /** @class */ (function () {
    function LoadingRxRequest(requestId, response, error, _a) {
        var url = _a.url, method = _a.method, body = _a.body, params = _a.params;
        this.isLoading = true;
        this.response = response;
        this.error = error;
        this.status = "loading";
        this.requestId = requestId;
        this.url = url;
        this.method = method;
        this.body = body;
        this.params = params;
        this.timestamp = new Date();
    }
    return LoadingRxRequest;
}());
exports.LoadingRxRequest = LoadingRxRequest;
var IdleRxRequest = /** @class */ (function () {
    function IdleRxRequest(requestId, _a) {
        var url = _a.url, method = _a.method, body = _a.body, params = _a.params;
        this.isLoading = false;
        this.response = null;
        this.error = null;
        this.status = "idle";
        this.requestId = requestId;
        this.url = url;
        this.method = method;
        this.body = body;
        this.params = params;
        this.timestamp = new Date();
    }
    return IdleRxRequest;
}());
exports.IdleRxRequest = IdleRxRequest;
