'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _filePluck = require('file-pluck');

var _filePluck2 = _interopRequireDefault(_filePluck);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

exports['default'] = function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$title = _ref.title;
  var title = _ref$title === undefined ? 'Style Guide' : _ref$title;

  var sections = {};

  // Module
  return {

    createSection: function createSection() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$name = _ref2.name;
      var name = _ref2$name === undefined ? null : _ref2$name;
      var _ref2$srcFiles = _ref2.srcFiles;
      var srcFiles = _ref2$srcFiles === undefined ? null : _ref2$srcFiles;
      var _ref2$delimiters = _ref2.delimiters;
      var // Glob

      delimiters = _ref2$delimiters === undefined ? {
        opening: '/***',
        closing: '***/',
        valueOpening: '{',
        valueClosing: '}'
      } : _ref2$delimiters;

      if (!name) return new Error('No name set on createSection');
      if (!srcFiles) return new Error('No source file(s) specified on createSection');

      var p = (0, _filePluck2['default'])(delimiters);

      return new Promise(function (resolve, reject) {
        p.pluckFile(srcFiles).then(function (snippets) {
          sections[name] = p.objectify(snippets);
          resolve(sections[name]);
        })['catch'](function (e) {
          return reject(e);
        });
      });
    },

    section: function section(name) {
      return sections[name];
    },

    allSections: function allSections() {
      return sections;
    },

    registerPartial: function registerPartial(name, file) {

      var partial = _fs2['default'].readFileSync(file, 'utf8', function (err, fileContent) {
        if (err) return err;
        return fileContent;
      });

      _handlebars2['default'].registerPartial(name, partial);
    },

    compile: function compile(file) {

      var template = _fs2['default'].readFileSync(file, 'utf8', function (err, fileContent) {
        if (err) return err;
        return fileContent;
      });

      var context = {
        title: title,
        sections: sections
      };

      return _handlebars2['default'].compile(template)(context);
    },

    make: function make(file, content) {
      _fs2['default'].writeFileSync(file, content, 'utf8', function (err) {
        if (err) console.error(err);
        console.log('Success!');
      });
    }

  };
};

;
module.exports = exports['default'];
