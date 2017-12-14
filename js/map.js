'use strict';

(function () {
  // var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var minPosY = 100;
  var maxPosY = 500;

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
  mapPinMain.draggable = true;

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();
    var mainPinHeight = mapPinMain.offsetHeight;
    var mainPinWidth = mapPinMain.offsetWidth;
    var setYLimit = function (posY) {
      if (posY < minPosY) {
        return minPosY;
      } else if (posY > maxPosY) {
        return maxPosY;
      } else {
        return posY;
      }
    };
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      mapPinMain.style.top = setYLimit(mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      var mainPinX = parseInt(mapPinMain.style.left, 10) + mainPinWidth / 2;
      var mainPinY = parseInt(mapPinMain.style.top, 10) + mainPinHeight;
      window.form.updateAddress(mainPinX, mainPinY);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onMainPinMouseDown);
})();
