'use strict';

(function () {
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
  var featuresFields = noticeForm.querySelectorAll('.features input[type=checkbox]');
  var fileChooser = noticeForm.querySelectorAll('.upload input[type=file]');
  var avatarFoto = noticeForm.querySelector('.notice__preview img');
  var fotoContainer = noticeForm.querySelector('.form__photo-container');
  var draggedItem = null;
  var syncValues = function (element, value) {
    element.value = value;
  };
  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  var disableCapacityValues = function () {
    for (var i = 0; i < capacityField.length; i++) {
      capacityField.options[i].disabled = true;
    }
  };

  var clearImages = function () {
    var fotoContainerImages = fotoContainer.querySelectorAll('img');
    fotoContainerImages.forEach(function (elem) {
      fotoContainer.removeChild(elem);
    });
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

  var setDefaultFormFields = function () {
    clearImages();
    disableCapacityValues();
    capacityField.selectedIndex = 2;
    capacityField.options[2].disabled = false;
    syncValues(titleField, '');
    syncValues(typeField, 'flat');
    syncValues(priceField, '1000');
    syncValueWithMin(priceField, '1000');
    syncValues(timeinField, '12:00');
    syncValues(timeoutField, '12:00');
    roomNumberField.selectedIndex = 0;
    featuresFields.forEach(function (elem) {
      elem.checked = false;
    });
    avatarFoto.src = 'img/muffin.png';
  };

  var onSubmit = function (evt) {
    window.backend.save(new FormData(noticeForm), setDefaultFormFields, window.onError);
    evt.preventDefault();
  };

  var renderAvatar = function (file) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      avatarFoto.src = reader.result;
    });
    reader.readAsDataURL(file);
  };

  var onDragOver = function (evt) {
    var target = evt.target;
    evt.dataTransfer.dropEffect = 'move';
    if (target && target !== draggedItem && target.nodeName === 'IMG') {
      target.parentNode.insertBefore(draggedItem, target.parentNode.children[1] !== target && target.nextSibling || target);
    }
    evt.preventDefault();
  };

  var onDragEnd = function (evt) {
    fotoContainer.style.outline = 'none';
    evt.preventDefault();
    fotoContainer.removeEventListener('dragover', onDragOver);
    fotoContainer.removeEventListener('dragend', onDragEnd);
  };

  var renderImages = function (file) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      var img = document.createElement('IMG');
      img.width = '280';
      img.height = '140';
      img.src = reader.result;
      img.style = 'cursor: move;';
      fotoContainer.appendChild(img);
      img.addEventListener('dragstart', function (evt) {
        draggedItem = evt.target;
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text/plain', evt.target.alt);
        fotoContainer.style.outline = '2px dashed red';
        fotoContainer.addEventListener('dragover', onDragOver);
        fotoContainer.addEventListener('dragend', onDragEnd);
      });
    });
    reader.readAsDataURL(file);
  };

  var onFileChooserChange = function (evt) {
    var file = evt.target.files[0];
    if (evt.target.id === 'avatar') {
      renderAvatar(file);
    } else if (evt.target.id === 'images') {
      renderImages(file);
    }
  };

  titleField.addEventListener('invalid', onTitleFieldInvalid);
  noticeForm.addEventListener('submit', onSubmit);

  window.form = {
    enable: function () {
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
      priceField.setAttribute('min', '0');
      priceField.setAttribute('max', '1000000');
      setDefaultFormFields();
      window.synchronizeFields(timeinField, timeoutField, ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);
      window.synchronizeFields(typeField, priceField, ['flat', 'bungalo', 'house', 'palace'], [1000, 0, 5000, 10000], syncValueWithMin);
      roomNumberField.addEventListener('change', onRoomNumberChange);
      fileChooser.forEach(function (elem) {
        elem.setAttribute('accept', 'image/*');
        elem.addEventListener('change', onFileChooserChange);
      });
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
