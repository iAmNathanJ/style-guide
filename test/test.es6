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
    t.looseEqual(section, [{name: 'First Style', usedFor: 'Stuff'}]);
  
  }).catch(e => t.fail(e));

  
  // Create second section
  guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/second.css'
  
  }).then(section => {
    t.looseEqual(section, [{name: 'Second Style', usedFor: 'Other Stuff'}]);
  
  }).catch(e => t.fail(e));


  // Create third section using glob
  guide.createSection({
    name: 'Glob',
    srcFiles: 'test/*.css'
  
  }).then(section => {
    t.looseEqual(section, [{name: 'First Style', usedFor: 'Stuff' }, { name: 'Second Style', usedFor: 'Other Stuff'}]);
  
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
    t.looseEqual(section, [{name: 'HTML Thing', about: 'Description'}]);
  
  }).catch(e => t.fail(e));

});



test('style-guide getters', t => {
  t.plan(2);

  let guide = styleGuide();

  // Create first section
  guide.createSection({
    name: 'Base Styles',
    srcFiles: 'test/main.css'
  
  }).then(section => {
    t.looseEqual(guide.section('Base Styles'), [{name: 'First Style', usedFor: 'Stuff'}]);
  
  }).catch(e => t.fail(e));

  
  // Create second section
  guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/second.css'
  
  }).then(section => {
    t.looseEqual(guide.allSections(), {'Base Styles': [{name: 'First Style', usedFor: 'Stuff'}], 'Second Styles': [{name: 'Second Style', usedFor: 'Other Stuff'}]});
  
  }).catch(e => t.fail(e));

});
