'use strict';

(function () {
  var MIN_POS_Y = 100;
  var MAX_POS_Y = 500;
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters');
  var prevTimer;
  var mainPinWidth = mapPinMain.offsetWidth;

  var enablePins = function () {
    map.classList.remove('map--faded');
    mapPinMain.removeEventListener('mouseup', enablePins);
    window.form.enable();
    window.backend.load(onMapPinsLoad, window.onError);
  };

  window.form.disable();
  mapPinMain.addEventListener('mouseup', enablePins);
  mapPinMain.draggable = true;

  var clearMap = function () {
    mapPins.querySelectorAll('.map__pin').forEach(function (node) {
      if (node.className === 'map__pin') {
        node.parentNode.removeChild(node);
      }
    });
  };

  var originDataPins = [];
  var filteredPins = [];
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');
  var checkHousingPrice = function (elem) {
    switch (housingPrice.value) {
      case 'middle':
        return elem >= 10000 && elem <= 50000;
      case 'low':
        return elem < 10000;
      case 'high':
        return elem > 50000;
    }
    return false;
  };
  var checkFeatures = function (features) {
    var arrayOfFeatures = Array.from(housingFeatures.querySelectorAll('input:checked'));
    return arrayOfFeatures.every(function (el) {
      return features.indexOf(el.value) >= 0;
    });
  };
  var selectFilters = function (elem) {
    return (housingType.value === 'any' || elem.offer.type === housingType.value)
     && (housingPrice.value === 'any' || checkHousingPrice(elem.offer.price))
      && (housingRooms.value === 'any' || String(elem.offer.rooms) === housingRooms.value)
      && (housingGuests.value === 'any' || String(elem.offer.guests) === housingGuests.value)
      && checkFeatures(elem.offer.features);
  };
  var onFiltersChange = function () {
    debounce(render);
  };

  var render = function () {
    filteredPins = originDataPins.filter(selectFilters);
    clearMap();
    window.pin.render(filteredPins, operateMapPins);
  };
  var operateMapPins = function (mapPinsElement) {
    mapPins.appendChild(mapPinsElement);
    mapPins.addEventListener('click', function (evt) {
      window.pin.onPinClick(evt, filteredPins);
    });
    mapPins.addEventListener('keydown', function (evt) {
      window.pin.onPinPressEnter(evt, filteredPins);
    });
  };

  var onMapPinsLoad = function (data) {
    originDataPins = data;
    filteredPins = data;
    mapFilters.addEventListener('change', onFiltersChange);
    window.pin.render(data, operateMapPins);
    window.form.updateAddress(parseInt(mapPinMain.offsetLeft, 10) + mainPinWidth / 2, parseInt(mapPinMain.offsetTop, 10));
  };

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();
    var setYLimit = function (posY) {
      if (posY < MIN_POS_Y) {
        return MIN_POS_Y;
      } else if (posY > MAX_POS_Y) {
        return MAX_POS_Y;
      }
      return posY;
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
      var mainPinY = parseInt(mapPinMain.style.top, 10);
      window.form.updateAddress(mainPinX, mainPinY);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onMainPinMouseDown);

  window.onError = function (message) {
    var fragment = document.createDocumentFragment();
    var div = document.createElement('div');
    div.classList.add('error-message');
    div.style = 'z-index: 4; min-width: 250px; position:fixed; height: 120px; top:150px; left:50%; transform: translateX(-50%); box-sizing: border-box; padding: 10px 10px 20px; border-radius: 5px; border-color: #ff6d51; background-color: rgba(255, 56, 35, .7); box-shadow: 0 0 10px 10px rgba(255, 86, 53, .7); font-weight: bold; color: #fff; text-align:center';
    var p = document.createElement('p');
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');
    p.textContent = 'Приносим извинения';
    p1.textContent = message;
    p2.textContent = 'Попробуйте позже';
    div.appendChild(p);
    div.appendChild(p1);
    div.appendChild(p2);
    fragment.appendChild(div);
    document.querySelector('main').appendChild(fragment);
    window.setTimeout(function () {
      document.querySelector('.error-message').style = 'display: none;';
    }, 3000);
  };

  var debounce = function (func) {
    window.clearTimeout(prevTimer);
    prevTimer = window.setTimeout(function () {
      func();
    }, 500);
  };
})();
