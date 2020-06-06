'use strict';

var MIN_AVATAR_NUMBER = 1;
var MAX_AVATAR_NUMBER = 8;
var TITLE = 'Lorem ipsum dolor sit amet, consectetur';
var LOCATION = {
  X: 500,
  Y: 300
};
var PRICE = 9999;
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var ADVERTS_AMOUNT = 8;

// Get random number from min to max (inclusive)
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Get random element from array
var getRandomFromArray = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

// Get array consisting of random numbers from min to max (no-repeat)
var getRandomArray = function (min, max) {
  // Create empty array
  var array = [];
  // Fill the array to the max value
  while (array.length < max) {
    var randNumber = getRandomNumber(min, max);

    // Push only unique values
    if (array.indexOf(randNumber) === -1) {
      array.push(randNumber);
    }
  }
  return array;
};

// Get random slice of array
var getRandomSlice = function (array) {
  // Find array length
  var lng = array.length;
  // Count start index for slice method (from 0 to penultimate index of array)
  // if we got the last index, after adding 1 we would be out of array
  var start = (getRandomNumber(0, lng - 2));

  // Count end index for slice method (from start index + 1 to array length)
  // if we didn't add 1, we would be able to generate end index = start index
  var end = (getRandomNumber(start + 1, lng));

  return array.slice(start, end);
};

// Return x coordinate depending on block width
var xCoordinate = function (block) {
  var width = block.offsetWidth;
  return getRandomNumber(0, width);
};

// Generate single advert object with random data
var generateAdvert = function (randArray, index) {
  var obj = {
    'author': {
      'avatar': 'img/avatars/user' + '0' + randArray[index] + '.png',
    },
    'offer': {
      'title': TITLE,
      'address': LOCATION.X + ', ' + LOCATION.Y,
      'price': PRICE,
      'type': getRandomFromArray(TYPE),
      'rooms': getRandomNumber(MIN_ROOMS, MAX_ROOMS),
      'guests': getRandomNumber(MIN_GUESTS, MAX_GUESTS),
      'checkin': getRandomFromArray(CHECKIN_TIMES),
      'checkout': getRandomFromArray(CHECKOUT_TIMES),
      'features': getRandomSlice(FEATURES),
      'description': DESCRIPTION,
      'photos': getRandomSlice(PHOTOS)
    },
    'location': {
      'x': xCoordinate(map),
      'y': getRandomNumber(130, 630)
    }
  };

  return obj;
};

// Generate array with number random advert objects
var generateAdvertArray = function (number) {
  var randArray = getRandomArray(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER);
  var array = [];

  for (var i = 0; i < number; i++) {
    array[i] = generateAdvert(randArray, i);
  }

  return array;
};

// Count offset for pin
var countOffset = function (axis) {
  if (axis.toLowerCase() === 'x') {
    return PIN_WIDTH / 2 * (-1);
  } else if (axis.toLowerCase() === 'y') {
    return PIN_HEIGHT * (-1);
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
  return;
};

// Find map
var map = document.querySelector('.map');
// Activate map
map.classList.remove('map--faded');
// Find pin template
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
// Find pin container
var pinContainer = document.querySelector('.map__pins');
// Create array with advert objects
var advertData = generateAdvertArray(ADVERTS_AMOUNT);
// Set up pins on the map
fillPinContainer(pinTemplate, advertData, pinContainer);
