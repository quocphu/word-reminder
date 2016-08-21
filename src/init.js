'use strict';
// Run copayApp after device is ready
angular.element(document).ready(function () {
  var startAngular = function () {
    angular.bootstrap(document, ['wordReminder']);
  };
  window.DbProvider.init(function (err) {
    if (err) {
      console.error('Init DB error');
    }

  });
});
