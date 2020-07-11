'use strict';

(function () {
  // define timeout
  var DEBOUNCE_INTERVAL = 500; // 0.5 sec

  window.debounce = function (cb) {
    // define empty variable in closure
    var lastTimeout;
    // return function
    return function () {
      // if lastTimeout exists, clear previous timeout
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      // set timeout to call back
      lastTimeout = setTimeout(cb, DEBOUNCE_INTERVAL);
    };

  };
})();
