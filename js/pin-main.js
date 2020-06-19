'use strict';

window.pinMain = (function () {
  // Get current Pin position
  var getCurrentPosition = function (pinBlock, sharpTail) {
    // Get current coordinates (inline left and top properties)
    var left = pinBlock.style.left;
    var top = pinBlock.style.top;

    // Convert to number without 'px'
    left = +left.replace(/px/, '');
    top = +top.replace(/px/, '');
    // Count offsets to define center point
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
    left = Math.round(left + leftOffset);
    top = Math.round(top + topOffset);

    return left + ', ' + top;
  };

  return {
    getCurrentPosition: getCurrentPosition
  };

})();
