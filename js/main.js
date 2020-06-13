'use strict';

var MIN_AVATAR_NUMBER = 1;
var MAX_AVATAR_NUMBER = 8;
var TITLE = 'Lorem ipsum dolor sit amet, consectetur';
var PRICE = 9999;
var PRICE_UNITS = '₽/ночь';
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

var TYPE_AND_PRICE_LIBRARY = {
  flat: {
    translation: 'Квартира',
    minPrice: 1000
  },
  palace: {
    translation: 'Дворец',
    minPrice: 10000
  },
  house: {
    translation: 'Дом',
    minPrice: 5000
  },
  bungalo: {
    translation: 'Бунгало',
    minPrice: 0
  }
};

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
var getXCoordinate = function (block) {
  var width = block.offsetWidth;
  return getRandomNumber(0, width);
};

// Return y coordinate in boundaries
var getYCoordinate = function () {
  var minCoordinate = 130;
  var maxCoordinate = 630;

  return getRandomNumber(minCoordinate, maxCoordinate);
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
      'title': TITLE,
      'address': locationPoint.x + ', ' + locationPoint.y,
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
      'x': locationPoint.x,
      'y': locationPoint.y
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
  // Set ID fto bound Pin element and data
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
  return;
};

// Return fragment with element (by copying child from parent)
var addCopyElements = function (block, element, data) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    // Clone element
    var elementClone = element.cloneNode(true);
    // Write src
    elementClone.src = data[i];
    // Append to fragment
    fragment.appendChild(elementClone);
  }
  // remove initial template element
  block.removeChild(element);
  return fragment;
};

// Return fragment with element (by creating <li>)
var createList = function (data) {
  // Create empty fragment
  var fragment = document.createDocumentFragment();
  // Define basic class
  var basicClass = 'popup__feature';

  // Create New Element
  var templateElement = document.createElement('li');
  // Add basic class
  templateElement.classList.add(basicClass);

  for (var i = 0; i < data.length; i++) {
    var feature = data[i];

    var newElement = templateElement.cloneNode(true);
    // Add class modifier
    newElement.classList.add(basicClass + '--' + feature);
    newElement.textContent = feature;

    fragment.appendChild(newElement);
  }
  return fragment;
};

// Add simple text from data with checking for existence
var addTextAndCheck = function (element, textData) {
  if (textData) {
    element.textContent = textData;
  } else {
    // Hide element
    element.hidden = true;
  }
};

