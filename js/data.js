'use strict';

(function () {
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var generateAvatar = function (i) {
    return 'img/avatars/user0' + (i + 1) + '.png';
  };

  var generateXYLocation = function (minPosX, maxPosX, minPosY, maxPosY) {
    return {
      x: getRandomInt(minPosX, maxPosX),
      y: getRandomInt(minPosY, maxPosY)
    };
  };

  var getArrayOfRandomItems = function (arr) {
    var arrlength = 0;
    arrlength = getRandomInt(1, arr.length);
    var compareRandom = function () {
      return Math.random() - 0.5;
    };
    arr.sort(compareRandom);
    return arr.slice(0, arrlength);
  };

  window.data = {
    generateAds: function (i) {
      var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
      var TYPES = ['flat', 'house', 'bungalo'];
      var CHEKINS = ['12:00', '13:00', '14:00'];
      var CHEKOUTS = ['12:00', '13:00', '14:00'];
      var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
      var minPrice = 1000;
      var maxPrice = 1000000;
      var minNumberOfRooms = 1;
      var maxNumberOfRooms = 5;
      var minPosX = 300;
      var maxPosX = 900;
      var minPosY = 100;
      var maxPosY = 500;
      var location = generateXYLocation(minPosX, maxPosX, minPosY, maxPosY);
      var rooms = getRandomInt(minNumberOfRooms, maxNumberOfRooms);

      return {
        author: {
          avatar: generateAvatar(i)
        },
        offer: {
          title: TITLES[i],
          address: location.x + ',' + location.y,
          price: getRandomInt(minPrice, maxPrice),
          type: TYPES[getRandomInt(0, TYPES.length - 1)],
          rooms: rooms,
          guests: getRandomInt(1, rooms * 2),
          checkin: CHEKINS[getRandomInt(0, CHEKINS.length - 1)],
          checkout: CHEKOUTS[getRandomInt(0, CHEKOUTS.length - 1)],
          features: getArrayOfRandomItems(FEATURES),
          description: '',
          photos: []
        },
        location: location
      };
    }
  };

})();
