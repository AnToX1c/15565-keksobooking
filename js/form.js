'use strict';

(function () {
  var map = document.querySelector('.map');
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormFieldset = noticeForm.querySelectorAll('fieldset');
  var addressField = noticeForm.querySelector('#address');
  var titleField = noticeForm.querySelector('#title');
  var priceField = noticeForm.querySelector('#price');
  var timeinField = noticeForm.querySelector('#timein');
  var timeoutField = noticeForm.querySelector('#timeout');
  var typeField = noticeForm.querySelector('#type');
  var capacityField = noticeForm.querySelector('#capacity');
  var roomNumberField = noticeForm.querySelector('#room_number');
  var onTimeinChange = function (evt) {
    timeoutField.value = evt.target.value;
  };
  var onTimeoutChange = function (evt) {
    timeinField.value = evt.target.value;
  };

  var onTypeChange = function (evt) {
    switch (evt.target.value) {
      case 'flat':
        priceField.min = 1000;
        break;
      case 'bungalo':
        priceField.min = 0;
        break;
      case 'house':
        priceField.min = 5000;
        break;
      case 'palace':
        priceField.min = 10000;
        break;
    }
  };

  var disableCapacityValues = function () {
    for (var i = 0; i < capacityField.length; i++) {
      capacityField.options[i].disabled = true;
    }
  };

  var onRoomNumberChange = function (evt) {
    disableCapacityValues();
    var capacityValue = (evt.target.value === '100') ? '0' : evt.target.value;
    for (var j = 0; j < capacityField.length; j++) {
      if (capacityField.options[j].value === capacityValue) {
        capacityField.selectedIndex = j;
        capacityField.options[j].disabled = false;
      }
      if (capacityField.options[j].value <= capacityValue && capacityField.options[j].value > 0) {
        capacityField.options[j].disabled = false;
      }
    }
  };

  var onTitleFieldInvalid = function (evt) {
    evt.target.style.borderColor = 'red';
    if (evt.target.validity.valueMissing) {
      evt.target.setCustomValidity('Обязательное поле');
    } else if (evt.target.validity.tooShort) {
      evt.target.setCustomValidity('Заголовок объявления должен состоять минимум из ' + evt.target.minLength + ' символов');
    } else if (evt.target.validity.tooLong) {
      evt.target.setCustomValidity('Заголовок объявления не должен превышать ' + evt.target.maxLength + ' символов');
    } else {
      evt.target.setCustomValidity('');
    }
  };
  noticeForm.setAttribute('action', 'https://js.dump.academy/keksobooking');
  titleField.addEventListener('invalid', onTitleFieldInvalid);
  window.form = {
    enable: function (callback) {
      map.classList.remove('map--faded');
      var mapPins = map.querySelector('.map__pins');
      mapPins.appendChild(window.pin.render(8));
      noticeForm.classList.remove('notice__form--disabled');
      for (var i = 0; i < noticeFormFieldset.length; i++) {
        noticeFormFieldset[i].disabled = false;
      }
      addressField.setAttribute('readonly', 'true');
      addressField.setAttribute('required', 'true');
      titleField.setAttribute('required', 'true');
      titleField.setAttribute('minlength', '30');
      titleField.setAttribute('maxlength', '100');
      priceField.setAttribute('required', 'true');
      priceField.setAttribute('value', '1000');
      priceField.setAttribute('min', '0');
      priceField.setAttribute('max', '1000000');
      disableCapacityValues();
      capacityField.selectedIndex = 2;
      capacityField.options[2].disabled = false;
      timeinField.addEventListener('change', onTimeinChange);
      timeoutField.addEventListener('change', onTimeoutChange);
      typeField.addEventListener('change', onTypeChange);
      roomNumberField.addEventListener('change', onRoomNumberChange);
      callback(mapPins);
    },
    disable: function () {
      for (var i = 0; i < noticeFormFieldset.length; i++) {
        noticeFormFieldset[i].disabled = true;
      }
    },
    updateAddress: function (mainPinX, mainPinY) {
      addressField.value = 'x: ' + mainPinX + ', y: ' + mainPinY;
    }
  };
})();
