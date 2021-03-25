"use strict";
exports.__esModule = true;
exports.Error = exports.Success = exports.Loading = exports.Idle = void 0;
var Idle = /** @class */ (function () {
    function Idle() {
        this.isLoading = false;
        this.status = "idle";
        this.response = null;
        this.error = null;
    }
    return Idle;
}());
exports.Idle = Idle;
var Loading = /** @class */ (function () {
    function Loading() {
        this.isLoading = true;
        this.status = "loading";
        this.response = null;
        this.error = null;
    }
    return Loading;
}());
exports.Loading = Loading;
var Success = /** @class */ (function () {
    function Success(response) {
        this.isLoading = false;
        this.status = "success";
        this.response = null;
        this.error = null;
        this.response = response;
    }
    return Success;
}());
exports.Success = Success;
var Error = /** @class */ (function () {
    function Error(error) {
        this.isLoading = false;
        this.status = "error";
        this.response = null;
        this.error = error;
    }
    return Error;
}());
exports.Error = Error;
