"use strict";
exports.__esModule = true;
exports.useRequest = void 0;
var react_1 = require("react");
var Request_1 = require("./Request");
function useRequest(config, handlers) {
    if (handlers === void 0) { handlers = {}; }
    var _a = react_1.useState(), state = _a[0], setState = _a[1];
    var _b = react_1.useMemo(function () {
        return new Request_1.Request(config, setState);
    }, [config]), fetch = _b.fetch, unsubscribe = _b.unsubscribe;
    react_1.useEffect(function () {
        if (handlers.onSuccess) {
            if (state) {
                if (state.status === "success") {
                    handlers.onSuccess(state);
                }
            }
        }
        if (handlers.onError) {
            if (state) {
                if (state.status === "error") {
                    handlers.onError(state);
                }
            }
        }
    }, [handlers, state]);
    react_1.useEffect(function () {
        return function () {
            unsubscribe();
        };
    }, [unsubscribe]);
    return { state: state, fetch: fetch };
}
exports.useRequest = useRequest;
