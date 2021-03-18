"use strict";
exports.__esModule = true;
exports.useMultiCallbacks = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var react_use_1 = require("react-use");
function useMultiCallbacks() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    react_use_1.useDeepCompareEffect(function () {
        var state$ = rxjs_1.of(args[0])
            .pipe(operators_1.takeWhile(function () { return Boolean(args[1]); }), operators_1.takeWhile(function () { return Boolean(args[2]); }), operators_1.takeWhile(function (_state) {
            return _state.every(function (_a) {
                var status = _a.status;
                return status !== "idle" && status !== "loading";
            });
        }), operators_1.concatMap(function (_state) {
            var success = _state.filter(function (_a) {
                var status = _a.status;
                return status === "success";
            });
            var error = _state.filter(function (_a) {
                var status = _a.status;
                return status === "error";
            });
            return rxjs_1.of({ success: success, error: error });
        }))
            .subscribe(function (_a) {
            var success = _a.success, error = _a.error;
            if (args[1]) {
                args[1](success);
            }
            if (args[2]) {
                args[2](error);
            }
        });
        return function () {
            state$.unsubscribe();
        };
    }, [args[0]]);
}
exports.useMultiCallbacks = useMultiCallbacks;
