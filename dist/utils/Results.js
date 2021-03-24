"use strict";
exports.__esModule = true;
exports.Error = exports.Success = exports.Loading = exports.Idle = void 0;
var Idle = /** @class */ (function () {
    function Idle(requestId) {
        this.isLoading = false;
        this.status = "idle";
        this.response = null;
        this.error = null;
        this.requestId = requestId;
    }
    return Idle;
}());
exports.Idle = Idle;
var Loading = /** @class */ (function () {
    function Loading(requestId) {
        this.isLoading = true;
        this.status = "loading";
        this.response = null;
        this.error = null;
        this.requestId = requestId;
    }
    return Loading;
}());
exports.Loading = Loading;
var Success = /** @class */ (function () {
    function Success(requestId, response) {
        this.isLoading = false;
        this.status = "success";
        this.error = null;
        this.requestId = requestId;
        this.response = response;
    }
    return Success;
}());
exports.Success = Success;
var Error = /** @class */ (function () {
    function Error(requestId, error) {
        this.isLoading = false;
        this.status = "error";
        this.response = null;
        this.requestId = requestId;
        this.error = error;
    }
    return Error;
}());
exports.Error = Error;
