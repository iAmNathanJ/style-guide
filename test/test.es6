import test from 'tape';
import styleGuide from '../';


test('pluckStyle() by default should locate strings between "/***" and "***/"', t => {

  // Fresh Style Guide Instance
  let guide = styleGuide();

  let testString = '/*** THIS IS THE CONTENT ***/';

  t.equal( guide.pluckStyle(testString), 'THIS IS THE CONTENT' );
  t.end();

});

test('pluckStyle({ ... }) should locate strings between the args `startOfStyle` and `endOfStyle`', t => {

  // Fresh Style Guide Instance
  let guide = styleGuide({
    startOfStyle: '/*---',
    endOfStyle: '---*/'
  });
  debugger;

  let testString = '/*--- THIS IS THE CONTENT ---*/';

  t.equal( guide.pluckStyle(testString), 'THIS IS THE CONTENT' );
  t.end();

});