"use strict";
exports.__esModule = true;
exports.equalObjects = void 0;
var equalArray_1 = require("./equalArray");
function equalObjects(object1, object2) {
    for (var prop in object1) {
        if (object1.hasOwnProperty(prop) !== object2.hasOwnProperty(prop)) {
            return false;
        }
        else if (typeof object1[prop] !== typeof object2[prop]) {
            return false;
        }
    }
    for (var prop in object2) {
        if (object1.hasOwnProperty(prop) !== object2.hasOwnProperty(prop)) {
            return false;
        }
        else if (typeof object1[prop] !== typeof object2[prop]) {
            return false;
        }
        if (!object1.hasOwnProperty(prop))
            continue;
        if (object1[prop] instanceof Array && object2[prop] instanceof Array) {
            if (!equalArray_1.equalArray(object1[prop], object2[prop]))
                return false;
            if (!equalObjects(object1[prop], object2[prop]))
                return false;
        }
        else if (object1[prop] instanceof Object &&
            object2[prop] instanceof Object) {
            if (!equalObjects(object1[prop], object2[prop]))
                return false;
        }
        else if (object1[prop] !== object2[prop]) {
            return false;
        }
    }
    return true;
}
exports.equalObjects = equalObjects;
