'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = styleGuide;

function styleGuide() {

  var startOfStyle = '/***',
      endOfStyle = '***/';

  return {

    pluckStyle: function pluckStyle(str) {

      // get first instance of '/***'
      var start = str.indexOf(startOfStyle) + 4;

      // get first instance of '***/'
      var end = str.indexOf(endOfStyle) - 4;

      return str.substr(start, end).trim();
    }

  };
}

;
module.exports = exports['default'];
