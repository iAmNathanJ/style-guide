'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _filePluck = require('file-pluck');

var _filePluck2 = _interopRequireDefault(_filePluck);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

// Utility - Get promise(glob)
var findFiles = function findFiles(filePattern) {
  return new Promise(function (resolve, reject) {
    (0, _glob2['default'])(filePattern, {}, function (err, filesArray) {
      if (err) reject(err);
      resolve(filesArray);
    });
  });
};

exports['default'] = function () {

  var sections = {},
      render = function render(template, context) {};

  // Module
  return {

    createSection: function createSection() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$name = _ref.name;
      var name = _ref$name === undefined ? null : _ref$name;
      var _ref$srcFiles = _ref.srcFiles;
      var srcFiles = _ref$srcFiles === undefined ? null : _ref$srcFiles;
      var _ref$delimiters = _ref.delimiters;
      var // Glob

      delimiters = _ref$delimiters === undefined ? {
        opening: '/***',
        closing: '***/',
        valueOpening: '{',
        valueClosing: '}'
      } : _ref$delimiters;

      if (!name) return new Error('No name set on createSection');
      if (!srcFiles) return new Error('No source file(s) specified on createSection');

      var p = (0, _filePluck2['default'])(delimiters);

      return new Promise(function (resolve, reject) {
        findFiles(srcFiles).then(function (files) {
          return p.pluckFiles(files);
        }).then(function (snippets) {
          sections[name] = p.pairUp(snippets);
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
    }

  };
};

;
module.exports = exports['default'];
