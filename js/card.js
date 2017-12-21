'use strict';

(function () {
  var template = document.querySelector('template').content;
  var templatePopup = template.querySelector('article.popup');
  var RoomType = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };
  var getAmmountOfGuestsInRooms = function (guests, rooms) {
    var roomCases = [' комната', ' комнаты', ' комнат'];
    var cases = [2, 0, 1, 1, 1, 2];
    var roomString = roomCases[(rooms % 100 > 4 && rooms % 100 < 20) ? 2 : cases[(rooms % 10 < 5) ? rooms % 10 : 5]];
    var guestString = ((guests === 1) || (guests % 10 === 1)) ? ' гостя' : ' гостей';
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
      popupElement.querySelector('h4').textContent = RoomType[ad.offer.type];
      popupElement.querySelector('h4 ~ p').textContent = getAmmountOfGuestsInRooms(ad.offer.guests, ad.offer.rooms);
      popupElement.querySelector('h4 ~ p ~ p').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      popupElement.querySelector('ul.popup__features').innerHTML = ad.offer.features.map(generatePopupFeatures).join('');
      popupElement.querySelector('ul.popup__features + p').textContent = ad.offer.description;
      popupElement.querySelector('img.popup__avatar').src = ad.author.avatar;
      return popupElement;
    }
  };
})();
