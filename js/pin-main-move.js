'use strict';

window.pinMainMove = (function () {

  // Find map pin
  var mainPin = document.querySelector('.map__pin--main');
  // Find map
  var map = document.querySelector('.map');

  // Define empty variables, all functions can use it like a buffer
  var startCoords = {};
  var isDown = true;
  var shift;
  var newPinPosTop;
  var newPinPosLeft;

  // MainPin movement
  var onMouseMove = function (evtMove) {

    // Coordinate X/Y (first click) in Window - new X/Y coordinate in Window (per one mouse move)
    // example: 10 - 11 = -1
    shift = {
      x: startCoords.x - evtMove.clientX,
      y: startCoords.y - evtMove.clientY
    };

    // Set new X/Y coordinate like a start for counting "shift" in next mousemove event
    startCoords = {
      x: evtMove.clientX,
      y: evtMove.clientY
    };

    newPinPosTop = mainPin.offsetTop - shift.y;

    var pinTopOffset = 31;

    if (newPinPosTop <= 130) {
      newPinPosTop = 130;
    } else if (startCoords.y < 130 + pinTopOffset) {
      newPinPosTop = 130;
    }

    var pinBottomOffset = 42;

    if (newPinPosTop >= 630) {
      newPinPosTop = 630;
    } else if (startCoords.y > 705 - pinBottomOffset) {
      newPinPosTop = 630;
    }

    newPinPosLeft = mainPin.offsetLeft - shift.x;

    // Find left and right boundaries of map
    var mapLeftBoundary = (document.documentElement.clientWidth - map.offsetWidth) / 2;
    var mapRightBoundary = mapLeftBoundary + map.offsetWidth;

    if (newPinPosLeft <= -31) {
      newPinPosLeft = -31;
    } else if (startCoords.x <= mapLeftBoundary) {
      newPinPosLeft = -31;
    }

    if (newPinPosLeft > (map.offsetWidth - 31)) {
      newPinPosLeft = (map.offsetWidth - 31);
    } else if (startCoords.x >= mapRightBoundary) {
      newPinPosLeft = (map.offsetWidth - 31);
    }

    mainPin.style.top = newPinPosTop + 'px';
    mainPin.style.left = newPinPosLeft + 'px';

    if (isDown === true) {
      // If mouse is down start move mainPin again
      mainPin.addEventListener('mouseover', onMouseOver);
    }
  };

  var onMouseOver = function () {
    mainPin.removeEventListener('mouseover', onMouseOver);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onMouseUp = function (UpEvt) {
    UpEvt.preventDefault();

    isDown = false;
    console.log('Отпущена');

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    // kkkkk
    mainPin.removeEventListener('mouseover', onMouseOver);
  };

  var activateMainPinMove = function () {
    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      isDown = true;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  return {
    activateMainPinMove: activateMainPinMove
  };

})();
