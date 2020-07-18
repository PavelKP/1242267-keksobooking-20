'use strict';

window.filter = (function () {
  // Find HTML elements
  var pinContainer = document.querySelector('.map__pins');
  var filterForm = document.querySelector('.map__filters');

  // Find template
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  // Set filter to filter form
  var addToForm = function (data) {

    // Render pins sorted by changed control
    var onFilterFormChange = function () {
      // Find Popup
      // Hide popup
      var popup = document.querySelector('.map__card');
      popup.hidden = true;

      // Clear pin container
      // Remove click handler from pin container
      // Get cb from global scope
      window.advertPins.clearPinContainer(pinContainer);
      pinContainer.removeEventListener('click', window.cb);

      // Create empty array for filtered data
      var dataFiltered = [];

      // Define all filter controls
      // - take only checked checkboxes
      var controls = filterForm.querySelectorAll('.map__filter, .map__checkbox:checked');
      // Convert nodeList to array
      // Extract checked values
      controls = Array.from(controls);
      var controlsChanged = controls.filter(function (control) {
        return control.value;
      });

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
            if (number >= 10000 && number < 50000) {
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

      var compareValueWithData = function (advert, control) {
        if (control.value === 'any') {
          return true; // if no changes
        } else if (control.name === 'housing-price') {
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

      };

      // Filter data when control is changed
      var filterData = function () {
        // Clear array
        dataFiltered = [];

        for (var i = 0; i < data.length; i++) { // Iterate throw data
          var advert = data[i];

          for (var j = 0; j < controlsChanged.length; j++) { // Iterate throw controls
            var control = controlsChanged[j];
            var checked = compareValueWithData(advert, control); // Decide to remain data or not

            if (!checked) {
              break; // break cycle if we meet first false checking
            }
          }

          if (window.constants.MAX_ADVERT_AMOUNT <= i) {
            break; // Show only 5 adverts
          }

          if (checked) {
            dataFiltered.push(advert); // don't include data when checking is failed
          }
        }
      };

      // Filter data
      // Set up pins on the map using filtered data
      filterData();
      window.advertPins.fillPinContainer(pinTemplate, dataFiltered, pinContainer);
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
