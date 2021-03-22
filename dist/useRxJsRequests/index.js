"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var multi_1 = __importDefault(require("../Observables/multi"));
var react_use_1 = require("react-use");
function useRxJsRequests(configs, _a) {
    var _b = _a === void 0 ? {} : _a, refetchInterval = _b.refetchInterval, fetchOnMount = _b.fetchOnMount, onSuccess = _b.onSuccess, onError = _b.onError;
    var _c = react_1.useState([]), state = _c[0], setState = _c[1];
    var observable = react_1.useMemo(function () { return new multi_1["default"](); }, []);
    react_1.useEffect(function () {
        observable.configure({
            configs: configs,
            refetchInterval: refetchInterval,
            fetchOnMount: fetchOnMount,
            onSuccess: onSuccess,
            onError: onError
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        observable.configure,
        configs,
        refetchInterval,
        fetchOnMount,
        onSuccess,
        onError,
    ]);
    react_use_1.useDeepCompareEffect(function () {
        var subscription = observable.subscribe(setState);
        return function () { return subscription.unsubscribe(); };
    }, [observable.subscribe]);
    return {
        state: state,
        fetch: react_1.useCallback(function () { return observable.fetch(); }, [observable])
    };
}
exports["default"] = useRxJsRequests;
