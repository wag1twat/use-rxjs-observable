"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var multi_1 = __importDefault(require("../Observables/multi"));
var react_use_1 = require("react-use");
function useRxJsRequests(configs, subscriberConfig) {
    if (subscriberConfig === void 0) { subscriberConfig = {}; }
    var _configs = react_use_1.createMemo(function (configs) { return configs; })(configs);
    var _subscriberConfig = react_use_1.createMemo(function (subscriberConfig) { return subscriberConfig; })(subscriberConfig);
    var _a = react_1.useState([]), state = _a[0], setState = _a[1];
    var observable = react_1.useMemo(function () { return new multi_1["default"](); }, []);
    react_use_1.useDeepCompareEffect(function () {
        var subscription = observable
            .configure(_configs, _subscriberConfig)
            .subscribe(setState);
        return function () { return subscription.unsubscribe(); };
    }, [observable, _configs, _subscriberConfig, setState]);
    return {
        state: state,
        fetch: observable.fetch
    };
}
exports["default"] = useRxJsRequests;
