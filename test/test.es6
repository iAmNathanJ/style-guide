import test from 'tape';
import styleGuide from '../';


test('style-guide should be a thing', t => {

  let guide = styleGuide();

  t.ok( guide, 'guide exists!' );
  t.end();

});