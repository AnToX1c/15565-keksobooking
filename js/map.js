'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var minPosY = 100;
  var maxPosY = 500;

  var enablePins = function () {
    map.classList.remove('map--faded');
    mapPinMain.removeEventListener('mouseup', enablePins);
    window.form.enable();
    window.backend.load(onMapPinsLoad, window.onError);
  };

  window.form.disable();
  mapPinMain.addEventListener('mouseup', enablePins);
  mapPinMain.draggable = true;

  var onMapPinsLoad = function (data) {
    var operateMapPins = function (mapPinsElement) {
      var mapPins = map.querySelector('.map__pins');
      mapPins.appendChild(mapPinsElement);
      mapPins.addEventListener('click', function (evt) {
        window.pin.onPinClick(evt, data);
      });
      mapPins.addEventListener('keydown', function (evt) {
        window.pin.onPinPressEnter(evt, data);
      });
    };
    window.pin.render(data, operateMapPins);
  };

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
  window.onError = function (message) {
    var fragment = document.createDocumentFragment();
    var div = document.createElement('div');
    div.style = 'z-index: 4; min-width: 250px; position:fixed; height: 120px; top:150px; left:50%; transform: translateX(-50%); box-sizing: border-box; padding: 10px 10px 20px; border-radius: 5px; border-color: #ff6d51; background-color: rgba(255, 56, 35, .7); box-shadow: 0 0 10px 10px rgba(255, 86, 53, .7); font-weight: bold; color: #fff; text-align:center';
    var p = document.createElement('p');
    var p1 = document.createElement('p');
    p.textContent = message;
    p1.textContent = 'Попробуйте позже';
    div.appendChild(p);
    div.appendChild(p1);
    fragment.appendChild(div);
    document.querySelector('main').appendChild(fragment);
  };
})();
