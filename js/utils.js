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

  // Show error message
  var showError = function (text) {
    // create element
    var el = document.createElement('div');
    // Add error message
    el.textContent = text;
    // Add styles
    el.style.position = 'absolute';
    el.style.zIndex = '100';
    el.style.top = '0';
    el.style.left = '0';
    el.style.right = '0';
    el.style.height = '50px';

    el.style.fontSize = '2rem';
    el.style.color = 'white';
    el.style.backgroundColor = 'rgba(255, 0, 0 , 0.7)';

    // Add element to body top
    document.body.insertAdjacentElement('afterbegin', el);

    // Remove el after 2 sec
    setTimeout(function () {
      document.body.removeChild(el);
    }, 2000);
  };

  // Show popup if error appears
  var showAdvertError = function (errorMessage) {
    // Find container
    var mainContainer = document.querySelector('main');
    // Find error popup template
    var template = document.querySelector('#error')
      .content
      .querySelector('.error');
    // Clone template node
    template = template.cloneNode(true);

    // Find close button
    var button = template.querySelector('.error__button');

    // Remove popup and all listeners
    var removePopup = function () {
      template.remove();
      button.removeEventListener('click', onDocumentClick);
      document.removeEventListener('click', onButtonClick);
      document.removeEventListener('keydown', onPopupEsc);
    };

    // Show popup
    mainContainer.insertAdjacentElement('afterbegin', template);

    // Define callback - for button
    var onButtonClick = removePopup;
    // Define callbacks - for document
    var onDocumentClick = removePopup;
    // Define callback with button checking
    var onPopupEsc = isEscDown.bind(null, removePopup);

    // Add listener - close popup on button click
    button.addEventListener('click', onButtonClick);
    // Add listener - close popup on document click
    document.addEventListener('click', onDocumentClick);
    // Add listener - close popup on ESC down
    document.addEventListener('keydown', onPopupEsc);
  };

  // Define map witch error messages
  var ErrTextMap = {
    '100': 'Request received, continuing process',
    '200': 'Successful request',
    '201': 'Created',
    '204': 'No Content',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Server is not found',
    '409': 'Conflict',
    '500': 'Internal Server Error'
  };

  // Handle load event
  var onLoad = function (xhr, onError, onSuccess) {
    // Handle success response
    if (xhr.status === 200) {
      onSuccess(xhr);
    } else {
      // Handle error response
      if (ErrTextMap[xhr.status]) {
        // If error exists in map, pass custom message
        onError(ErrTextMap[xhr.status]);
      } else {
        // If no error in map, pass native message
        onError('Cтатус ответа: ' + xhr.status + ' - ' + xhr.statusText);
      }
    }
  };

  var onServerNoResponse = function (xhr, onError) {
    // If no connection to the server (no answer from server)
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения с сервером');
    });

    // If waiting answer from server is too long
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
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
    showError: showError,
    onLoad: onLoad,
    onServerNoResponse: onServerNoResponse,
    showAdvertError: showAdvertError
  };

})();
