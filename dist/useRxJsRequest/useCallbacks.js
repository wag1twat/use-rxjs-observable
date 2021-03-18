"use strict";
exports.__esModule = true;
exports.useSingleCallbacks = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var react_use_1 = require("react-use");
function useSingleCallbacks() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    react_use_1.useDeepCompareEffect(function () {
        var state$ = rxjs_1.of(args[0])
            .pipe(operators_1.takeWhile(function () { return Boolean(args[1]) || Boolean(args[2]); }), operators_1.takeWhile(function (_a) {
            var status = _a.status;
            return status === "success" || status === "error";
        }), operators_1.distinctUntilKeyChanged("status"))
            .subscribe(function (result) {
            if (args[1] && result.status === "success") {
                args[1](result);
            }
            if (args[2] && result.status === "error") {
                args[2](result);
            }
        });
        return function () {
            state$.unsubscribe();
        };
    }, [args[0]]);
}
exports.useSingleCallbacks = useSingleCallbacks;
