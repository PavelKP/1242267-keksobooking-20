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

    /*
    console.log(startCoords.y + ' START ');
    console.log(shift.y);
    */

    // If cursor Y coordinate <=130
    if (startCoords.y <= 130) {
      // Value for style.top is EVERY = 130
      newPinPosTop = 130;
      mainPin.style.top = newPinPosTop + 'px';


     // console.log('<=130' + ' - ' + startCoords.y);

    // Else if cursor Y coordinate > 130
    } else if (startCoords.y > 130 && startCoords.y < 631) {
      // Count value for style.top
      // Distance from parent top boundary - shift
      // Example: 130 - (-1) = 131
      newPinPosTop = mainPin.offsetTop - shift.y;
     // console.log('>130 <=630' + ' - ' + startCoords.y);

      // Coord.y = 130 only on the top of pin
      // If click on bottom of pin and move above cursor coord.y can be more than 130
      // example: 150 - (-1) = 151
      // when startCoords.y > 130, pin jumps back

      // Fix it
      if (newPinPosTop < 131) {
        newPinPosTop = 130;
      } else if (newPinPosTop > 630) {
        newPinPosTop = 630;
        shift.x = 0;
      }
      // Set style of Pin
      mainPin.style.top = newPinPosTop + 'px';
    }

    if (startCoords.x <= -31) {
      newPinPosLeft = -31;
      mainPin.style.left = newPinPosLeft + 'px';

      console.log('<=-31' + ' / ' + startCoords.x);


    } else if (startCoords.x > 143 && startCoords.x < 1334) {
      newPinPosLeft = mainPin.offsetLeft - shift.x;

      console.log('>-31 <1200' + ' / ' + startCoords.x);


      // Coord.y = 130 only on the top of pin
      // If click on bottom of pin and move above cursor coord.y can be more than 130
      // example: 150 - (-1) = 151
      // when startCoords.y > 130, pin jumps back

      // Fix it
      if (newPinPosLeft < -31) {
        newPinPosLeft = -31;
      } else if (newPinPosTop > (map.offsetWidth - 31)) {
        newPinPosTop = (map.offsetWidth - 31);
        shift.x = 0;
      }
      // Set style of Pin
      mainPin.style.left = newPinPosLeft + 'px';
    }


/*
    if (startCoords.y >= 630) {
      newPinPosTop = 630;
      mainPin.style.top = newPinPosTop + 'px';
    } else if (startCoords.y < 630 && startCoords.y > 130) {
      newPinPosTop = mainPin.offsetTop - shift.y;

      if (newPinPosTop > 630) {
        newPinPosTop = 630;
      }
      // Set style of Pin
      mainPin.style.top = newPinPosTop + 'px';
    }*/




/*
    var newPinPosLeft = mainPin.offsetLeft - shift.x;
    newPinPosTop = mainPin.offsetTop - shift.y;


    mainPin.style.left = newPinPosLeft + 'px';
    mainPin.style.top = newPinPosTop + 'px';
    console.log(newPinPosTop + 'px');*/



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
