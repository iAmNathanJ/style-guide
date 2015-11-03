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

(0, _tape2['default'])('style-guide createSection', function (t) {

  t.plan(4);

  var guide = (0, _2['default'])();

  t.equal(typeof guide.createSection, 'function', 'createSection is a function');

  // Create first section
  guide.createSection({
    name: 'Base Styles',
    srcFiles: 'test/main.css'

  }).then(function (section) {
    t.looseEqual(section, [{ name: 'First Style', usedFor: 'Stuff' }]);
  })['catch'](function (e) {
    return t.fail(e);
  });

  // Create second section
  guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/second.css'

  }).then(function (section) {
    t.looseEqual(section, [{ name: 'Second Style', usedFor: 'Other Stuff' }]);
  })['catch'](function (e) {
    return t.fail(e);
  });

  // Create third section with custom delimiters
  guide.createSection({
    name: 'HTML Documentation',
    srcFiles: 'test/index.html',
    delimiters: {
      opening: '<!-- DOCS',
      closing: '/DOCS -->',
      valueOpening: '->',
      valueClosing: '\n\n'
    }
  }).then(function (section) {
    console.log(section);
    t.looseEqual(section, [{ name: 'HTML Thing', about: 'Description' }]);
  })['catch'](function (e) {
    return t.fail(e);
  });
});
