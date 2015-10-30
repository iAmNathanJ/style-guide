'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _ = require('../');

var _2 = _interopRequireDefault(_);

(0, _tape2['default'])('pluckStyle() by default should locate strings between "/***" and "***/"', function (t) {

  // Fresh Style Guide Instance
  var guide = (0, _2['default'])();

  var testString = '/*** THIS IS THE CONTENT ***/';

  t.equal(guide.pluckStyle(testString), 'THIS IS THE CONTENT');
  t.end();
});

(0, _tape2['default'])('pluckStyle({ ... }) should locate strings between the args `startOfStyle` and `endOfStyle`', function (t) {

  // Fresh Style Guide Instance
  var guide = (0, _2['default'])({
    startOfStyle: '/*---',
    endOfStyle: '---*/'
  });

  var testString = '/*--- THIS IS THE CONTENT ---*/';

  t.equal(guide.pluckStyle(testString), 'THIS IS THE CONTENT');
  t.end();
});
