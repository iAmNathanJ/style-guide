'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _ = require('../');

var _2 = _interopRequireDefault(_);

(0, _tape2['default'])('style-guide should be a thing', function (t) {

  var guide = (0, _2['default'])();

  t.ok(guide, 'guide exists!');
  t.end();
});
