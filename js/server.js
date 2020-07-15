'use strict';

window.server = (function () {
  // Define map witch error messages
  var ErrTextMap = {
    '100': 'Request received, continuing process',
    '200': 'Successful request',
    '201': 'Created',
    '204': 'No Content',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Сервер не найден',
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
        // If error exists in map, pass custom message to callback
        onError(ErrTextMap[xhr.status]);
      } else {
        // If no error in map, pass native message
        window.utils.showMessagePopup('Cтатус ответа: ' + xhr.status + ' - ' + xhr.statusText, 'error');
      }
    }
  };

  // Handle server timeout or no connection
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

  // Upload data from server
  var upload = function (data, onError, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    // Run callback after data is loaded
    xhr.addEventListener('load', onLoad.bind(null, xhr, onError, onSuccess));
    onServerNoResponse(xhr, onError);

    xhr.open('POST', window.constants.SERVER_URL_SEND);
    xhr.send(data);
  };

  // Load data on server
  var load = function (url, onError, onSuccess) {
    // Create XHR object
    // Set timeout for server answer
    // Open connection
    // Send request
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000; // 10s
    xhr.open('GET', url);
    xhr.send();

    // Run callback after data is loaded
    xhr.addEventListener('load', onLoad.bind(null, xhr, onError, onSuccess));

    // Return error if connection is lost or timeout is too long
    onServerNoResponse(xhr, onError);
  };

  return {
    upload: upload,
    load: load
  };

})();