// Create card
var createCard = function (template, data) {
  var card = template.cloneNode(true);

  // Find elements
  var title = card.querySelector('.popup__title');
  var address = card.querySelector('.popup__text--address');
  var price = card.querySelector('.popup__text--price');
  var type = card.querySelector('.popup__type');
  var capacity = card.querySelector('.popup__text--capacity');
  var time = card.querySelector('.popup__text--time');
  var featuresContainer = card.querySelector('.popup__features');
  var description = card.querySelector('.popup__description');
  var photosContainer = card.querySelector('.popup__photos');
  var photoItem = photosContainer.querySelector('.popup__photo');
  var avatar = card.querySelector('.popup__avatar');

  // Add title
  addTextAndCheck(title, data.offer.title);
  // Add address
  addTextAndCheck(address, data.offer.address);
  // Add price
  addTextAndCheck(price, data.offer.price);
  // Add price units
  price.insertAdjacentHTML('beforeend', ' ' + PRICE_UNITS);
  // Add type of accommodation - use constant library to translate text
  addTextAndCheck(type, TYPE_AND_PRICE_LIBRARY[data.offer.type].translation);
  // Add description
  addTextAndCheck(description, data.offer.description);
  // Add capacity
  if (data.offer.rooms && data.offer.guests) {
    capacity.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  } else {
    capacity.hidden = true;
  }
  // Add time
  if (data.offer.checkin && data.offer.checkout) {
    time.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  } else {
    time.hidden = true;
  }
  // Add features
  // Clear parent element from <li>
  featuresContainer.innerHTML = '';
  if (data.offer.features) {
    // Append fragment with created <li>
    featuresContainer.appendChild(createList(data.offer.features));
  } else {
    featuresContainer.hidden = true;
  }

  // Add photos
  if (data.offer.photos) {
    // Append photo to container .popup__photos
    photosContainer.appendChild(addCopyElements(photosContainer, photoItem, data.offer.photos));
  } else {
    photosContainer.hidden = true;
    // img alt can't be hidden if I hide only parent (?)
    photosContainer.children[0].hidden = true;
  }

  // Add avatar
  if (data.author.avatar) {
    // Append img elements to .popup__photos container
    avatar.src = data.author.avatar;
  } else {
    avatar.hidden = true;
  }

  return card;
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

// Show hidden blocks
var addVisibility = function () {
  map.classList.remove('map--faded');
  mainFrom.classList.remove('ad-form--disabled');
};

// Collect and run all functions to start interface
var startInterface = function () {
  // Remove disable attributes from form elements
  disableFromElements(mainFrom, ['input', 'select', 'textarea', 'button'], false);
  disableFromElements(mapFilterForm, ['input', 'select'], false);
  // Remove hiding classes
  addVisibility();

  // Set up pins on the map
  fillPinContainer(pinTemplate, advertData, pinContainer);

  // Set coordinates value in address input (Sharp pin)
  // The last argument of getCurrentPosition() is length of sharp tail
  addressField.value = getCurrentPosition(mainPin, 22);
};

// Get current Pin position
var getCurrentPosition = function (pinBlock, sharpTail) {
  // Get current coordinates (inline left and top properties)
  var left = pinBlock.style.left;
  var top = pinBlock.style.top;

  // Convert to number without 'px'
  left = +left.replace(/px/, '');
  top = +top.replace(/px/, '');
  // Count offsets to define center point
  var leftOffset = pinBlock.offsetWidth / 2;
  var topOffset;
  // Check existence of sharp tail
  if (sharpTail) {
    // Offset = the whole height + tail
    topOffset = pinBlock.offsetHeight + sharpTail;
  } else {
    // Offset = center
    topOffset = pinBlock.offsetHeight / 2;
  }

  // Add offsets and round
  left = Math.round(left + leftOffset);
  top = Math.round(top + topOffset);

  return left + ', ' + top;
};

// Compare two inputs and show error messages
var compareRoomsAndCapacity = function () {

  if (+roomNumber.value < +capacity.value) {
    // Set error message on rooms
    roomNumber.setCustomValidity('Количество комнат не может быть меньше числа гостей');
    // Unset capacity message
    capacity.setCustomValidity('');
  } else if (+roomNumber.value === 100 && +capacity.value !== 0) {
    // Set error message on capacity
    capacity.setCustomValidity('Гостей приглашать запрещено');
    // Unset rooms message
    roomNumber.setCustomValidity('');
  } else if (+roomNumber.value !== 100 && +capacity.value === 0) {
    // Set error message on rooms
    roomNumber.setCustomValidity('Выберите не менее 100 комнат');
    // Unset capacity message
    capacity.setCustomValidity('');
  } else {
    // Unset messages for two inputs
    capacity.setCustomValidity('');
    roomNumber.setCustomValidity('');
  }
  // Force fire validity event
  roomNumber.reportValidity();
  capacity.reportValidity();
};

// Close popup
var closePopup = function () {
  // Find actual popup element
  var popup = map.querySelector('.map__card');
  // Hide card
  popup.hidden = true;
  // Remove ESC listener from document
  document.removeEventListener('keydown', onPopupEscPress);
};

// Callback to invoke closePopup() on ESC down
var onPopupEscPress = function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    closePopup();
  }
};

// Show card - fetch card from array by id, put it in HTML, add listeners
var showCard = function (evt) {
  // Catch click on img (not in main pin)
  var id;
  if (evt.target && evt.target.matches('.map__pin:not(.map__pin--main) img')) {
    // Find id in parent element
    id = evt.target.parentNode.dataset.id;
    // Catch click on button (not in main pin)
  } else if (evt.target && evt.target.matches('.map__pin:not(.map__pin--main)')) {
    // Find id in target element
    id = evt.target.dataset.id;
  }

  // Find a temporary element or previous created card
  var previous = map.querySelector('.map__card');
  // Check existence of id
  // If we click on pin--main, id will be empty
  if (id) {
    // Add card before .map__filters-container block
    map.replaceChild(createCard(cardTemplate, advertData[id]), previous);

    // Find popup close button
    var popupCloseButton = map.querySelector('.popup__close');

    // Add listener to close popup when click on button "X"
    popupCloseButton.addEventListener('click', function () {
      closePopup();
    });

    // Add listener to run callback on any key down (ESC close)
    document.addEventListener('keydown', onPopupEscPress);
  }
};

// Set dynamic price placeholder and minimum limit
var setMinPriceLimit = function () {
  priceInput.placeholder = 'От ' + TYPE_AND_PRICE_LIBRARY[typeInput.value].minPrice;
  priceInput.min = TYPE_AND_PRICE_LIBRARY[typeInput.value].minPrice;
};

// Make checkin=checkout and vice versa
var setEqualInAndOutTime = function (target) {
  // target - changed input
  if (target === 'in') {
    // timeout = timein
    timeOutInput.value = timeInInput.value;
  } else if (target === 'out') {
    // timein = timeout
    timeInInput.value = timeOutInput.value;
  }
};

