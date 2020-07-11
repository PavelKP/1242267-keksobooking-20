'use strict';

(function () {
  // Define file types
  var FILE_TYPES = ['png', 'jpeg', 'jpg'];

  // Define preview function
  window.preview = function (fileChooser, image) {

    fileChooser.addEventListener('change', function () {
      // Choose first file
      var file = fileChooser.files[0];
      // Chose file name and convert to lower case
      var fileName = file.name.toLowerCase();

      // If end of file matches with any el from FILE_TYPES return true
      var matches = FILE_TYPES.some(function (type) {
        return fileName.endsWith(type);
      });

      // Run fileReader if filetype is ok
      if (matches) {
        // Get copy of FileReader object
        var reader = new FileReader();

        // Callback will run after reader loads (read) file
        reader.addEventListener('load', function () {
          image.src = reader.result;
        });

        // Start reader (asynchronous???)
        // Pass file pseudo object
        reader.readAsDataURL(file);

      } else {
        // Show error
        window.utils.showMessagePopup('Выбран неправильный формат файла', 'error');
      }

    });

  };

})();
