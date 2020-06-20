'use strict';

window.validity = (function () {
  // Set dynamic price placeholder and minimum limit
  var setMinPriceLimit = function (recipient, donorInput) {
    // Take a min price from library
    var minPrice = window.constants.TYPE_AND_PRICE_LIBRARY[donorInput.value].minPrice;
    // Recipient input takes placeholder
    recipient.placeholder = 'От ' + minPrice;
    // Recipient input takes min attribute
    recipient.min = minPrice;
  };

  // Compare two inputs and show error messages
  var compareRoomsAndCapacity = function (roomNumber, capacity) {

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

  // Make checkin=checkout and vice versa
  var setEqualInAndOutTime = function (firstSelect, secSelect, target) {
    // target - changed input
    if (target === 'in') {
      // timeout = timein
      firstSelect.value = secSelect.value;
    } else if (target === 'out') {
      // timein = timeout
      secSelect.value = firstSelect.value;
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

  // ----------- Form elements ------------//
  // Find form for adding new advert
  var mainFrom = document.querySelector('.ad-form');
  // Find filter in map
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


  // If change room number check condition
  roomNumber.addEventListener('change', function () {
    compareRoomsAndCapacity(roomNumber, capacity);
  });
  // If change capacity check condition
  capacity.addEventListener('change', function () {
    compareRoomsAndCapacity(roomNumber, capacity);
  });
  // If change accommodation type - change price limit, validate price
  typeInput.addEventListener('change', function () {
    setMinPriceLimit(priceInput, typeInput);
    // Validate price
    validateInputNumber(priceInput);
  });
  // Checkin time become equal checkout time If change checkout input
  timeOutInput.addEventListener('change', function () {
    // Argument - target (changing input)
    setEqualInAndOutTime(timeOutInput, timeInInput, 'out');
  });
  // Checkout time become equal checkin time If change checkin input
  timeInInput.addEventListener('change', function () {
    // Argument - target (changing input)
    setEqualInAndOutTime(timeOutInput, timeInInput, 'in');
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
    compareRoomsAndCapacity(roomNumber, capacity);
  });

  return {
    setMinPriceLimit: setMinPriceLimit
  };

})();
