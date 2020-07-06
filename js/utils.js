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
  var isEscDown = function (cb, evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      cb();
    }
  };
  // Check pressed key - Enter
  var isEnterDown = function (cb, evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      cb();
    }
  };
  // Check pressed left mouse button
  var isMouseLeftDown = function (cb, evt) {
    if (evt.button === 0) {
      evt.preventDefault();
      cb();
    }
  };

  // Show popup if message appears
  var showMessagePopup = function (errorMessage, type) {

    if (type !== 'error' && type !== 'success') {
      throw new Error('указан неправильный тип сообщения');
    }
    // Find container
    var mainContainer = document.querySelector('main');
    // Find error popup template
    var template = document.querySelector('#' + type)
      .content
      .querySelector('.' + type);
    // Clone template node
    var templateClone = template.cloneNode(true);

    // Remove popup and all listeners
    var removePopup = function () {
      templateClone.remove();

      if (type === 'error') {
        button.removeEventListener('click', onButtonClick);
      }

      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onPopupEsc);
    };

    // Define callback - for document
    var onDocumentClick = isMouseLeftDown.bind(null, removePopup);
    // Using mousedown is necessary
    // on mouse down data is downloading and this function starts
    // at this moment click has already started (???)
    // on mouse up finishes click and popup will close immediately
    document.addEventListener('mousedown', onDocumentClick);

    // Define callback with button checking - for ESC
    var onPopupEsc = isEscDown.bind(null, removePopup);
    // Add listener - close popup on ESC
    document.addEventListener('keydown', onPopupEsc);

    if (type === 'error') {
      // Define callback - for button
      var onButtonClick = isMouseLeftDown.bind(null, removePopup);
      // Find close button
      var button = templateClone.querySelector('.error__button');
      // Add listener - close popup on button click
      button.addEventListener('click', onButtonClick);
      // Find message container
      var textEl = templateClone.querySelector('.error__message');
      // Set message
      textEl.textContent = errorMessage;
    }
    // Show popup
    mainContainer.appendChild(templateClone);
  };

  // return the object with public methods
  return {
    getRandomNumber: getRandomNumber,
    getRandomFromArray: getRandomFromArray,
    getRandomArray: getRandomArray,
    getRandomSlice: getRandomSlice,
    isEscDown: isEscDown,
    isEnterDown: isEnterDown,
    isMouseLeftDown: isMouseLeftDown,
    showMessagePopup: showMessagePopup
  };

})();
