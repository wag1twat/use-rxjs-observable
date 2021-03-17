"use strict";
exports.__esModule = true;
exports.IdleRequest = exports.LoadingRequest = exports.ErrorRequest = exports.SuccessRequest = void 0;
var SuccessRequest = /** @class */ (function () {
    function SuccessRequest(requestId, data, _a) {
        var url = _a.url, method = _a.method, body = _a.body, params = _a.params;
        this.isLoading = false;
        this.data = data;
        this.error = null;
        this.status = "success";
        this.requestId = requestId;
        this.url = url;
        this.method = method;
        this.body = body;
        this.params = params;
        this.timestamp = new Date();
    }
    return SuccessRequest;
}());
exports.SuccessRequest = SuccessRequest;
var ErrorRequest = /** @class */ (function () {
    function ErrorRequest(requestId, error, _a) {
        var url = _a.url, method = _a.method, body = _a.body, params = _a.params;
        this.isLoading = false;
        this.data = null;
        this.error = error;
        this.status = "error";
        this.requestId = requestId;
        this.url = url;
        this.method = method;
        this.body = body;
        this.params = params;
        this.timestamp = new Date();
    }
    return ErrorRequest;
}());
exports.ErrorRequest = ErrorRequest;
var LoadingRequest = /** @class */ (function () {
    function LoadingRequest(requestId, data, error, _a) {
        var url = _a.url, method = _a.method, body = _a.body, params = _a.params;
        this.isLoading = true;
        this.data = data;
        this.error = error;
        this.status = "loading";
        this.requestId = requestId;
        this.url = url;
        this.method = method;
        this.body = body;
        this.params = params;
        this.timestamp = new Date();
    }
    return LoadingRequest;
}());
exports.LoadingRequest = LoadingRequest;
var IdleRequest = /** @class */ (function () {
    function IdleRequest(requestId, _a) {
        var url = _a.url, method = _a.method, body = _a.body, params = _a.params;
        this.isLoading = false;
        this.data = null;
        this.error = null;
        this.status = "idle";
        this.requestId = requestId;
        this.url = url;
        this.method = method;
        this.body = body;
        this.params = params;
        this.timestamp = new Date();
    }
    return IdleRequest;
}());
exports.IdleRequest = IdleRequest;