// Live number input validation
var validateInputNumber = function (element) {
  // Get min and max values of input
  var min = element.getAttribute('min');
  var max = element.getAttribute('max');

  if (element.validity.valueMissing) {
    element.setCustomValidity('Заполните поле');
  } else if (element.validity.rangeUnderflow) {
    element.setCustomValidity('Укажите цифру не менее ' + min);
  } else if (element.validity.rangeOverflow) {
    element.setCustomValidity('Укажите цифру не более ' + max);
  } else {
    // Remove custom error message - everything is ok
    element.setCustomValidity('');
  }
  // Force fire validity event
  element.reportValidity();
};

// Live text input validation
var validateInputTextLive = function (element) {
  // Get min and max length attributes of input
  var min = element.getAttribute('minlength');
  var max = element.getAttribute('maxlength');
  // Count value length
  var valueLength = element.value.length;

  if (!element.value.length) {
    // This condition will work only on input
    element.setCustomValidity('Поле должно содержать от ' + min + ' до ' + max + ' символов');
  } else if (valueLength <= min) {
    element.setCustomValidity('Введите ещё ' + (min - valueLength) + ' символов');
  } else if (valueLength > max) {
    element.setCustomValidity('Удалите ' + (valueLength - max) + ' символов');
  } else {
    // Remove custom error message - everything is ok
    element.setCustomValidity('');
  }
  // Force fire validity event
  element.reportValidity();
};

// Find map
var map = document.querySelector('.map');
// Find pin template
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
// Find pin container
var pinContainer = document.querySelector('.map__pins');
// Find card template
var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
// Find map pin
var mainPin = document.querySelector('.map__pin--main');

// ----------- Form elements ------------//
// Find form for adding new advert
var mainFrom = document.querySelector('.ad-form');
// Find filter in map
var mapFilterForm = document.querySelector('.map__filters');
// Find address input
var addressField = mainFrom.querySelector('#address');
// Find room number input
var roomNumber = mainFrom.querySelector('#room_number');
// Find room capacity input
var capacity = mainFrom.querySelector('#capacity');
// Find submit form button
var submit = mainFrom.querySelector('.ad-form__submit');
// Find accommodation type input
var typeInput = mainFrom.querySelector('#type');
// Find min price input
var priceInput = mainFrom.querySelector('#price');
// Find checkin time select
var timeInInput = mainFrom.querySelector('#timein');
// Find checkout time select
var timeOutInput = mainFrom.querySelector('#timeout');
// Find title input
var titleInput = mainFrom.querySelector('#title');


// Set default position of map pin in address input (Round pin)
addressField.value = getCurrentPosition(mainPin);
// Create array with advert objects
var advertData = generateAdvertArray(ADVERTS_AMOUNT);
// Disable form elements for adding new advert
disableFromElements(mainFrom, ['input', 'select', 'textarea', 'button']);
// Disable form elements in filter
disableFromElements(mapFilterForm, ['input', 'select']);

// Start interface when click on "maffin"
mainPin.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    startInterface();
    // Prepare interface
    // Set min price
    setMinPriceLimit();
    // Deny type text in address input
    addressField.setAttribute('readonly', '');
  }
});

// Start interface on press "Enter"
mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 13) {
    startInterface();
    // Prepare interface
    // Set min price
    setMinPriceLimit();
    // Deny type text in address input
    addressField.readonly = true;
    // Deny type text in address input
    addressField.setAttribute('readonly', '');
  }
});

// Create empty element for replacement with real card
var temporaryElement = document.createElement('article');
// Add className the same as a real card className
temporaryElement.className = 'map__card';
// Hide element (it gets CSS rules and looks bad)
temporaryElement.style.display = 'none';
// Put element before .map__filters-container block
map.insertBefore(temporaryElement, map.children[1]);

// Render card when click on pin
pinContainer.addEventListener('click', function (evt) {
  showCard(evt);
});

// If change room number check condition
roomNumber.addEventListener('change', function () {
  compareRoomsAndCapacity();
});
// If change capacity check condition
capacity.addEventListener('change', function () {
  compareRoomsAndCapacity();
});
// If change accommodation type - change price limit, validate price
typeInput.addEventListener('change', function () {
  setMinPriceLimit();
  // Validate price
  validateInputNumber(priceInput);
});

// Checkin time become equal checkout time If change checkout input
timeOutInput.addEventListener('change', function () {
  // Argument - target (changing input)
  setEqualInAndOutTime('out');
});

// Checkout time become equal checkin time If change checkin input
timeInInput.addEventListener('change', function () {
  // Argument - target (changing input)
  setEqualInAndOutTime('in');
});

// Add custom validation of title on input
titleInput.addEventListener('input', function () {
  validateInputTextLive(titleInput);
});

// Add custom validation of price on input
priceInput.addEventListener('input', function () {
  validateInputNumber(priceInput);
});

// It is needed if we don't change any control
// and submit form
submit.addEventListener('click', function () {
  // Validate inputs before user's input
  validateInputTextLive(titleInput);
  validateInputNumber(priceInput);
  compareRoomsAndCapacity();
});
