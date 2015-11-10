import fs from 'fs';
import filePluck from 'file-pluck';
import glob from 'glob';
import hbs from 'handlebars';

// Utility - file glob -> promise(array)
let findFiles = (filePattern) => {
  return new Promise((resolve, reject) => {
    glob(filePattern, {}, (err, filesArray) => {
      if(err) reject(err);
      resolve(filesArray);
    });
  });
};

export default function({

  title = 'Style Guide'

} = {}) {

  let sections = {};

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
    },

    registerPartial(name, file) {

      let partial = fs.readFileSync(file, 'utf8', (err, fileContent) => {
        if(err) return err;
        return fileContent;
      });

      hbs.registerPartial(name, partial);
    },

    compile(file) {
      
      let template = fs.readFileSync(file, 'utf8', (err, fileContent) => {
        if(err) return err;
        return fileContent;
      });

      let context = {
        title: title,
        sections: sections
      };
      
      return hbs.compile(template)(context);
    },

    make(file, content) {
      fs.writeFileSync(file, content, 'utf8', (err) => {
        if(err) console.error(err);
        console.log('Success!');
      });
    }

  };

};