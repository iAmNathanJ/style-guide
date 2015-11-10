import filePluck from 'file-pluck';
import glob from 'glob';

// Utility - Get promise(glob)
let findFiles = (filePattern) => {
  return new Promise((resolve, reject) => {
    glob(filePattern, {}, (err, filesArray) => {
      if(err) reject(err);
      resolve(filesArray);
    });
  });
};

export default function() {

  let sections = {}
    , render = (template, context) => {
        
      };

  // Module 
  return {

    createSection({

      name = null,
      srcFiles = null, // Glob

      delimiters = {
        opening: '/***',
        closing: '***/',
        valueOpening: '{',
        valueClosing: '}'
      }

    } = {}) {

      if(!name) return new Error('No name set on createSection');
      if(!srcFiles) return new Error('No source file(s) specified on createSection');

      let p = filePluck(delimiters);
      
      return new Promise((resolve, reject) => {
        findFiles(srcFiles)
        .then(files => p.pluckFiles(files) )
        .then(snippets => {
          sections[name] = p.pairUp(snippets);
          resolve(sections[name]);
        })
        .catch(e => reject(e));
      });
    },

    section(name) {
      return sections[name];
    },

    allSections() {
      return sections;
    }

  };

};