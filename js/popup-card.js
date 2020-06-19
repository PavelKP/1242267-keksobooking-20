'use strict';

window.popupCard = (function () {
  // Return fragment with element (by copying child from parent)
  var addCopyElements = function (block, element, data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      // Clone element
      var elementClone = element.cloneNode(true);
      // Write src
      elementClone.src = data[i];
      // Append to fragment
      fragment.appendChild(elementClone);
    }
    // remove initial template element
    block.removeChild(element);
    return fragment;
  };

  // Return fragment with element (by creating <li>)
  var createList = function (data) {
    // Create empty fragment
    var fragment = document.createDocumentFragment();
    // Define basic class
    var basicClass = 'popup__feature';

    // Create New Element
    var templateElement = document.createElement('li');
    // Add basic class
    templateElement.classList.add(basicClass);

    for (var i = 0; i < data.length; i++) {
      var feature = data[i];

      var newElement = templateElement.cloneNode(true);
      // Add class modifier
      newElement.classList.add(basicClass + '--' + feature);
      newElement.textContent = feature;

      fragment.appendChild(newElement);
    }
    return fragment;
  };

  // Add simple text from data with checking for existence
  var addTextAndCheck = function (element, textData) {
    if (textData) {
      element.textContent = textData;
    } else {
      // Hide element
      element.hidden = true;
    }
  };

  // Create card
  var createCard = function (template, data) {
    var card = template.cloneNode(true);

    // Find elements
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capacity = card.querySelector('.popup__text--capacity');
    var time = card.querySelector('.popup__text--time');
    var featuresContainer = card.querySelector('.popup__features');
    var description = card.querySelector('.popup__description');
    var photosContainer = card.querySelector('.popup__photos');
    var photoItem = photosContainer.querySelector('.popup__photo');
    var avatar = card.querySelector('.popup__avatar');

    // Add title
    addTextAndCheck(title, data.offer.title);
    // Add address
    addTextAndCheck(address, data.offer.address);
    // Add price
    addTextAndCheck(price, data.offer.price);
    // Add price units
    price.insertAdjacentHTML('beforeend', ' ' + window.constants.PRICE_UNITS);
    // Add type of accommodation - use constant library to translate text
    addTextAndCheck(type, window.constants.TYPE_AND_PRICE_LIBRARY[data.offer.type].translation);
    // Add description
    addTextAndCheck(description, data.offer.description);
    // Add capacity
    if (data.offer.rooms && data.offer.guests) {
      capacity.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    } else {
      capacity.hidden = true;
    }
    // Add time
    if (data.offer.checkin && data.offer.checkout) {
      time.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    } else {
      time.hidden = true;
    }
    // Add features
    // Clear parent element from <li>
    featuresContainer.innerHTML = '';
    if (data.offer.features) {
      // Append fragment with created <li>
      featuresContainer.appendChild(createList(data.offer.features));
    } else {
      featuresContainer.hidden = true;
    }

    // Add photos
    if (data.offer.photos) {
      // Append photo to container .popup__photos
      photosContainer.appendChild(addCopyElements(photosContainer, photoItem, data.offer.photos));
    } else {
      photosContainer.hidden = true;
      // img alt can't be hidden if I hide only parent (?)
      photosContainer.children[0].hidden = true;
    }

    // Add avatar
    if (data.author.avatar) {
      // Append img elements to .popup__photos container
      avatar.src = data.author.avatar;
    } else {
      avatar.hidden = true;
    }

    return card;
  };

  // Find map
  var map = document.querySelector('.map');
  // Find card template
  var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

  // Close popup
  var closePopup = function () {
    // Find actual popup element
    var popup = map.querySelector('.map__card');
    // Hide card
    popup.hidden = true;
    // Remove ESC listener from document
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Callback to invoke closePopup() on ESC down
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      closePopup();
    }
  };

  // Show card - fetch card from array by id, put it in HTML, add listeners
  var showCard = function (evt) {
    // Catch click on img (not in main pin)
    var id;
    if (evt.target && evt.target.matches('.map__pin:not(.map__pin--main) img')) {
      // Find id in parent element
      id = evt.target.parentNode.dataset.id;
      // Catch click on button (not in main pin)
    } else if (evt.target && evt.target.matches('.map__pin:not(.map__pin--main)')) {
      // Find id in target element
      id = evt.target.dataset.id;
    }

    // Find a temporary element or previous created card
    var previous = map.querySelector('.map__card');
    // Check existence of id
    // If we click on pin--main, id will be empty
    if (id) {
      // Add card before .map__filters-container block
      map.replaceChild(window.popupCard.createCard(cardTemplate, window.interface[id]), previous);

      // Find popup close button
      var popupCloseButton = map.querySelector('.popup__close');

      // Add listener to close popup when click on button "X"
      popupCloseButton.addEventListener('click', function () {
        closePopup();
      });

      // Add listener to run callback on any key down (ESC close)
      document.addEventListener('keydown', onPopupEscPress);
    }
  };

  return {
    createCard: createCard,
    showCard: showCard
  };

})();
