"use strict";
exports.__esModule = true;
exports.Error = exports.Success = exports.Loading = exports.Init = void 0;
function Init() {
    return {
        status: "init",
        isLoading: false,
        response: null,
        error: null
    };
}
exports.Init = Init;
function Loading() {
    return {
        status: "loading",
        isLoading: true,
        response: null,
        error: null
    };
}
exports.Loading = Loading;
function Success(response) {
    return {
        status: "success",
        isLoading: true,
        response: response,
        error: null
    };
}
exports.Success = Success;
function Error(error) {
    return {
        status: "error",
        isLoading: true,
        response: null,
        error: error
    };
}
exports.Error = Error;
