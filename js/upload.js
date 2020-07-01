'use strict';

(function () {
  var URL = 'https://javascript.pages.academy/keksobooking';

  window.upload = function (data, onError, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    // Run callback after data is loaded
    xhr.addEventListener('load', window.utils.onLoad.bind(null, xhr, onError, onSuccess));

    // Return error if connection is lost or timeout is too long
    window.utils.onServerNoResponse(xhr, onError);

    xhr.open('POST', URL);
    xhr.send(data);
  };

})();
