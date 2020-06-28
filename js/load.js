'use strict';

(function () {
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

  window.load = function (url, onError, onSuccess) {
    // Create XHR object
    var xhr = new XMLHttpRequest();
    // Set timeout for server answer
    xhr.timeout = 10000; // 10s
    // Open connection
    xhr.open('GET', url);
    // Send request
    xhr.send();


    // Handle load event
    var onLoad = function () {
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

    // If no connection to the server (no answer from server)
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения с сервером.');
    });
    // If waiting answer from server is too long
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    // Run callback after data is loaded
    xhr.addEventListener('load', onLoad);
  };
})();
