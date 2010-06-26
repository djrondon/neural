var Processing = function(canvas) {
  if (!canvas || !canvas.getContext) return;
  
  this.canvas = canvas;
  
  var _this = this;
  var _main_loop;
  
  this.frame_rate = 24;
  this.frame_count = 0;
  this.context = this.canvas.getContext('2d');
  this.mouse_x = 0;
  this.mouse_y = 0;
  this.is_mouse_down;
  this.is_looping = false;
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  
  this.should_stroke = true;
  this.should_fill = true;
  
  this.no_stroke = function() {
    this.should_stroke = false;
  };
  
  this.no_fill = function() {
    this.should_fill = false;
  };
  
  this.stroke = function(color) {
    this.should_stroke = true;
    this.context.strokeStyle = color;
  };
  
  this.fill = function(color) {
    this.should_fill = true;
    this.context.fillStyle = color;
  };
  
  this.stroke_width = function(width) {
    this.context.lineWidth = width;
  };
  
  this.translate = function(x, y) {
    this.offset.x -= x;
    this.offset.y -= y;
    
    // console.log('translate (' + this.offset.x + ', ' + this.offset.y + ')');
  };
  
  this.offset = {
    x: 0,
    y: 0
  };
  
  this.size = function(width, height) {
    this.width = width;
    this.height = height;
    
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    this.context = this.canvas.getContext('2d');
  };
  
  this.line = function(x1, y1, x2, y2) {
    this.context.beginPath();
    this.context.moveTo(this.offset.x + x1, this.offset.y + y1);
    this.context.lineTo(this.offset.x + x2, this.offset.y + y2);
    this.context.closePath();
    
    if (this.should_stroke) this.context.stroke();
  };
  
  this.circle = function circle(x, y, radius) {
    if (typeof this.context.arc != 'function') return;
    
    this.context.beginPath();
    this.context.arc(this.offset.x + x, this.offset.y + y, radius, 0, Math.PI * 2, true);
    this.context.closePath();
    
    if (this.should_stroke) this.context.stroke();
    if (this.should_fill) this.context.fill();
  };
  
  this.draw = function() {
  };
  
  this.mouse_down = function() {
  };
  
  this.mouse_up = function() {
  };
  
  this.mouse_move = function() {
  };
  
  this.click = function() {
  };
  
  this.canvas.addEventListener('mousedown', function() {
    if (!_this.is_looping) return;
    
    _this.is_mouse_down = true;
    _this.mouse_down();
  }, false);
  
  this.canvas.addEventListener('mouseup', function() {
    if (!_this.is_looping) return;
    
    _this.is_mouse_down = false;
    _this.mouse_up();
  }, false);
  
  this.canvas.addEventListener('mousemove', function(event) {
    if (!_this.is_looping) return;
    
    if (event.pageX || event.pageY) {
      _this.mouse_x = event.pageX;
      _this.mouse_y = event.pageY;
    } else {
      _this.mouse_x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      _this.mouse_y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    _this.mouse_x -= _this.canvas.offsetLeft;
    _this.mouse_y -= _this.canvas.offsetTop;
    
    _this.mouse_x -= _this.offset.x;
    _this.mouse_y -= _this.offset.y;
    
    _this.mouse_move();
  }, false);
  
  this.canvas.addEventListener('click', function() {
    if (!_this.is_looping) return;
    
    _this.click();
  }, false);
  
  this.loop = function() { // main loop
    if (_main_loop) return; // don't want multiple intervals running
    _main_loop = setInterval(function() {
      _this.context.clearRect(0, 0, _this.context.canvas.width, _this.context.canvas.height);
      _this.offset.x = 0;
      _this.offset.y = 0;
      
      _this.stroke('#3f3f3f');
      
      var graph_spacing = 100;
      
      for (var i = 0; i < _this.width / graph_spacing; i++) {
        _this.line(0, graph_spacing * i, _this.width, graph_spacing * i);
        _this.line(graph_spacing * i, 0, graph_spacing * i, _this.height);
      }
      
      _this.draw();
      
      _this.frame_count++;
    }, 1000 / this.frame_rate);
    
    this.is_looping = true;
  };
  
  this.no_loop = function() {
    if (!_main_loop) return; // no need to stop what isn't running
    clearInterval(_main_loop);
    
    _main_loop = null;
    
    this.is_looping = false;
  };
  
  this.loop();
};
