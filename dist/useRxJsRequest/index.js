"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var single_1 = __importDefault(require("../Observables/single"));
var react_use_1 = require("react-use");
function useRxJsRequest(_a, _b) {
    var method = _a.method, url = _a.url, body = _a.body, params = _a.params;
    var _c = _b === void 0 ? {} : _b, refetchInterval = _c.refetchInterval, fetchOnMount = _c.fetchOnMount, onError = _c.onError, onSuccess = _c.onSuccess;
    var observable = react_1.useMemo(function () { return new single_1["default"](); }, []);
    var _d = react_1.useState({}), state = _d[0], setState = _d[1];
    react_1.useEffect(function () {
        observable.configure({
            method: method,
            url: url,
            body: body,
            params: params,
            refetchInterval: refetchInterval,
            fetchOnMount: fetchOnMount,
            onSuccess: onSuccess,
            onError: onError
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        observable.configure,
        method,
        url,
        body,
        params,
        refetchInterval,
        fetchOnMount,
        onSuccess,
        onError,
    ]);
    react_use_1.useDeepCompareEffect(function () {
        var subscription = observable.subscribe(setState);
        return function () {
            subscription.unsubscribe();
        };
    }, [observable.subscribe]);
    return {
        state: state,
        fetch: react_1.useCallback(function (config) { return observable.fetch(config); }, [observable])
    };
}
exports["default"] = useRxJsRequest;
