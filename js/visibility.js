'use strict';

window.visibility = (function () {
  // Find HTML elements
  var map = document.querySelector('.map');
  var mainForm = document.querySelector('.ad-form');

  // Show or hide blocks
  var toggleClasses = function () {
    map.classList.toggle('map--faded');
    mainForm.classList.toggle('ad-form--disabled');
  };

  var disableFormElements = function (form, tagArray, flag) {
    // check existence of flag
    if (flag === undefined) {
      flag = true;
    }
    // Define empty array
    var controlArray = [];
    // Go throw tagArray
    for (var i = 0; i < tagArray.length; i++) {
      // Make array from nodeList
      // Add array to controlArray
      var nodeListArray = Array.from(form.querySelectorAll(tagArray[i]));
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
    disableFormElements: disableFormElements,
    toggleClasses: toggleClasses
  };

})();
