'use strict';

window.filter = (function () {
  // Find pin container
  var pinContainer = document.querySelector('.map__pins');
  // Find pin template
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  // Find filter form
  var filterForm = document.querySelector('.map__filters');

  // Set filter to filter form
  var addToForm = function (data) {

    // Render pins sorted by changed control
    var onFilterFormChange = function () {
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

      // Define all filter controls
      // - take only checked checkboxes
      var controls = filterForm.querySelectorAll('.map__filter, .map__checkbox:checked');
      // Convert nodeList to array
      controls = Array.from(controls);

      // Iterate throw array
      //	controls.forEach(function (el) {

      var comparePrice = function (number, type) {
        var result;
        switch (type) {
          case 'low':
            if (number < 10000) {
              result = true;
            }
            break;
          case 'middle':
            if (number > 10000 && number < 50000) {
              result = true;
            }
            break;
          case 'high':
            if (number > 50000) {
              result = true;
            }
            break;
          default:
            return false;
        }
        return result;
      };

      var dataFieldMap = {
        'housing-type': 'type',
        'housing-price': 'price',
        'housing-rooms': 'rooms',
        'housing-guests': 'guests'
      };

      var castType = function (string) {
        if (isNaN(string)) {
          // return string
          return string;
        } else {
          // cast string to number
          return +string;
        }
      };

      // Filter data when control is changed
      var filterData = function () {
        // Iterate throw array with form elements (selectors, checkboxes)
        controls.forEach(function (control) {
          // Filter data if form element has a value is different from 'any'
          if (control.value !== 'any') {
            // Filter data
            dataCopy = dataCopy.filter(function (advert) {
              // if change price
              if (control.id === 'housing-price') {
                // compare price in data with control gradation
                return comparePrice(advert.offer.price, control.value);
              // if change features find checked input value in data
              } else if (control.name === 'features') {
                return advert.offer.features.includes(control.value);
              // if change anything else control
              } else {
                // Cast type to number or string
                return advert.offer[dataFieldMap[control.id]] === castType(control.value);
              }
            });
          }
        });
      };

      // Filter data
      filterData();

      // Set up pins on the map using filtered data
      window.pinsAdvert.fillPinContainer(pinTemplate, dataCopy, pinContainer);
    };

    var onFilterFormChangeDebounced = window.debounce(onFilterFormChange);
    // Run callback on form is changed
    filterForm.addEventListener('change', onFilterFormChangeDebounced);
  };

  // Shorten array
  var cutArray = function (data, max) {
    return data.slice(0, max);
  };

  return {
    addToForm: addToForm,
    cutArray: cutArray
  };

})();
