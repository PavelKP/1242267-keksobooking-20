'use strict';

window.interface = (function () {
  // Find form for adding new advert
  var mainFrom = document.querySelector('.ad-form');
  // Find form elements:
  // - accommodation type input
  var typeInput = mainFrom.querySelector('#type');
  // - min price input
  var priceInput = mainFrom.querySelector('#price');
  // - address input
  var addressField = mainFrom.querySelector('#address');

  // Find map pin
  var mainPin = document.querySelector('.map__pin--main');
  // Find filter form in map
  var mapFilterForm = document.querySelector('.map__filters');
  // Find pin template
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  // Find pin container
  var pinContainer = document.querySelector('.map__pins');
  // Create array with advert objects
  var advertData = window.mockData.generateAdvertArray(window.constants.ADVERTS_AMOUNT);

  // Collect and run all functions to start interface
  var startInterface = function () {
    // Remove disable attributes from form elements
    window.visibility.disableFromElements(mainFrom, ['input', 'select', 'textarea', 'button'], false);
    window.visibility.disableFromElements(mapFilterForm, ['input', 'select'], false);
    // Remove hiding classes
    window.visibility.addVisibility();

    // Set up pins on the map
    window.pinAdvert.fillPinContainer(pinTemplate, advertData, pinContainer);

    // Set coordinates value in address input (Sharp pin)
    // The last argument of getCurrentPosition() is length of sharp tail
    addressField.value = window.pinMain.getCurrentPosition(mainPin, 22);

    // Prepare interface
    // Set min price
    window.validity.setMinPriceLimit(priceInput, typeInput);
    // Deny type text in address input
    addressField.setAttribute('readonly', '');
  };


  // Start interface when click on "maffin"
  mainPin.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      startInterface();
    }
  });

  // Start interface on press "Enter"
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 13) {
      startInterface();
    }
  });

  return advertData;

})();
