'use strict';

(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var enablePins = function () {
    var operateMapPinsEventListeners = function (mapPins) {
      mapPinMain.removeEventListener('mouseup', enablePins);
      mapPins.addEventListener('click', window.pin.onPinClick);
      mapPins.addEventListener('keydown', window.pin.onPinPressEnter);
    };
    window.form.enable(operateMapPinsEventListeners);
  };
  window.form.disable();
  mapPinMain.addEventListener('mouseup', enablePins);
})();
