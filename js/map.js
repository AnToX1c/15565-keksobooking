'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var ads = [];

  var generateAvatar = function (i) {
    return 'img/avatars/user0' + (i + 1) + '.png';
  };

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

  var generateAds = function (i) {
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
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormFieldset = noticeForm.querySelectorAll('fieldset');
  var template = document.querySelector('template').content;
  var templatePopup = template.querySelector('article.popup');
  var templateMapPin = template.querySelector('.map__pin');
  var fragmentMapPin = document.createDocumentFragment();

  var renderMapPinElement = function (ad, item) {
    var mapPinElement = templateMapPin.cloneNode(true);
    var pinHeight = mapPinElement.querySelector('img').height;
    var pinWidth = mapPinElement.querySelector('img').width;
    mapPinElement.style.left = ad.location.x - pinWidth / 2 + 'px';
    mapPinElement.style.top = ad.location.y - pinHeight + 'px';
    mapPinElement.querySelector('img').src = ad.author.avatar;
    mapPinElement.querySelector('img').setAttribute('data-id', item);
    return mapPinElement;
  };

  var renderMapCard = function (ad) {
    var popupElement = templatePopup.cloneNode(true);
    popupElement.querySelector('h3').textContent = ad.offer.title;
    popupElement.querySelector('p>small').textContent = ad.offer.address;
    popupElement.querySelector('p.popup__price').innerHTML = ad.offer.price + '&#x20bd;' + '/ночь';
    popupElement.querySelector('h4').textContent = chooseRoomType(ad.offer.type);
    popupElement.querySelector('h4 ~ p').textContent = getAmmountOfGuestsInRooms(ad.offer.guests, ad.offer.rooms);
    popupElement.querySelector('h4 ~ p ~ p').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    popupElement.querySelector('ul.popup__features').innerHTML = ad.offer.features.map(generatePopupFeatures).join('');
    popupElement.querySelector('ul.popup__features + p').textContent = ad.offer.description;
    popupElement.querySelector('img.popup__avatar').src = ad.author.avatar;
    return popupElement;
  };

  var renderMapPins = function (totalNumberOfAds) {
    for (var i = 0; i < totalNumberOfAds; i++) {
      ads[i] = generateAds(i);
      fragmentMapPin.appendChild(renderMapPinElement(ads[i], i));
    }
    return fragmentMapPin;
  };

  var clearMapPinActive = function () {
    var activePin = map.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var onPinClick = function (evt) {
    if (evt.target.dataset.id >= 0) {
      showPopup(evt.target);
    }
  };

  var onPinEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      var target = (evt.target.classList.contains('map__pin')) ? evt.target.firstChild : evt.target;
      showPopup(target);
    }
  };

  var onPopupEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup(evt);
    }
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var showPopup = function (target) {
    closePopup();
    target.parentElement.classList.add('map__pin--active');
    map.appendChild(renderMapCard(ads[target.dataset.id]));
    map.querySelector('.popup__close').addEventListener('mouseup', closePopup);
    map.querySelector('.popup__close').addEventListener('keydown', onPopupEnterPress);
    document.addEventListener('keydown', onPopupEscPress);
  };
  var closePopup = function () {
    var popup = map.querySelector('.popup');
    if (popup) {
      map.removeChild(popup);
    }
    clearMapPinActive();
  };

  var disableForm = function () {
    for (var i = 0; i < noticeFormFieldset.length; i++) {
      noticeFormFieldset[i].disabled = true;
    }
  };
  var enableForm = function () {
    map.classList.remove('map--faded');
    var mapPins = map.querySelector('.map__pins');
    mapPins.appendChild(renderMapPins(8));
    noticeForm.classList.remove('notice__form--disabled');
    for (var i = 0; i < noticeFormFieldset.length; i++) {
      noticeFormFieldset[i].disabled = false;
    }
    map.querySelector('.map__pin--main').removeEventListener('mouseup', enableForm);
    mapPins.addEventListener('click', onPinClick);
    mapPins.addEventListener('keydown', onPinEnterPress);
  };

  disableForm();
  map.querySelector('.map__pin--main').addEventListener('mouseup', enableForm);
})();
