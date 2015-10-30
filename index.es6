export default function styleGuide({
  
  startOfStyle = '/***',
  endOfStyle = '***/'
  
  } = {}) {

  return {

    pluckStyle(str) {
      var start = str.indexOf(startOfStyle) + startOfStyle.length
        , end   = str.indexOf(endOfStyle) - endOfStyle.length;
      return str.substr(start, end).trim();
    }
  
  };

};