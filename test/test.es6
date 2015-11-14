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
    srcFiles: 'test/targets/main.css'
  
  }).then(section => {
    t.looseEqual(section, [{name: 'First Style', usedFor: 'Stuff'}], 'Successfully creates a section');
  
  }).catch(e => t.fail(e));

  
  // Create second section
  guide.createSection({
    name: 'Second Styles',
    srcFiles: 'test/targets/second.css'
  
  }).then(section => {
    t.looseEqual(section, [{name: 'Second Style', usedFor: 'Other Stuff'}], 'Successfully creates a second section');
  
  }).catch(e => t.fail(e));


  // Create third section using glob
  guide.createSection({
    name: 'Glob',
    srcFiles: 'test/targets/*.css'
  
  }).then(section => {
    t.looseEqual(section,
      [ { name: 'First Style', usedFor: 'Stuff' }, { name: 'Second Style', usedFor: 'Other Stuff' }, { code: '<h1>Heading</h1>', description: 'Description of the <h1> to <h6> tags.', example: '<h1>Heading</h1>\n<h2>Heading</h2>\n<h3>Heading</h3>\n<h4>Heading</h4>\n<h5>Heading</h5>\n<h6>Heading</h6>', name: 'Headings' }, { code: '<a href="#">This is a link.</a>', description: 'Description of the <a> tags.', example: '<a href="#">This is a link</a>', name: 'Anchors' }, { code: '<div class="card">\n  <p>\n    Literally direct trade 8-bit, poutine health goth tumblr offal leggings. YOLO quinoa fanny pack, fashion axe squid yuccie iPhone vegan street art tumblr. Tattooed tumblr pop-up viral literally.\n  </p>\n</div>', description: 'This is the description of the .card class', example: '<div class="card">\n  <p>\n    Literally direct trade 8-bit, poutine health goth tumblr offal leggings. YOLO quinoa fanny pack, fashion axe squid yuccie iPhone vegan street art tumblr. Tattooed tumblr pop-up viral literally.\n  </p>\n</div>', name: 'Card' }, { code: '<div class="full-width">\n  <p>\n    Literally direct trade 8-bit, poutine health goth tumblr offal leggings. YOLO quinoa fanny pack, fashion axe squid yuccie iPhone vegan street art tumblr. Tattooed tumblr pop-up viral literally.\n  </p>\n</div>', description: 'This is the description of the .full-width class', example: '<div class="full-width">\n  <p>\n    Literally direct trade 8-bit, poutine health goth tumblr offal leggings. YOLO quinoa fanny pack, fashion axe squid yuccie iPhone vegan street art tumblr. Tattooed tumblr pop-up viral literally.\n  </p>\n</div>', name: 'Full Width' } ],
      'Successfully creates a section using glob');
  
  }).catch(e => t.fail(e));


  // Create fourth section with custom delimiters
  guide.createSection({
    name: 'HTML Documentation',
    srcFiles: 'test/targets/index.html',
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

  let allSections = [
  
    guide.createSection({
      name: 'Base Styles',
      srcFiles: 'test/targets/main.css'
    }),

    guide.createSection({
      name: 'Second Styles',
      srcFiles: 'test/targets/second.css'
    
    })
  ];

  Promise.all(allSections).then(sections => {

    t.looseEqual(guide.section('Base Styles'), [{name: 'First Style', usedFor: 'Stuff'}], 'section(sectionName) gets a single section');
    t.looseEqual(guide.allSections(), {'Base Styles': [{name: 'First Style', usedFor: 'Stuff'}], 'Second Styles': [{name: 'Second Style', usedFor: 'Other Stuff'}]}, 'allSections() gets all sections');
  
  }).catch(e => t.fail(e));

});



