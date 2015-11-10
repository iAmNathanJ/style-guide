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
    t.looseEqual(section, [{ name: 'First Style', usedFor: 'Stuff' }, { name: 'Second Style', usedFor: 'Other Stuff' }, { description: 'This is the first style', example: '<a href="the-first-style">#1</a>', name: 'First Style' }, { description: 'This is the second style', example: '<a href="the-second-style">#2</a>', name: 'Second Style' }], 'Successfully creates a section using glob');
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

  var allSections = [guide.createSection({
    name: 'Base Styles',
    srcFiles: 'test/main.css'
  }), guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/second.css'

  })];

  Promise.all(allSections).then(function (sections) {

    t.looseEqual(guide.section('Base Styles'), [{ name: 'First Style', usedFor: 'Stuff' }], 'section(sectionName) gets a single section');
    t.looseEqual(guide.allSections(), { 'Base Styles': [{ name: 'First Style', usedFor: 'Stuff' }], 'Second Styles': [{ name: 'Second Style', usedFor: 'Other Stuff' }] }, 'allSections() gets all sections');
  })['catch'](function (e) {
    return t.fail(e);
  });
});

(0, _tape2['default'])('build a template', function (t) {

  t.plan(1);

  var guide = (0, _2['default'])({
    title: 'My Style Guide'
  });

  var sections = [guide.createSection({
    name: 'Base Styles',
    srcFiles: 'test/target1.css'
  }), guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/target2.css'
  })];

  Promise.all(sections).then(function (sections) {

    guide.registerPartial('footer', 'test/partial.hbs');
    guide.registerPartial('partial2', 'test/partial2.hbs');

    var compiled = guide.compile('test/guide.hbs');

    guide.make('test/style-guide.html', compiled);

    t.equal(compiled, '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Style Guide</title>\n</head>\n<body>\n\n  <h1>My Style Guide</h1>\n\n    <section>\n    \n        <h2>Name: First Style</h2>\n        <p><strong>Description:</strong> This is the first style</p>\n        <code>&lt;a href&#x3D;&quot;the-first-style&quot;&gt;#1&lt;/a&gt;</code>\n    \n    </section>\n    <section>\n    \n        <h2>Name: Second Style</h2>\n        <p><strong>Description:</strong> This is the second style</p>\n        <code>&lt;a href&#x3D;&quot;the-second-style&quot;&gt;#2&lt;/a&gt;</code>\n    \n    </section>\n\n  PARTIAL !!! PARTIAL !!! PARTIAL !!! PARTIAL\n  PaRtiAl 2 !!! PaRtiAl 2 !!! PaRtiAl 2\n</body>\n</html>', 'Successfully comiles handlebars templates with partials');
  })['catch'](function (e) {
    return t.fail(e);
  });
});
