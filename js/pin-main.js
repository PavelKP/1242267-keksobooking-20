'use strict';

window.pinMain = (function () {
  // Get current Pin position
  var getCurrentPosition = function (pinBlock, sharpTail) {
    // Get current coordinates (left and top indents from parent)
    var leftIndent = pinBlock.offsetLeft;
    var topIndent = pinBlock.offsetTop;

    // Half of round pin part
    var leftOffset = pinBlock.offsetWidth / 2;
    var topOffset;
    // Check existence of sharp tail
    if (sharpTail) {
      // Offset = the whole height + tail
      topOffset = pinBlock.offsetHeight + sharpTail;
    } else {
      // Offset = center
      topOffset = pinBlock.offsetHeight / 2;
    }

    // Add offsets and round
    // Round floor because left offset is fractional, and left point must be zero
    var coordX = Math.floor(leftIndent + leftOffset);
    var coordY = Math.round(topIndent + topOffset);

    return coordX + ', ' + coordY;
  };

  return {
    getCurrentPosition: getCurrentPosition
  };

})();
