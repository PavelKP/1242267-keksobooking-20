'use strict';

window.visibility = (function () {
  // Find map
  var map = document.querySelector('.map');
  // Find main form for adding new advert
  var mainFrom = document.querySelector('.ad-form');

  // Show hidden blocks
  var addVisibility = function () {
    map.classList.remove('map--faded');
    mainFrom.classList.remove('ad-form--disabled');
  };

  var disableFromElements = function (form, tagArray, flag) {
    // check existence of flag
    if (flag === undefined) {
      flag = true;
    }
    // Define empty array
    var controlArray = [];
    // Go throw tagArray
    for (var i = 0; i < tagArray.length; i++) {
      // Make array from nodeList
      var nodeListArray = Array.from(form.querySelectorAll(tagArray[i]));
      // Add array to controlArray
      controlArray = controlArray.concat(nodeListArray);
    }

    // All form elements from controlArray
    // Disable (flag = true)
    // Enable (flag = false)
    for (var j = 0; j < controlArray.length; j++) {
      controlArray[j].disabled = flag;
    }
  };

  return {
    disableFromElements: disableFromElements,
    addVisibility: addVisibility
  };

})();
