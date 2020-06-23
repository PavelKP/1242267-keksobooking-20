'use strict';

window.pinMainMove = (function () {
  // Height of mainPin
  var PIN_HEIGHT = 87;
  // Width of mainPin
  var PIN_WIDTH = 65;

  // Find map pin
  var mainPin = document.querySelector('.map__pin--main');
  // Find map
  var map = document.querySelector('.map');
  // - address input
  var addressField = document.querySelector('#address');

  // Define empty variables, all functions can use it like a buffer
  var startCoords = {};

  // MainPin movement
  var onMouseMove = function (evtMove) {
    // Coordinate X/Y (first click) in Window - new X/Y coordinate in Window (per one mouse move)
    // example: 10 - 11 = -1
    var shift = {
      x: startCoords.x - evtMove.clientX,
      y: startCoords.y - evtMove.clientY
    };

    // Set new X/Y coordinate like a start for counting "shift" in next mousemove event
    startCoords = {
      x: evtMove.clientX,
      y: evtMove.clientY
    };

    // Offset after which we can move pin from top
    var pinTopOffset = 31;
    // Count 1 step on Y axis
    var newPinPosTop = mainPin.offsetTop - shift.y;

    // top boundary - pin height
    // sharp tail points on max Y coordinate
    var topLimit = 130 - PIN_HEIGHT;

    // We can set style.top <= top boundary(limit)
    if (newPinPosTop <= topLimit) {
      newPinPosTop = topLimit;
      // Pin won't move if cursor is above boundary + offset
      // We need offset to move pin, when cursor in the center of pin
    } else if (startCoords.y < topLimit + pinTopOffset) {
      newPinPosTop = topLimit;
    }

    // Offset after which we can move pin from bottom
    var pinBottomOffset = 42;
    var botLimit = 630 - PIN_HEIGHT;

    // We can set style.top >= bottom boundary(limit)
    if (newPinPosTop >= botLimit) {
      newPinPosTop = botLimit;
    // Pin won't move if cursor is under boundary + offset
    } else if (startCoords.y > botLimit + pinBottomOffset) {
      newPinPosTop = botLimit;
    }

    // Count 1 step on X axis
    var newPinPosLeft = mainPin.offsetLeft - shift.x;

    // Count left and right boundaries of map
    var mapLeftBoundary = (document.documentElement.clientWidth - map.offsetWidth) / 2;
    var mapRightBoundary = mapLeftBoundary + map.offsetWidth;

    // Half of pin width
    var leftLimit = -PIN_WIDTH / 2;

    if (newPinPosLeft <= leftLimit) {
      newPinPosLeft = leftLimit;
    } else if (startCoords.x <= mapLeftBoundary) {
      newPinPosLeft = leftLimit;
    }

    // Right border of map - half of pin width
    var rightLimit = map.offsetWidth - (PIN_WIDTH / 2);

    if (newPinPosLeft > rightLimit) {
      newPinPosLeft = rightLimit;
    } else if (startCoords.x >= mapRightBoundary) {
      newPinPosLeft = rightLimit;
    }

    // Set style position of Pin
    mainPin.style.top = newPinPosTop + 'px';
    mainPin.style.left = newPinPosLeft + 'px';

    // Set new coordinates in form (address field) on mouse move
    addressField.value = window.pinMain.getCurrentPosition(mainPin, 22);
  };

  // When mouse button is up, movement stops
  var onMouseUp = function (UpEvt) {
    UpEvt.preventDefault();

    // Remove event listeners and stop pin moving
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    // Set new coordinates in form (address field) on mouse up
    addressField.value = window.pinMain.getCurrentPosition(mainPin, 22);
  };

  // Start movement on mouse down
  var activateMainPinMove = function () {
    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  return {
    activateMainPinMove: activateMainPinMove
  };

})();
