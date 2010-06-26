// TODO: add alpha support
// TODO: set r, g, b
// TODO: from rgb(a)
var Color = function(hex) {
  var value = hex.toLowerCase() || '#000';
  
  this.to_hex = function() {
    return value;
  };
};

Color.prototype.compress_hex = function() {
  var value = this.to_hex();
  
  if (value.length == 4) return;
  
  var compressed_hex = '#';
  var can_compress = true;
  
  for (var i = 1; i < value.length; i += 2) {
    if (value[i] !== value[i + 1]) can_compress = false;
    
    compressed_hex += value[i];
  }
  
  return can_compress ? compressed_hex : value;
};

Color.prototype.expand_hex = function() {
  var value = this.to_hex();
  
  if (value.length != 4) return;
  
  var expanded_hex = '#';
  
  for (var i = 1; i < value.length; i++) 
    expanded_hex += value[i] + value[i];
  
  return expanded_hex;
};

Color.prototype.get_red = function() {
  return parseInt(this.expand_hex().substring(1).substring(0, 2), 16);
};

Color.prototype.get_green = function() {
  return parseInt(this.expand_hex().substring(1).substring(2, 4), 16);
};

Color.prototype.get_blue = function() {
  return parseInt(this.expand_hex().substring(1).substring(4, 6), 16);
};

Color.prototype.to_rgb = function() {
  return 'rgb(' + this.red() + ', ' + this.green() + ', ' + this.blue() + ')';
};

Color.from_rgb = function(red, green, blue) {

};

Color.random = function(palette) {
  var letters = (palette || '0123456789abcdef').split('');
  var hex = '#';
  
  for (var i = 0; i < 6; i++) 
    hex += letters[Math.floor(Math.random() * letters.length)];
  
  return new Color(hex);
};
