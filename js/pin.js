'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var templateMapPin = template.querySelector('.map__pin');
  var fragmentMapPin = document.createDocumentFragment();
  var renderMapPin = function (ad, index) {
    var mapPinElement = templateMapPin.cloneNode(true);
    var pinHeight = mapPinElement.querySelector('img').height;
    var pinWidth = mapPinElement.querySelector('img').width;
    mapPinElement.style.left = ad.location.x - pinWidth / 2 + 'px';
    mapPinElement.style.top = ad.location.y - pinHeight + 'px';
    mapPinElement.querySelector('img').src = ad.author.avatar;
    mapPinElement.querySelector('img').setAttribute('data-id', index);
    return mapPinElement;
  };

  window.pin = {
    ads: [],
    render: function (totalNumberOfAds) {
      for (var i = 0; i < totalNumberOfAds; i++) {
        window.pin.ads[i] = window.data.generateAds(i);
        fragmentMapPin.appendChild(renderMapPin(window.pin.ads[i], i));
      }
      return fragmentMapPin;
    },
    clearActive: function () {
      var activePin = map.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    },
    click: function (evt) {
      if (evt.target.dataset.id >= 0) {
        window.card.show(evt.target);
      }
    },
    pressEnter: function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        var target = (evt.target.classList.contains('map__pin')) ? evt.target.firstChild : evt.target;
        window.card.show(target);
      }
    }
  };
})();
