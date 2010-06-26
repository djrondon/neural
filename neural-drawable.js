Neuron.prototype.draw = function(processing) {
  if (this.is_selected) {
    processing.no_fill();
    processing.stroke('#ccf');
    processing.circle(this.position.x, this.position.y, this.mass + 3);
  }
  
  if (this.is_being_dragged) {
    processing.no_fill();
    processing.stroke('#ffc');
    processing.circle(this.position.x, this.position.y, this.mass + 3);
  }
  
  processing.stroke('#222');
  processing.fill(this.membrane_potential > 0 ? '#fff' : this.color);
  processing.circle(this.position.x, this.position.y, this.mass);
  
  this.signal_history.en(this.membrane_potential);
};

Neuron.prototype.is_fixed = false;
Neuron.prototype.mass = 10;
Neuron.prototype.color = '#f00';

Neuron.prototype.position = {
  x: 0,
  y: 0
};

Neuron.prototype.velocity = {
  x: 0,
  y: 0
};

NeuralNetwork.entropy = 0;
NeuralNetwork.spring_stiffness = 0.8;
NeuralNetwork.spring_length = 100;
NeuralNetwork.particle_repulsion = 5;
NeuralNetwork.synapse_color = '#222';

NeuralNetwork.centroid = {
  x: 0,
  y: 0
};

NeuralNetwork.update_centroid = function() {
  var x_max = -1.7976931348623157E+10308;
  var x_min = 1.7976931348623157E+10308;
  var y_min = 1.7976931348623157E+10308;
  var y_max = -1.7976931348623157E+10308;
  
  for (var i in this.neurons) {
    var neuron = this.neurons[i];
    
    x_max = Math.max(x_max, neuron.position.x);
    x_min = Math.min(x_min, neuron.position.x);
    y_min = Math.min(y_min, neuron.position.y);
    y_max = Math.max(y_max, neuron.position.y);
  }
  
  var delta_x = x_max - x_min;
  var delta_y = y_max - y_min;
  
  this.centroid.x = x_min + 0.5 * delta_x;
  this.centroid.y = y_min + 0.5 * delta_y;
};

NeuralNetwork.draw = function(processing) {
  this.update_centroid();
  
  processing.translate(-processing.canvas.width / 2, -processing.canvas.height / 2);
  processing.translate(this.centroid.x, this.centroid.y);
  
  processing.stroke(this.synapse_color);
  processing.stroke_width(4);
  
  this.entropy = 0;
  
  for (var i in this.synapses) {
    var synapse = this.synapses[i];
    
    processing.line(synapse.one_end.position.x, synapse.one_end.position.y, synapse.other_end.position.x, synapse.other_end.position.y);
  }
  
  for (var i in this.neurons) {
    var neuron = this.neurons[i];
    
    neuron.draw(processing);
    
    neuron.velocity.x = 0;
    neuron.velocity.y = 0;
    
    for (var j in neuron.axon) {
      var other = neuron.axon[j]['neuron'];
      
      var dx = other.position.x - neuron.position.x;
      var dy = other.position.y - neuron.position.y;
      var l = Math.sqrt(dx * dx + dy * dy);
      var f = this.spring_stiffness * (l - this.spring_length); // 0.1 stiffness, 100 natlang
      neuron.velocity.x += (f * dx / l);
      neuron.velocity.y += (f * dy / l);
    }
    
    for (var j in neuron.dendrites) {
      var other = neuron.dendrites[j]['neuron'];
      
      var dx = neuron.position.x - other.position.x;
      var dy = neuron.position.y - other.position.y;
      var l = Math.sqrt(dx * dx + dy * dy);
      var f = this.spring_stiffness * (l - this.spring_length);
      
      neuron.velocity.x += (-f * dx / l);
      neuron.velocity.y += (-f * dy / l);
    }
    
    for (var j in this.neurons) {
      if (i == j) continue;
      
      var other = this.neurons[j];
      
      var dx = other.position.x - neuron.position.x;
      var dy = other.position.y - neuron.position.y;
      var r = Math.sqrt(dx * dx + dy * dy);
      
      if (r != 0) { // don't divide by zero
        var f = this.particle_repulsion * ((neuron.mass * other.mass) / (r * r));
        var vf = {
          x: -dx * f,
          y: -dy * f
        };
        
        neuron.velocity.x += vf.x;
        neuron.velocity.y += vf.y;
      }
    }
    // make the first neuron fixed
    var neuron = this.neurons[i];
    
    if (neuron.is_fixed) continue;
    
    neuron.position.x += neuron.velocity.x;
    neuron.position.y += neuron.velocity.y;
    
    this.entropy += Math.sqrt(neuron.velocity.x * neuron.velocity.x + neuron.velocity.y * neuron.velocity.y);
  }
};
