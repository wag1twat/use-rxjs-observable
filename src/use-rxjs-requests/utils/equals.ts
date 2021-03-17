export function objectsEqual(
  object1: { [key: string]: any },
  object2: { [key: string]: any }
) {
  for (const prop in object1) {
    if (object1.hasOwnProperty(prop) !== object2.hasOwnProperty(prop)) {
      return false;
    } else if (typeof object1[prop] !== typeof object2[prop]) {
      return false;
    }
  }
  for (const prop in object2) {
    if (object1.hasOwnProperty(prop) !== object2.hasOwnProperty(prop)) {
      return false;
    } else if (typeof object1[prop] !== typeof object2[prop]) {
      return false;
    }
    if (!object1.hasOwnProperty(prop)) continue;
    if (object1[prop] instanceof Array && object2[prop] instanceof Array) {
      if (!objectsEqual(object1[prop], object2[prop])) return false;
    } else if (
      object1[prop] instanceof Object &&
      object2[prop] instanceof Object
    ) {
      if (!objectsEqual(object1[prop], object2[prop])) return false;
    } else if (object1[prop] !== object2[prop]) {
      return false;
    }
  }
  return true;
}

export const arraysOfObjectsEqual = function (array1: any[], array2: any[]) {
  if (!array1 || !array2) return false;
  if (array1.length !== array2.length) return false;
  for (var i = 0, l = array1.length; i < l; i++) {
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (!arraysOfObjectsEqual(array1[i], array2[i])) return false;
    } else if (!objectsEqual(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
};
