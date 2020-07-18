'use strict';

(function () {
  // Lock interface by default
  // Start interface on pin mousedown
  // Start interface on pin enter
  window.interface.setDefaultInterface();
  window.elementMove.activateInterfaceOnPinDown();
  window.interface.activateInterfaceOnPinEnter();
})();
