'use strict';

window.interface = (function () {
  // Find map pin
  var mainPin = document.querySelector('.map__pin--main');
  // Find input type="file" for avatar
  var avatarInput = document.querySelector('#avatar');
  // Find container for avatar preview
  var avatarPreviewContainer = document.querySelector('.ad-form-header__preview');
  // Find input type="file" for advert images
  var imagesInput = document.querySelector('#images');
  // Find container for images preview
  var imagesPreviewContainer = document.querySelector('.ad-form__photo');

  // Define function to show error message after mouseup
  var onPinMouseup = function (message) {
    // Show error message
    window.utils.showMessagePopup(message, 'error');
    // Remove mouseup listener
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
      data = window.filter.cutArray(data, window.constants.MAX_ADVERT_AMOUNT);
      // Run interface with data
      startInterface(data);

      // Call this functions here because in startInterface() they would be doubled after sending data and start interface
      // Add filter feature to filter form
      window.filter.addToForm(data);
      // Add preview feature to avatar
      window.preview.showOnePicture(avatarInput, avatarPreviewContainer, setImage);
      // Add preview feature to advert pictures
      window.preview.showOnePicture(imagesInput, imagesPreviewContainer, setImage);
    }
  };

  // Handle bad server response - on click
  var onErrorLoadMouse = function (message) {
    // Bind error message to callback function
    onPinMouseup = onPinMouseup.bind(null, message);
    // Show error after mouseup event only
    // It is needed only after click on main pin
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
      var img = document.createElement('img');
      // Set Data url as src
      img.src = reader.result;
      // Set alt text
      img.alt = 'Фото объекта недвижимости';
      // Set dimensions
      // img.width - doesn't work!!! why?
      img.setAttribute('width', '100%');
      // Add image to end of container
      container.appendChild(img);
    } else {
      // Change src to data url
      container.children[0].src = reader.result;
    }
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
    window.visibility.changeVisibility();
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

  // Return interface to initial state
  var shutInterface = function () {
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
    // Remove all preview images
    avatarPreviewContainer.children[0].remove();
    imagesPreviewContainer.children[0].remove();

    // Start interface when click on "maffin"
    mainPin.addEventListener('mousedown', cbBindedMouse);
    // Start interface on press "Enter"
    mainPin.addEventListener('keydown', cbBindedEnter);
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

  // --------Lock interface by default
  setDefaultInterface();

  // --------Unlock interface
  // --------Only after successful data loading
  // Bind key checking functions and load() function
  // -- evt object from listener will be the last arg in .bind()
  // -- without cb in apart variable I can't remove listener
  // Bind arguments to load()
  var cbBindedMouse = window.utils.isMouseLeftDown.bind(null,
      window.server.load.bind(null, window.constants.SERVER_URL_RECEIVE, onErrorLoadMouse, onSuccessLoad)
  );
  var cbBindedEnter = window.utils.isEnterDown.bind(null,
      window.server.load.bind(null, window.constants.SERVER_URL_RECEIVE, onErrorLoadEnter, onSuccessLoad)
  );

  // Start interface when click on "maffin"
  mainPin.addEventListener('mousedown', cbBindedMouse);
  // Start interface on press "Enter"
  mainPin.addEventListener('keydown', cbBindedEnter);

  return {
    shutInterface: shutInterface
  };

})();
