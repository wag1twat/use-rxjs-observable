import { equalObjects } from "./equalObjects";

export const equalArray = function (array1: any[], array2: any[]) {
  if (!array1 || !array2) return false;
  if (array1.length !== array2.length) return false;
  for (var i = 0, l = array1.length; i < l; i++) {
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (!equalArray(array1[i], array2[i])) return false;
    } else if (!equalObjects(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
};
