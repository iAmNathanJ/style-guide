import filePluck from 'file-pluck';

export default function({
  
  } = {}) {

  let sections = {};

  // Module 
  return {  

    createSection({

      name = null,
      srcFiles = null,

      delimiters = {
        opening: '/***',
        closing: '***/',
        valueOpening: '{',
        valueClosing: '}',
        keyValueSeparator: '---'
      }

    } = {}) {

      if(!name) return new Error('No name set on createSection');
      if(!srcFiles) return new Error('No source file(s) specified on createSection');

      let p = filePluck(delimiters);
      let getSnippets = p.pluckFile(srcFiles);
      
      return new Promise((resolve, reject) => {
        getSnippets.then(snippets => {
          sections[name] = p.pairUp(snippets);
          resolve(sections[name]);
        })
        .catch(e => reject(e));
      });

    },

    getSection(name) {
      return sections[name];
    },

    getAllSections() {
      return sections;
    }

  };

};