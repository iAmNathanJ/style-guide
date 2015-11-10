import test from 'tape';
import styleGuide from '../';


test('style-guide should be a thing', t => {

  let guide = styleGuide();

  t.ok( guide, 'guide exists!' );
  t.end();

});



test('style-guide createSection', t => {

  t.plan(5);

  let guide = styleGuide();

  t.equal(typeof guide.createSection, 'function', 'createSection is a function');

  // Create first section
  guide.createSection({
    name: 'Base Styles',
    srcFiles: 'test/main.css'
  
  }).then(section => {
    t.looseEqual(section, [{name: 'First Style', usedFor: 'Stuff'}], 'Successfully creates a section');
  
  }).catch(e => t.fail(e));

  
  // Create second section
  guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/second.css'
  
  }).then(section => {
    t.looseEqual(section, [{name: 'Second Style', usedFor: 'Other Stuff'}], 'Successfully creates a second section');
  
  }).catch(e => t.fail(e));


  // Create third section using glob
  guide.createSection({
    name: 'Glob',
    srcFiles: 'test/*.css'
  
  }).then(section => {
    t.looseEqual(section, [{name: 'First Style', usedFor: 'Stuff' }, { name: 'Second Style', usedFor: 'Other Stuff'}], 'Successfully creates a section using glob');
  
  }).catch(e => t.fail(e));


  // Create fourth section with custom delimiters
  guide.createSection({
    name: 'HTML Documentation',
    srcFiles: 'test/index.html',
    delimiters: {
      opening: '<!-- DOCS',
      closing: '/DOCS -->',
      valueOpening: '->',
      valueClosing: '\n\n',
    }
  }).then(section => {
    t.looseEqual(section, [{name: 'HTML Thing', about: 'Description'}], 'Successfully creates a section with custom delimiters');
  
  }).catch(e => t.fail(e));

});



test('style-guide getters', t => {
  t.plan(2);

  let guide = styleGuide();

  let sectionOne = guide.createSection({
    name: 'Base Styles',
    srcFiles: 'test/main.css'
  });

  let sectionTwo = guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/second.css'
  
  });

  Promise.all([sectionOne, sectionTwo])
  .then(sections => {
    t.looseEqual(guide.section('Base Styles'), [{name: 'First Style', usedFor: 'Stuff'}], 'section(sectionName) gets a single section');
    t.looseEqual(guide.allSections(), {'Base Styles': [{name: 'First Style', usedFor: 'Stuff'}], 'Second Styles': [{name: 'Second Style', usedFor: 'Other Stuff'}]}, 'allSections() gets all sections');
  
  }).catch(e => t.fail(e));

});



test('build a template', t => {

  t.plan(1);

  let guide = styleGuide();
  
  guide.registerPartial('footer', 'test/partial.hbs');
  guide.registerPartial('partial2', 'test/partial2.hbs');

  let compiled = guide.compile('test/guide.hbs', {title: 'This is the title', sections: {
      section1: {
        name: 'section1',
        description: 'This is section1 Description',
        example: '<a href="example1">Example 1</a>'
      },
      section2: {
        name: 'section2',
        description: 'This is section2 Description',
        example: '<a href="example2">Example 2</a>'
      }
    }});

  t.equal(compiled,
    `<!DOCTYPE html>\n<html>\n<head>\n  <title>Test Style Guide</title>\n</head>\n<body>\n\n  <h1>This is the title</h1>\n\n\n    <section>\n      <h2>Name: section1</h2>\n      <p><strong>Description:</strong> This is section1 Description</p>\n      <code>&lt;a href&#x3D;&quot;example1&quot;&gt;Example 1&lt;/a&gt;</code>\n    </section>\n\n\n    <section>\n      <h2>Name: section2</h2>\n      <p><strong>Description:</strong> This is section2 Description</p>\n      <code>&lt;a href&#x3D;&quot;example2&quot;&gt;Example 2&lt;/a&gt;</code>\n    </section>\n\n\n  PARTIAL !!! PARTIAL !!! PARTIAL !!! PARTIAL\n  PaRtiAl 2 !!! PaRtiAl 2 !!! PaRtiAl 2\n</body>\n</html>`, 
    'Successfully comiles handlebars templates with partials');
});
