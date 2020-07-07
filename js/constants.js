'use strict';

window.constants = (function () {
  return {
    MIN_AVATAR_NUMBER: 1,
    MAX_AVATAR_NUMBER: 8,
    TITLE: 'Lorem ipsum dolor sit amet, consectetur',
    PRICE: 9999,
    PRICE_UNITS: '₽/ночь',
    TYPE: ['palace', 'flat', 'house', 'bungalo'],
    MIN_ROOMS: 1,
    MAX_ROOMS: 5,
    MIN_GUESTS: 1,
    MAX_GUESTS: 10,
    CHECKIN_TIMES: ['12:00', '13:00', '14:00'],
    CHECKOUT_TIMES: ['12:00', '13:00', '14:00'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    DESCRIPTION: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,
    ADVERTS_AMOUNT: 8,
    TYPE_AND_PRICE_LIBRARY: {
      flat: {
        translation: 'Квартира',
        minPrice: 1000
      },
      palace: {
        translation: 'Дворец',
        minPrice: 10000
      },
      house: {
        translation: 'Дом',
        minPrice: 5000
      },
      bungalo: {
        translation: 'Бунгало',
        minPrice: 0
      }
    },
    SERVER_URL_RECEIVE: 'https://javascript.pages.academy/keksobooking/data',
    SERVER_URL_SEND: 'https://javascript.pages.academy/keksobooking',
    MAX_ADVERT_AMOUNT: 5
  };
})();
