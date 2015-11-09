'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError('Cannot destructure undefined'); }

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
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _objectDestructuringEmpty(_ref);

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

    getSection: function getSection(name) {
      return sections[name];
    },

    getAllSections: function getAllSections() {
      return sections;
    }

  };
};

;
module.exports = exports['default'];
