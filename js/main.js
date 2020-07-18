'use strict';

(function () {
  // Lock interface by default
  // Start interface on pin mousedown
  // Start interface on pin enter
  window.interface.setDefaultInterface();
  window.pinMainMove.activateInterfaceOnPinDown();
  window.interface.activateInterfaceOnPinEnter();
})();
