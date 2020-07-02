'use strict';

(function () {
  window.load = function (url, onError, onSuccess) {
    // Create XHR object
    var xhr = new XMLHttpRequest();
    // Set timeout for server answer
    xhr.timeout = 10000; // 10s
    // Open connection
    xhr.open('GET', url);
    // Send request
    xhr.send();

    // Run callback after data is loaded
    xhr.addEventListener('load', window.utils.onLoad.bind(null, xhr, onError, onSuccess));

    // Return error if connection is lost or timeout is too long
    window.utils.onServerNoResponse(xhr, onError);
  };
})();