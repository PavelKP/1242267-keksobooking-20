'use strict';

(function () {
	// Lock interface by default
  window.interface.setDefaultInterface();
	// Start interface on pin mousedown
	window.pinMainMove.activateInterfaceOnPinDown();
	// Start interface on pin enter
	window.interface.activateInterfaceOnPinEnter();
})();
