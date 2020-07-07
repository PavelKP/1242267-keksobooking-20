'use strict';

window.pinsAdvert = (function () {

  // Count offset for pin
  var countOffset = function (axis) {
    if (axis.toLowerCase() === 'x') {
      return window.constants.PIN_WIDTH / 2 * (-1);
    } else if (axis.toLowerCase() === 'y') {
      return window.constants.PIN_HEIGHT * (-1);
    } else {
      return 'Error in countOffset()';
    }
  };

  // Create pin node with data
  var createPin = function (template, data, i) {
    // Clone node from template
    var pinElement = template.cloneNode(true);
    // Find img in template
    var img = pinElement.querySelector('img');

    // Fill pin with data
    pinElement.style.left = data[i].location.x + countOffset('x') + 'px';
    pinElement.style.top = data[i].location.y + countOffset('y') + 'px';
    img.src = data[i].author.avatar;
    img.alt = data[i].offer.title;
    // Set ID to bound Pin element and data
    pinElement.setAttribute('data-id', i);

    return pinElement;
  };

  // Fill pin container with pins
  var fillPinContainer = function (template, data, container) {
    // Create empty fragment
    var pinFragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var pinElement = createPin(template, data, i);
      pinFragment.appendChild(pinElement);
    }

    container.appendChild(pinFragment);
    // Add listeners on Pin container to show popUp
    // Function returns cb, thus I can delete listener later
    // Define cb in global scope
    window.cb = window.popupCard.onPinClick(data);
  };

  // Clear pin container with pins
  var clearPinContainer = function (container) {
    // Find all pins
    var pins = container.querySelectorAll('.map__pin:not(.map__pin--main)');
    // Remove all pins
    for (var i = 0; i < pins.length; i++) {
      container.removeChild(pins[i]);
    }
  };

  return {
    fillPinContainer: fillPinContainer,
    clearPinContainer: clearPinContainer
  };

})();
