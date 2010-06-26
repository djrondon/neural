var Queue = function(max_size) {
  this.data = [];
  this.max_size = max_size;
  
  this.is_empty = function() {
    return (this.data.length == 0);
  };
  
  this.en = function(object) {
    if (this.max_size && this.data.length >= this.max_size) this.de();
    
    this.data.push(object);
  }
  
  this.de = function() {
    var result = this.data[0];
    this.data.splice(0, 1);
    return result;
  }
  
  this.peek = function() {
    return this.data[0];
  }
  
  this.clear = function() {
    this.data = [];
  }
  
  this.standard_deviation = function() {
    var sum = 0;
    
    for (var i in this.data) 
      sum += this.data[i];
    
    var mean = sum / this.data.length;
    var square_difference_sum = 0;
    
    for (var i in this.data) 
      square_difference_sum += Math.pow(this.data[i] - mean, 2);
    
    var standard_deviation = Math.sqrt(square_difference_sum / this.data.length);
    
    return standard_deviation;
  }
}

