"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useRxRequest = exports.useRxRequests = void 0;
var useRxJsRequest_1 = __importDefault(require("./dist/useRxJsRequest"));
exports.useRxRequest = useRxJsRequest_1["default"];
var useRxJsRequests_1 = __importDefault(require("./dist/useRxJsRequests"));
exports.useRxRequests = useRxJsRequests_1["default"];
