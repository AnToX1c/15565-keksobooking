'use strict';

(function () {
  window.synchronizeFields = function (targetElem, syncElem, targetArr, syncArr, callback) {
    targetElem.addEventListener('change', function (evt) {
      var indexOfValue = syncArr[targetArr.indexOf(evt.target.value)];
      var value = (indexOfValue !== -1) ? indexOfValue : evt.target.value;
      callback(syncElem, value);
    });
    syncElem.addEventListener('change', function (evt) {
      callback(targetElem, evt.target.value);
    });
  };
})();
