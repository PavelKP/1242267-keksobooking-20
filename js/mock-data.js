'use strict';

window.mockData = (function () {
  // Find map element
  var map = document.querySelector('.map');

  // Return x coordinate depending on block width
  var getXCoordinate = function (block) {
    var width = block.offsetWidth;
    return window.utils.getRandomNumber(0, width);
  };

  // Return y coordinate in boundaries
  var getYCoordinate = function () {
    var minCoordinate = 130;
    var maxCoordinate = 630;

    return window.utils.getRandomNumber(minCoordinate, maxCoordinate);
  };

  // Generate single advert object with random data
  var generateAdvert = function (randArray, index) {
    // get random location on map
    var locationPoint = {
      x: getXCoordinate(map),
      y: getYCoordinate()
    };

    var obj = {
      'author': {
        'avatar': 'img/avatars/user' + '0' + randArray[index] + '.png',
      },
      'offer': {
        'title': window.constants.TITLE,
        'address': locationPoint.x + ', ' + locationPoint.y,
        'price': window.constants.PRICE,
        'type': window.utils.getRandomFromArray(window.constants.TYPE),
        'rooms': window.utils.getRandomNumber(window.constants.MIN_ROOMS, window.constants.MAX_ROOMS),
        'guests': window.utils.getRandomNumber(window.constants.MIN_GUESTS, window.constants.MAX_GUESTS),
        'checkin': window.utils.getRandomFromArray(window.constants.CHECKIN_TIMES),
        'checkout': window.utils.getRandomFromArray(window.constants.CHECKOUT_TIMES),
        'features': window.utils.getRandomSlice(window.constants.FEATURES),
        'description': window.constants.DESCRIPTION,
        'photos': window.utils.getRandomSlice(window.constants.PHOTOS)
      },
      'location': {
        'x': locationPoint.x,
        'y': locationPoint.y
      }
    };

    return obj;
  };

  // Generate array with number random advert objects
  var generateAdvertArray = function (number) {
    var randArray = window.utils.getRandomArray(window.constants.MIN_AVATAR_NUMBER, window.constants.MAX_AVATAR_NUMBER);
    var array = [];

    for (var i = 0; i < number; i++) {
      array[i] = generateAdvert(randArray, i);
    }
    return array;
  };
  // return the object with public method
  return {
    generateAdvertArray: generateAdvertArray
  };

})();
