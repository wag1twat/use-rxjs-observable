"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var single_1 = __importDefault(require("../Observables/single"));
var react_use_1 = require("react-use");
function useRxJsRequest(config, subscriberConfig) {
    if (subscriberConfig === void 0) { subscriberConfig = {}; }
    var _config = react_use_1.createMemo(function (config) { return config; })(config);
    var _subscriberConfig = react_use_1.createMemo(function (subscriberConfig) { return subscriberConfig; })(subscriberConfig);
    var _a = react_1.useState({}), state = _a[0], setState = _a[1];
    var observable = react_1.useMemo(function () { return new single_1["default"](); }, []);
    react_use_1.useDeepCompareEffect(function () {
        observable.configure(_config, _subscriberConfig);
        var subscription = observable.subscribe(setState);
        return function () { return subscription.unsubscribe(); };
    }, [observable, _config, _subscriberConfig, setState]);
    return {
        state: state,
        fetch: observable.fetch
    };
}
exports["default"] = useRxJsRequest;
