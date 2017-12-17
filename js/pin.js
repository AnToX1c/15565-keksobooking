'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var templateMapPin = template.querySelector('.map__pin');

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
    render: function (arrOfPins, callback) {
      var fragmentMapPin = document.createDocumentFragment();
      for (var i = 0; i < arrOfPins.length; i++) {
        fragmentMapPin.appendChild(renderMapPin(arrOfPins[i], i));
      }
      callback(fragmentMapPin);
    },
    clearActive: function () {
      var activePin = map.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    },
    onPinClick: function (evt, data) {
      if (evt.target.dataset.id >= 0) {
        window.showCard(evt.target, data[evt.target.dataset.id]);
      }
    },
    onPinPressEnter: function (evt, data) {
      if (evt.keyCode === ENTER_KEYCODE) {
        var target = (evt.target.classList.contains('map__pin')) ? evt.target.firstChild : evt.target;
        window.showCard(target, data[target.dataset.id]);
      }
    }
  };
})();
