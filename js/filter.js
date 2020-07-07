'use strict';

window.filter = (function () {
  // Find pin container
  var pinContainer = document.querySelector('.map__pins');
  // Find pin template
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  // Set filter to housing type
  var addToHousingType = function (data) {
    // Find filter form
    var filterForm = document.querySelector('.map__filters');
    // Find housing type select
    var housingType = filterForm.querySelector('#housing-type');

    // Render pins sorted by housing type
    var onHousingTypeChange = function () {
      // Find Popup
      var popup = document.querySelector('.map__card');
      // Hide popup
      popup.hidden = true;

      // Clear pin container
      window.pinsAdvert.clearPinContainer(pinContainer);
      // Remove click handler from pin container
      // Get cb from global scope
      pinContainer.removeEventListener('click', window.cb);

      // Copy data array
      var dataCopy = data.slice();

      if (housingType.value !== 'any') {
        // Filter copy of data array
        dataCopy = dataCopy.filter(function (advert) {
          return advert.offer.type === housingType.value;
        });
      }
      // Set up pins on the map using filtered data
      window.pinsAdvert.fillPinContainer(pinTemplate, dataCopy, pinContainer);
    };

    housingType.addEventListener('click', onHousingTypeChange);
  };

  // Shorten array
  var cutArray = function (data, max) {
    return data.slice(0, max);
  };

  return {
    addToHousingType: addToHousingType,
    cutArray: cutArray
  };

})();