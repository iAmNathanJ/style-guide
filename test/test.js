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

  t.plan(5);

  var guide = (0, _2['default'])();

  t.equal(typeof guide.createSection, 'function', 'createSection is a function');

  // Create first section
  guide.createSection({
    name: 'Base Styles',
    srcFiles: 'test/main.css'

  }).then(function (section) {
    t.looseEqual(section, [{ name: 'First Style', usedFor: 'Stuff' }], 'Successfully creates a section');
  })['catch'](function (e) {
    return t.fail(e);
  });

  // Create second section
  guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/second.css'

  }).then(function (section) {
    t.looseEqual(section, [{ name: 'Second Style', usedFor: 'Other Stuff' }], 'Successfully creates a second section');
  })['catch'](function (e) {
    return t.fail(e);
  });

  // Create third section using glob
  guide.createSection({
    name: 'Glob',
    srcFiles: 'test/*.css'

  }).then(function (section) {
    t.looseEqual(section, [{ name: 'First Style', usedFor: 'Stuff' }, { name: 'Second Style', usedFor: 'Other Stuff' }], 'Successfully creates a section using glob');
  })['catch'](function (e) {
    return t.fail(e);
  });

  // Create fourth section with custom delimiters
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
    t.looseEqual(section, [{ name: 'HTML Thing', about: 'Description' }], 'Successfully creates a section with custom delimiters');
  })['catch'](function (e) {
    return t.fail(e);
  });
});

(0, _tape2['default'])('style-guide getters', function (t) {
  t.plan(2);

  var guide = (0, _2['default'])();

  // Create first section
  // guide.createSection({
  //   name: 'Base Styles',
  //   srcFiles: 'test/main.css'

  // }).then(section => {
  //   t.looseEqual(guide.section('Base Styles'), [{name: 'First Style', usedFor: 'Stuff'}], 'section(sectionName) gets a single section');

  // }).catch(e => t.fail(e));

  // Create second section
  // guide.createSection({
  //   name: 'Second Styles',
  //   srcFiles: 'test/second.css'

  // }).then(section => {
  //   t.looseEqual(guide.allSections(), {'Base Styles': [{name: 'First Style', usedFor: 'Stuff'}], 'Second Styles': [{name: 'Second Style', usedFor: 'Other Stuff'}]});

  // }).catch(e => t.fail(e));

  var sectionOne = guide.createSection({
    name: 'Base Styles',
    srcFiles: 'test/main.css'
  });

  var sectionTwo = guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/second.css'

  });

  Promise.all([sectionOne, sectionTwo]).then(function (sections) {
    t.looseEqual(guide.section('Base Styles'), [{ name: 'First Style', usedFor: 'Stuff' }], 'section(sectionName) gets a single section');
    t.looseEqual(guide.allSections(), { 'Base Styles': [{ name: 'First Style', usedFor: 'Stuff' }], 'Second Styles': [{ name: 'Second Style', usedFor: 'Other Stuff' }] }, 'allSections() gets all sections');
  })['catch'](function (e) {
    return t.fail(e);
  });
});
