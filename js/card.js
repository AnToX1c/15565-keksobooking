'use strict';

(function () {
  var template = document.querySelector('template').content;
  var templatePopup = template.querySelector('article.popup');
  var chooseRoomType = function (roomType) {
    var type = roomType;
    switch (type) {
      case 'flat':
        type = 'Квартира';
        break;
      case 'bungalo':
        type = 'Бунгало';
        break;
      case 'house':
        type = 'Дом';
        break;
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
  window.card = {
    render: function (ad) {
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
    }
  };
})();
