/* jslint node: true */
"use strict";

require('json.decycled');

String.format = format;
String.prototype.format = function(params){
  return format(this.toString(),params);
};
function format(string,params){
  var replaced = string;
  replaced = replaced.replace(/\·\{(.*)\}\·/gmi,function(match,capture,index,all){
    var replace;
    try {
      replace = eval(capture);
      replace = JSON.decycled(replace);
      if(typeof replace === 'string'){
        replace = replace.replace(/(^\"|\"$)/g,'').replace(/(\\n|\\r)/g,'\n').replace(/\\t/g,'\t');
      }
      return replace;
    } catch(error){
      return match;
    }
  });
  replaced = replaced.replace(/\{([a-z0-9\$\_]+(?:\.[a-z0-9\-\_]+)*)\}/gmi,function(match,capture,index,all){
    var replace;
    try {
      capture = '["'+capture.split('.').join('"]["')+'"]';
      replace = eval('params'+capture);
      replace = JSON.decycled(replace);
      if(typeof replace === 'string'){
        replace = replace.replace(/(^\"|\"$)/g,'').replace(/(\\n|\\r)/g,'\n').replace(/\\t/g,'\t');
      }
      return replace;
    } catch(error){
      return match;
    }
  });
  return replaced;
}