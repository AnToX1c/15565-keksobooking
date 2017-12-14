'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var map = document.querySelector('.map');
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

  var closePopup = function () {
    var popup = map.querySelector('.popup');
    if (popup) {
      map.removeChild(popup);
    }
    window.pin.clearActive();
  };
  window.showCard = function (target) {
    closePopup();
    target.parentElement.classList.add('map__pin--active');
    map.appendChild(window.card.render(window.pin.ads[target.dataset.id]));
    map.querySelector('.popup__close').addEventListener('mouseup', closePopup);
    map.querySelector('.popup__close').addEventListener('keydown', onPopupEnterPress);
    document.addEventListener('keydown', onPopupEscPress);
  };
})();
