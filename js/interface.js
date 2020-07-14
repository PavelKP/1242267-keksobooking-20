'use strict';

window.interface = (function () {
  // Interface isn't started
  var flag;

  // Find HTML elements
  var mainPin = document.querySelector('.map__pin--main');
  var avatarInput = document.querySelector('#avatar');
  var avatarPreviewContainer = document.querySelector('.ad-form-header__preview');
  var imagesInput = document.querySelector('#images');
  var imagesPreviewContainer = document.querySelector('.ad-form__photo');
  var mainFrom = document.querySelector('.ad-form');
  var	filterForm = document.querySelector('.map__filters');
  var	typeInput = mainFrom.querySelector('#type');
  var	priceInput = mainFrom.querySelector('#price');
  var	addressField = mainFrom.querySelector('#address');
  var	mapFilterForm = document.querySelector('.map__filters');
  var	pinContainer = document.querySelector('.map__pins');
  // Find templates
  var pinTemplate = document.querySelector('#pin')
			.content
			.querySelector('.map__pin');

  // Define function to show error message after mouseup
  var onPinMouseup = function (message) {
    // Show error message
  // Remove mouseup listener
    window.utils.showMessagePopup(message, 'error');
    mainPin.removeEventListener('mouseup', onPinMouseup);
  };

  // Handle successful server response
  var onSuccessLoad = function (xhrReturned) {
    // JSON is expected
    var rawResult = xhrReturned.responseText;

    try {
      // Check data format
      var data = JSON.parse(rawResult);
    } catch (err) {
      // Bind error message to callback function
      onPinMouseup = onPinMouseup.bind(null, 'Получен некорректный JSON: ' + err.message, 'error');
      // Show error after mouseup event only
      // It is needed only after click on main pin
      // Use listener on mouseup because:
      // on mouse down data is downloading and after error showMessagePopup() starts
      // function sets 'click' listener on document to close popup
      // at this moment click has already started, because mouse is down
      // on mouse up finishes click and popup will close immediately
      // Start error function after mouseup only

      mainPin.addEventListener('mouseup', onPinMouseup);
      // if error is caught, we won't run interface
    }

    // Check twice to remain in try/catch only JSON checking
    if (typeof data === 'object') {
      // Shorten array
      // data = window.filter.cutArray(data, window.constants.MAX_ADVERT_AMOUNT);
      // Run interface with data
      startInterface(data);

      // Call this functions here because in startInterface() they would be doubled after sending data and start interface
      // Add filter feature to filter form
      // Add preview feature to avatar and advert pictures
      window.filter.addToForm(data);
      window.preview.showOnePicture(avatarInput, avatarPreviewContainer, setImage);
      window.preview.showOnePicture(imagesInput, imagesPreviewContainer, setImage);
    }
  };

  // Handle bad server response - on click
  var onErrorLoadMouse = function (message) {
    // Bind error message to callback function
    // Show error after mouseup event only
    // It is needed only after click on main pin
    onPinMouseup = onPinMouseup.bind(null, message);
    mainPin.addEventListener('mouseup', onPinMouseup);
  };

  // Handle bad server response - on enter
  var onErrorLoadEnter = function (message) {
    // Show popup
    window.utils.showMessagePopup(message, 'error');
  };

  // Set advert preview pictures
  var setImage = function (reader, container) {
    // If there is no images in container
    if (!container.children[0]) {
      // Create element
      // Set Data url as src
      // Set alt text
      // Set dimensions
      // Add image to end of container
      var img = document.createElement('img');
      img.src = reader.result;
      img.alt = 'Фото объекта недвижимости';
      img.setAttribute('width', '100%'); // img.width - doesn't work!!! why?
      container.appendChild(img);
    } else {
      // Change src to data url
      container.children[0].src = reader.result;
    }
  };

  // Collect and run all functions to start interface
  var startInterface = function (data) {
    window.interface.flag = true;

    // Remove disable attributes from form elements
    // Remove hiding classes
    // Set up pins on the map
    // Set coordinates value in address input (Sharp pin)
    window.visibility.disableFromElements(mainFrom, ['input', 'select', 'textarea', 'button'], false);
    window.visibility.disableFromElements(mapFilterForm, ['input', 'select'], false);
    window.visibility.changeVisibility();
    window.pinsAdvert.fillPinContainer(pinTemplate, data, pinContainer);
    // The last argument of getCurrentPosition() is length of sharp tail
    addressField.value = window.pinMain.getCurrentPosition(mainPin, 22);

    // Remove listeners - press Enter on MainPin and start interface only one time
    mainPin.removeEventListener('keydown', cbBindedEnter);
  };

  // Return interface to initial state
  var shutInterface = function () {
    window.interface.flag = false;

    // Disable from elements
    window.visibility.disableFromElements(mainFrom, ['input', 'select', 'textarea', 'button'], true);
    window.visibility.disableFromElements(mapFilterForm, ['input', 'select'], true);
    // Add hiding classes (transform main pin to default state)
    window.visibility.changeVisibility();
    // Clear pin container
    window.pinsAdvert.clearPinContainer(pinContainer);
    // Stop main pin movement
    window.pinMainMove.stopMainPinMove();
    // Set default main pin position
    window.pinMainMove.setDefaultPosition();
    // Recalculate and set coordinates (without tail)
    addressField.value = window.pinMain.getCurrentPosition(mainPin);
    // Remove click handler from pin container
    // Get cb from global scope
    pinContainer.removeEventListener('click', window.cb);
    // Remove current popup card
    document.querySelector('.map__card').remove();

    // Remove preview images if they exist
    if (avatarPreviewContainer.children[0]) {
      // Set default image src (muffin)
      avatarPreviewContainer.children[0].src = window.constants.DEFAULT_AVATAR_SRC;
    }
    if (imagesPreviewContainer.children[0]) {
      imagesPreviewContainer.children[0].remove();
    }
    // Reset forms
    filterForm.reset();
    mainFrom.reset();

    // Set default position of map pin in address input (Round pin)
    addressField.value = window.pinMain.getCurrentPosition(mainPin);

    // Prepare interface to activate on press "Enter"
    mainPin.addEventListener('keydown', cbBindedEnter);
    // Prepare interface to activate om mousedown + add pin movement
    window.pinMainMove.activateInterfaceOnPinDown();
    // Reset form element outlines
    window.validity.resetOutline();
  };

  // Prepare interface after page is loaded
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

  // Bind key checking functions and load() function
  // -- evt object from listener will be the last arg in .bind()
  // -- without cb in apart variable I can't remove listener
  var cbBindedEnter = window.utils.isEnterDown.bind(null, window.server.load.bind(null, window.constants.SERVER_URL_RECEIVE, onErrorLoadEnter, onSuccessLoad)
  );

  // Prepare interface on press "Enter"
  var activateInterfaceOnPinEnter = function () {
    mainPin.addEventListener('keydown', cbBindedEnter);
  };

  return {
    shutInterface: shutInterface,
    startInterface: startInterface,
    setDefaultInterface: setDefaultInterface,
    activateInterfaceOnPinEnter: activateInterfaceOnPinEnter,
    flag: flag,
    onErrorLoadMouse: onErrorLoadMouse,
    onSuccessLoad: onSuccessLoad
  };

})();
