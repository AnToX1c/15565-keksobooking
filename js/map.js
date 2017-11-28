'use strict';

var totalNumberOfAds = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'house', 'bungalo'];
var CHEKINS = ['12:00', '13:00', '14:00'];
var CHEKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ads = [];
var minPrice = 1000;
var maxPrice = 1000000;
var minNumberOfRooms = 1;
var maxNumberOfRooms = 5;
var minPosX = 300;
var maxPosX = 900;
var minPosY = 100;
var maxPosY = 500;
var PINWIDTH = 6;
var pinHeight = 40;

var generateAvatar = function (i) {
  return 'img/avatars/user0' + (i + 1) + '.png';
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateXYLocation = function () {
  return {
    x: getRandomInt(minPosX, maxPosX),
    y: getRandomInt(minPosY, maxPosY)
  };
};

var generateNumberOfRooms = function () {
  return getRandomInt(minNumberOfRooms, maxNumberOfRooms);
};

var getArrayOfRandomItems = function (arr) {
  var tempArr = [];
  var compareRandom = function () {
    return Math.random() - 0.5;
  };
  arr.sort(compareRandom);
  tempArr.length = getRandomInt(1, arr.length);
  tempArr = arr.slice(0, tempArr.length);
  return tempArr;
};

var createAds = function (i) {
  var location = generateXYLocation();
  var rooms = generateNumberOfRooms();

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
};

var chooseRoomType = function (roomType) {
  var type = roomType;
  if (type === 'flat') {
    type = 'Квартира';
  } else if (type === 'bungalo') {
    type = 'Бунгало';
  } else {
    type = 'Дом';
  }
  return type;
};

var getAmmountOfGuestsInRooms = function (guests, rooms) {
  var guestString = ' гостей';
  var roomString = '';
  if (guests === 1) {
    guestString = ' гостя';
  }
  if (rooms === 1) {
    roomString = ' комната';
  } else if (rooms <= 4) {
    roomString = ' комнаты';
  } else {
    roomString = ' комнат';
  }
  return rooms + roomString + ' для ' + guests + guestString;
};

var generatePopupFeatures = function (item) {
  return '<li class="feature feature--' + item + '"></li>';
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapPins = map.querySelector('.map__pins');
var template = document.querySelector('template').content;
var templateMapCard = template.querySelector('article.map__card');
var templateMapPin = template.querySelector('.map__pin');
var fragmentMapPin = document.createDocumentFragment();

var renderMapPins = function (ad) {
  var mapPinElement = templateMapPin.cloneNode(true);
  pinHeight = mapPinElement.querySelector('img').height;
  mapPinElement.style.left = ad.location.x - PINWIDTH + 'px';
  mapPinElement.style.top = ad.location.y - pinHeight + 'px';
  mapPinElement.querySelector('img').src = ad.author.avatar;
  return mapPinElement;
};

var renderMapCard = function (ad) {
  var mapCardElement = templateMapCard.cloneNode(true);
  mapCardElement.querySelector('h3').textContent = ad.offer.title;
  mapCardElement.querySelector('p>small').textContent = ad.offer.address;
  mapCardElement.querySelector('p.popup__price').innerHTML = ad.offer.price + '&#x20bd;' + '/ночь';
  mapCardElement.querySelector('h4').textContent = chooseRoomType(ad.offer.type);
  mapCardElement.querySelector('h4 ~ p').textContent = getAmmountOfGuestsInRooms(ad.offer.guests, ad.offer.rooms);
  mapCardElement.querySelector('h4 ~ p ~ p').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  mapCardElement.querySelector('ul.popup__features').innerHTML = ad.offer.features.map(generatePopupFeatures).join('');
  mapCardElement.querySelector('ul.popup__features + p').textContent = ad.offer.description;
  mapCardElement.querySelector('img.popup__avatar').src = ad.author.avatar;
  return mapCardElement;
};

for (var i = 0; i < totalNumberOfAds; i++) {
  ads[i] = createAds(i);
  fragmentMapPin.appendChild(renderMapPins(ads[i]));
}
mapPins.appendChild(fragmentMapPin);
map.appendChild(renderMapCard(ads[0]));
