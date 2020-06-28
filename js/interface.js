'use strict';

window.interface = (function () {
  // Handle successful server response
  var onSuccess = function (xhrReturned) {
    // JSON is expected
    var rawResult = xhrReturned.responseText;

    try {
      // Check data format
      var data = JSON.parse(rawResult);
    } catch (err) {
      window.showError('Incoming JSON is invalid:' + err.message);
    }

    // Run interface with data
    startInterface(data);
    // Add listeners on Pins to show popUp
    window.popupCard.onPinClick(data);
  };
  // Handle bad server response
  var onError = function (message) {
    window.utils.showError(message);
  };

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
  // Collect and run all functions to start interface
  var startInterface = function (data) {
    // Remove disable attributes from form elements
    window.visibility.disableFromElements(mainFrom, ['input', 'select', 'textarea', 'button'], false);
    window.visibility.disableFromElements(mapFilterForm, ['input', 'select'], false);
    // Remove hiding classes
    window.visibility.addVisibility();
    // Set up pins on the map
    window.pinsAdvert.fillPinContainer(pinTemplate, data, pinContainer);

    // Set coordinates value in address input (Sharp pin)
    // The last argument of getCurrentPosition() is length of sharp tail
    addressField.value = window.pinMain.getCurrentPosition(mainPin, 22);

    // Remove listeners - we can click on MainPin and start interface only one time
    // If don't do this, we get second and third mousemove listeners, drag feature will work wrong
    mainPin.removeEventListener('mousedown', cbBindedMouse);
    mainPin.removeEventListener('keydown', cbBindedEnter);
    // Activate feature to drag mainPin
    window.pinMainMove.activateMainPinMove();
  };

  // Prepare interface after page os loaded
  var setDefaultInterface = function () {
    // Set min price
    window.validity.setMinPriceLimit(priceInput, typeInput);
    // Deny type text in address input
    addressField.setAttribute('readonly', '');
    // Set default position of map pin in address input (Round pin)
    addressField.value = window.pinMain.getCurrentPosition(mainPin);
    // Disable form elements for adding new advert
    window.visibility.disableFromElements(mainFrom, ['input', 'select', 'textarea', 'button']);
    // Disable form elements in filter
    window.visibility.disableFromElements(mapFilterForm, ['input', 'select']);
  };

  // --------Lock interface by default
  setDefaultInterface();

  // --------Unlock interface
  // --------Only after successful data loading
  // Bind key checking functions and load() function
  // -- evt object from listener will be the last arg in .bind()
  // -- without cb in apart variable I can't remove listener
  // Bind arguments to load()
  var cbBindedMouse = window.utils.isMouseLeftDown.bind(null,
      window.load.bind(null, window.constants.SERVER_URL, onError, onSuccess)
  );
  var cbBindedEnter = window.utils.isEnterDown.bind(null,
      window.load.bind(null, window.constants.SERVER_URL, onError, onSuccess)
  );

  // Start interface when click on "maffin"
  mainPin.addEventListener('mousedown', cbBindedMouse);
  // Start interface on press "Enter"
  mainPin.addEventListener('keydown', cbBindedEnter);
})();
