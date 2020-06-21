'use strict';

window.utils = (function () {

  // Get random number from min to max (inclusive)
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Get random element from array
  var getRandomFromArray = function (array) {
    return array[window.utils.getRandomNumber(0, array.length - 1)];
  };

  // Get array consisting of random numbers from min to max (no-repeat)
  var getRandomArray = function (min, max) {
    // Create empty array
    var array = [];
    // Fill the array to the max value
    while (array.length < max) {
      var randNumber = getRandomNumber(min, max);
      // Push only unique values
      if (array.indexOf(randNumber) === -1) {
        array.push(randNumber);
      }
    }
    return array;
  };

  // Get random slice of array
  var getRandomSlice = function (array) {
    // Find array length
    var lng = array.length;
    // Count start index for slice method (from 0 to penultimate index of array)
    // if we got the last index, after adding 1 we would be out of array
    var start = (window.utils.getRandomNumber(0, lng - 2));
    // Count end index for slice method (from start index + 1 to array length)
    // if we didn't add 1, we would be able to generate end index = start index
    var end = (window.utils.getRandomNumber(start + 1, lng));
    return array.slice(start, end);
  };

  // Check pressed key - ESC
  var isEscDown = function (evt, cb) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      cb();
    }
  };
  // Check pressed key - Enter
  var isEnterDown = function (evt, cb) {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      cb();
    }
  };
  // Check pressed key - Enter
  var isMouseLeftDown = function (evt, cb) {
    if (evt.button === 0) {
      evt.preventDefault();
      cb();
    }
  };

  // return the object with public methods
  return {
    getRandomNumber: getRandomNumber,
    getRandomFromArray: getRandomFromArray,
    getRandomArray: getRandomArray,
    getRandomSlice: getRandomSlice,
    isEscDown: isEscDown,
    isEnterDown: isEnterDown,
    isMouseLeftDown: isMouseLeftDown
  };

})();
