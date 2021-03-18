"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/* eslint-disable react-hooks/exhaustive-deps */
var react_1 = require("react");
var multi_1 = __importDefault(require("../Observables/multi"));
var react_use_1 = require("react-use");
var useCallbacks_1 = require("./useCallbacks");
function useRxJsRequests(configs, _a) {
    var _b = _a === void 0 ? {} : _a, fetchOnUpdateConfigs = _b.fetchOnUpdateConfigs, fetchOnUpdateConfig = _b.fetchOnUpdateConfig, refetchInterval = _b.refetchInterval, fetchOnMount = _b.fetchOnMount, onSuccess = _b.onSuccess, onError = _b.onError;
    var configsMemo = react_1.useMemo(function () { return configs; }, [configs]);
    var multiRxObservableConfigMemo = react_1.useMemo(function () {
        return {
            fetchOnUpdateConfigs: fetchOnUpdateConfigs,
            fetchOnUpdateConfig: fetchOnUpdateConfig,
            refetchInterval: refetchInterval,
            fetchOnMount: fetchOnMount
        };
    }, [
        fetchOnUpdateConfigs,
        fetchOnUpdateConfig,
        refetchInterval,
        fetchOnMount,
    ]);
    var _c = react_1.useState([]), state = _c[0], setState = _c[1];
    var observable = react_1.useMemo(function () { return new multi_1["default"](); }, []);
    react_use_1.useDeepCompareEffect(function () {
        var subscription = observable
            .configure(configsMemo, multiRxObservableConfigMemo)
            .subscribe(setState);
        return function () { return subscription.unsubscribe(); };
    }, [observable, configsMemo, multiRxObservableConfigMemo, setState]);
    useCallbacks_1.useMultiCallbacks(state, onSuccess, onError);
    return {
        state: state,
        fetch: observable.fetch
    };
}
exports["default"] = useRxJsRequests;
