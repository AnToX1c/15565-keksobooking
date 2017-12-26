'use strict';

(function () {
  var template = document.querySelector('template').content;
  var templatePopup = template.querySelector('article.popup');
  var RoomType = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };
  var getAmountOfGuestsInRooms = function (guests, rooms) {
    var RoomCase = {
      ONE: ' комната',
      TWO: ' комнаты',
      MULTIPLY: ' комнат'
    };
    var GuestCase = {
      ONE: ' гостя',
      TWO: ' гостей',
      MULTIPLY: ' гостей'
    };
    var pluralizeWord = function (count, cases) {
      var isSingleEnding = function (n) {
        return n % 10 === 1 && n % 100 !== 11;
      };
      var isMultipleEnding = function (n) {
        return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20);
      };
      if (isSingleEnding(count)) {
        return cases.ONE;
      } else if (isMultipleEnding(count)) {
        return cases.TWO;
      } else {
        return cases.MULTIPLY;
      }
    };
    return rooms + pluralizeWord(rooms, RoomCase) + ' для ' + guests + pluralizeWord(guests, GuestCase);
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
      popupElement.querySelector('h4').textContent = RoomType[ad.offer.type];
      popupElement.querySelector('h4 ~ p').textContent = getAmountOfGuestsInRooms(ad.offer.guests, ad.offer.rooms);
      popupElement.querySelector('h4 ~ p ~ p').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      popupElement.querySelector('ul.popup__features').innerHTML = ad.offer.features.map(generatePopupFeatures).join('');
      popupElement.querySelector('ul.popup__features + p').textContent = ad.offer.description;
      popupElement.querySelector('img.popup__avatar').src = ad.author.avatar;
      return popupElement;
    }
  };
})();
