'use strict';

window.validity = (function () {
  // ----------- Form elements ------------//
  // Find form for adding new advert
  var mainFrom = document.querySelector('.ad-form');
  var roomNumberInput = mainFrom.querySelector('#room_number');
  var capacityInput = mainFrom.querySelector('#capacity');
  var submit = mainFrom.querySelector('.ad-form__submit');
  var typeInput = mainFrom.querySelector('#type');
  var priceInput = mainFrom.querySelector('#price');
  var timeInInput = mainFrom.querySelector('#timein');
  var timeOutInput = mainFrom.querySelector('#timeout');
  var titleInput = mainFrom.querySelector('#title');
  var resButton = document.querySelector('.ad-form__reset');


  var formWithOutlineArray = [roomNumberInput, capacityInput, priceInput, titleInput];
  // Remove all outlines
  var resetOutline = function () {
    formWithOutlineArray.forEach(function (el) {
      el.style.outline = 'none';
    });
  };

  // Show red outline if form is invalid
  var setRedOutline = function (element) {
    if (element.validity.customError) {
      element.style.outline = '4px solid red';
    } else {
      element.style.outline = 'none';
    }
  };

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
    // Show red outline if invalid
    setRedOutline(roomNumber);
    setRedOutline(capacity);
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
    // Show red outline if invalid
    element.reportValidity();
    setRedOutline(element);
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
    // Show red outline if invalid
    element.reportValidity();
    setRedOutline(element);
  };

  // Success handler for data loading
  var onSuccessUpload = function () {
    // Reset form
    // Set interface to default state
    // Show popup with success message
    mainFrom.reset();
    window.interface.shutInterface();
    window.utils.showMessagePopup(null, 'success');
  };

  // Error handler for data loading
  var onErrorUpload = function (errorMessage) {
    // Show popup with error
    // Enable submit button
    window.utils.showMessagePopup(errorMessage, 'error');
    submit.disabled = false;
  };

  // If change room number check condition
  roomNumberInput.addEventListener('change', function () {
    compareRoomsAndCapacity(roomNumberInput, capacityInput);
  });
  // If change capacity check condition
  capacityInput.addEventListener('change', function () {
    compareRoomsAndCapacity(roomNumberInput, capacityInput);
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
  // Add listener to reset button - for what???
  resButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.interface.shutInterface();
  });

  // It is needed if we don't change any control
  // and submit form
  submit.addEventListener('click', function (evt) {
    // Validate inputs before user's input
    // Else we get native browser validation message
    validateInputTextLive(titleInput);
    validateInputNumber(priceInput);
    compareRoomsAndCapacity(roomNumberInput, capacityInput);

    // Prevent page reloading
    evt.preventDefault();

    // If form is valid, send data to server
    if (mainFrom.reportValidity()) {
      // Collect form data and send
      window.server.upload(new FormData(mainFrom), onErrorUpload, onSuccessUpload);

      // Disable submit button
      submit.disabled = true;
    }
  });

  return {
    setMinPriceLimit: setMinPriceLimit,
    resetOutline: resetOutline
  };

})();
