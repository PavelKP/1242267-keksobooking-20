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

  return {
    setMinPriceLimit: setMinPriceLimit
  };

})();
