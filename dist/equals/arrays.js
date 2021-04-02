"use strict";
exports.__esModule = true;
exports.equalArray = void 0;
var objects_1 = require("./objects");
var equalArray = function (array1, array2) {
    if (!array1 || !array2)
        return false;
    if (array1.length !== array2.length)
        return false;
    for (var i = 0, l = array1.length; i < l; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!exports.equalArray(array1[i], array2[i]))
                return false;
        }
        else if (!objects_1.equalObjects(array1[i], array2[i])) {
            return false;
        }
    }
    return true;
};
exports.equalArray = equalArray;
