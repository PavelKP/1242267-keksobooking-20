'use strict';

window.utils = (function () {

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
      cb(evt);
    }
  };

  // Show popup if message appears
  var showMessagePopup = function (errorMessage, type) {
    // Find map pin
    // Disable pin button
    var mainPin = document.querySelector('.map__pin--main');
    mainPin.disabled = true;

    if (type !== 'error' && type !== 'success') {
      throw new Error('указан неправильный тип сообщения');
    }
    // Find HTML elements
    var mainContainer = document.querySelector('main');
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

      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onPopupEsc);

      // Enable main pin button
      mainPin.disabled = false;
    };

    // Define callback - for document
    var onDocumentClick = isMouseLeftDown.bind(null, removePopup);
    // Using mousedown is necessary
    // on mouse down data is downloading and this function starts
    // at this moment click has already started (???)
    // on mouse up finishes click and popup will close immediately

    // unable to close popup before ERROR_POPUP_TIMEOUT have passed
    setTimeout(function () {
      document.addEventListener('click', onDocumentClick);
    }, window.constants.ERROR_POPUP_TIMEOUT);

    // Define callback with button checking - for ESC
    var onPopupEsc = isEscDown.bind(null, removePopup);
    // Add listener - close popup on ESC
    // unable to close popup before ERROR_POPUP_TIMEOUT have passed
    setTimeout(function () {
      document.addEventListener('keydown', onPopupEsc);
    }, window.constants.ERROR_POPUP_TIMEOUT);

    if (type === 'error') {
      // Define callback - for button
      var onButtonClick = isMouseLeftDown.bind(null, removePopup);
      // Find close button
      var button = templateClone.querySelector('.error__button');
      // Add listener - close popup on button click
      // unable to close popup before ERROR_POPUP_TIMEOUT have passed
      setTimeout(function () {
        button.addEventListener('click', onButtonClick);
      }, window.constants.ERROR_POPUP_TIMEOUT);

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
    isEscDown: isEscDown,
    isEnterDown: isEnterDown,
    isMouseLeftDown: isMouseLeftDown,
    showMessagePopup: showMessagePopup
  };

})();
