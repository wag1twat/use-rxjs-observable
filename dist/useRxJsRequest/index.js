"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/* eslint-disable react-hooks/exhaustive-deps */
var react_1 = require("react");
var single_1 = __importDefault(require("../Observables/single"));
var react_use_1 = require("react-use");
function useRxJsRequest(config, _a) {
    var _b = _a === void 0 ? {} : _a, fetchOnUpdateConfigs = _b.fetchOnUpdateConfigs, fetchOnUpdateConfig = _b.fetchOnUpdateConfig, refetchInterval = _b.refetchInterval, fetchOnMount = _b.fetchOnMount, onSuccess = _b.onSuccess, onError = _b.onError;
    var configMemo = react_1.useMemo(function () { return config; }, [config]);
    var subscriberConfigMemo = react_1.useMemo(function () {
        return {
            fetchOnUpdateConfigs: fetchOnUpdateConfigs,
            fetchOnUpdateConfig: fetchOnUpdateConfig,
            refetchInterval: refetchInterval,
            fetchOnMount: fetchOnMount,
            onSuccess: onSuccess,
            onError: onError
        };
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchOnUpdateConfigs,
        fetchOnUpdateConfig,
        refetchInterval,
        fetchOnMount,
        Boolean(onSuccess),
        Boolean(onError),
    ]);
    var _c = react_1.useState({}), state = _c[0], setState = _c[1];
    var observable = react_1.useMemo(function () { return new single_1["default"](); }, []);
    react_use_1.useDeepCompareEffect(function () {
        observable.configure(configMemo, subscriberConfigMemo);
        var subscription = observable.subscribe(setState);
        return function () { return subscription.unsubscribe(); };
    }, [observable, configMemo, subscriberConfigMemo, setState]);
    return {
        state: state,
        fetch: observable.fetch
    };
}
exports["default"] = useRxJsRequest;
