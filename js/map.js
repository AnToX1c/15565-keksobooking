'use strict';

(function () {
  var map = document.querySelector('.map');
  window.form.disable();
  map.querySelector('.map__pin--main').addEventListener('mouseup', window.form.enable);
})();