test('build a template', t => {

  t.plan(1);

  let guide = styleGuide({
    title: 'My Style Guide'
  });
  
  let sections = [
    
    guide.createSection({
      name: 'Default Styles',
      srcFiles: 'test/targets/target1.css'
    }),

    guide.createSection({
      name: 'Helper Classes',
      srcFiles: 'test/targets/target2.css'
    })

  ];

  Promise.all(sections).then(sections => {

    guide.registerPartial('nav', 'test/templates/nav.hbs');
    guide.registerPartial('footer', 'test/templates/footer.hbs');

    let compiled = guide.compile('test/templates/guide.hbs');

    guide.make('test/style-guide.html', compiled);

    t.equal(compiled,
      `<!DOCTYPE html>\n<html>\n<head>\n  <title>My Style Guide</title>\n</head>\n<body>\n\n  <nav>\n    <a href="#default-styles">Base Styles</a>\n    <a href="#helper-classes">Second Styles</a>\n  </nav>  \n  <h1>My Style Guide</h1>\n\n  <section id="default-styles">\n    <h2>Default Styles</h2>\n    \n      <h3>Name: Headings</h2>\n      \n      <h4>Description</h4>\n      <p>Description of the &lt;h1&gt; to &lt;h6&gt; tags.</p>\n      \n      <h4>Example</h4>\n      <p><h1>Heading</h1>\n<h2>Heading</h2>\n<h3>Heading</h3>\n<h4>Heading</h4>\n<h5>Heading</h5>\n<h6>Heading</h6></p>\n      \n      <h4>Code</h4>\n      <p>\n        <pre>\n          <code>&lt;h1&gt;Heading&lt;/h1&gt;</code>\n        </pre>\n      </p>\n    \n    \n      <h3>Name: Anchors</h2>\n      \n      <h4>Description</h4>\n      <p>Description of the &lt;a&gt; tags.</p>\n      \n      <h4>Example</h4>\n      <p><a href="#">This is a link</a></p>\n      \n      <h4>Code</h4>\n      <p>\n        <pre>\n          <code>&lt;a href&#x3D;&quot;#&quot;&gt;This is a link.&lt;/a&gt;</code>\n        </pre>\n      </p>\n    \n  </section>\n\n  <section id="helper-classes">\n    <h2>Helper Classes</h2>\n    \n      <h3>Name: Card</h2>\n      \n      <h4>Description</h4>\n      <p>This is the description of the .card class</p>\n      \n      <h4>Example</h4>\n      <p><div class="card">\n  <p>\n    Literally direct trade 8-bit, poutine health goth tumblr offal leggings. YOLO quinoa fanny pack, fashion axe squid yuccie iPhone vegan street art tumblr. Tattooed tumblr pop-up viral literally.\n  </p>\n</div></p>\n      \n      <h4>Code</h4>\n      <p>\n        <pre>\n          <code>&lt;div class&#x3D;&quot;card&quot;&gt;\n  &lt;p&gt;\n    Literally direct trade 8-bit, poutine health goth tumblr offal leggings. YOLO quinoa fanny pack, fashion axe squid yuccie iPhone vegan street art tumblr. Tattooed tumblr pop-up viral literally.\n  &lt;/p&gt;\n&lt;/div&gt;</code>\n        </pre>\n      </p>\n    \n    \n      <h3>Name: Full Width</h2>\n      \n      <h4>Description</h4>\n      <p>This is the description of the .full-width class</p>\n      \n      <h4>Example</h4>\n      <p><div class="full-width">\n  <p>\n    Literally direct trade 8-bit, poutine health goth tumblr offal leggings. YOLO quinoa fanny pack, fashion axe squid yuccie iPhone vegan street art tumblr. Tattooed tumblr pop-up viral literally.\n  </p>\n</div></p>\n      \n      <h4>Code</h4>\n      <p>\n        <pre>\n          <code>&lt;div class&#x3D;&quot;full-width&quot;&gt;\n  &lt;p&gt;\n    Literally direct trade 8-bit, poutine health goth tumblr offal leggings. YOLO quinoa fanny pack, fashion axe squid yuccie iPhone vegan street art tumblr. Tattooed tumblr pop-up viral literally.\n  &lt;/p&gt;\n&lt;/div&gt;</code>\n        </pre>\n      </p>\n    \n  </section>\n\n  This is the footer\n</body>\n</html>`,
      'Successfully comiles handlebars templates with partials');
  
  }).catch(e => t.fail(e));

});
