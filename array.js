var array_contains = function(array, obj) {
  var i = array.length;
  
  while (i--) 
    if (array[i] === obj) return true;
  
  return false;
};

var array_remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  
  array.length = from < 0 ? array.length + from : from;
  
  return array.push.apply(array, rest);
};
