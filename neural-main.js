// TODO: synapse history: 
//       vertical middle should be 0 with upper positive and lower negative scaled relative to max/min signals in the queues of all selected neurons
//       only create synapse history queues on selected neurons to save on memory consumption (destroy on de-selection)
//       graph on canvas with configurable size drawn relative to offset (bar graphs can scroll using offset with spacing set at 1 second)
//		   change to line graph
// TODO: means of visualizing synapse weights and neuron thresholds?
// TODO: membrane potential color variance
// TODO: encapsulate classes
var vision = [];

for (var i = 0; i < 3; i++) 
  vision.push(0);

vision.push(1);
vision.push(1);
vision.push(0);

for (var i = 0; i < 3; i++) 
  vision.push(0);

var base = NeuralNetwork.create_neuron(); // base (just to hold things in place)
for (var i in vision) // photoreceptors
   NeuralNetwork.create_neuron();

var ganglion;

for (var i in NeuralNetwork.neurons) { // ganglions
  if (i == 0) continue;
  
  if (i % 3 == 1) {
    ganglion = NeuralNetwork.create_neuron();
    NeuralNetwork.create_synapse(ganglion, base, 1);
  }
  
  var photoreceptor = NeuralNetwork.neurons[i];
  
  switch (i % 3) {
    case 0:
      NeuralNetwork.create_synapse(photoreceptor, ganglion, -0.5);
      break;
    case 1:
      NeuralNetwork.create_synapse(photoreceptor, ganglion, -0.5);
      break;
    case 2:
      NeuralNetwork.create_synapse(photoreceptor, ganglion, 1); // the center
      break;
  }
}

$(function() {
  var canvas = document.getElementById('main-canvas');
  var processing = new Processing(canvas);
  
  var $frame_count = $('dt#frame-count').next('dd');
  var $entropy_value = $('dt#entropy').next('dd');
  
  processing.size(700, 560);
  processing.offset = {
    x: processing.canvas.width,
    y: processing.canvas.height
  };
  
  for (var i in NeuralNetwork.neurons) {
    NeuralNetwork.neurons[i].position = {
      x: Math.random(),
      y: Math.random()
    };
    
    NeuralNetwork.neurons[i].color = Color.random('56789abc').to_hex();
    NeuralNetwork.neurons[i].signal_history = new Queue(50);
  }
  
  $('dt#neuron-count').next('dd').text(NeuralNetwork.neurons.length);
  $('dt#frame-rate').next('dd').text(processing.frame_rate);
  
  processing.draw = function() {
    $frame_count.text(this.frame_count);
    
    if (this.frame_count % 3 == 0) for (var i in NeuralNetwork.neurons) 
      if (i == 0) 
        continue;
      else 
        NeuralNetwork.neurons[i].receive(vision[i - 1]);
    
    NeuralNetwork.draw(this);
    NeuralNetwork.run();
    
    $entropy_value.text(Math.round(NeuralNetwork.entropy * 100) / 100);
  };
  
  processing.mouse_move = function() {
    if (!this.is_mouse_down) return; // only reading drags atm
    if (NeuralNetwork.drag_neuron) {
      var neuron = NeuralNetwork.drag_neuron;
      neuron.position.x = this.mouse_x;
      neuron.position.y = this.mouse_y;
      
      return;
    }
    
    for (var i in NeuralNetwork.neurons) {
      var neuron = NeuralNetwork.neurons[i];
      
      if (Math.abs(this.mouse_x - neuron.position.x) < neuron.mass && Math.abs(this.mouse_y - neuron.position.y) < neuron.mass) {
        NeuralNetwork.drag_neuron = neuron;
        
        neuron.is_fixed = true;
        neuron.is_being_dragged = true;
        neuron.position.x = this.mouse_x;
        neuron.position.y = this.mouse_y;
      }
    }
  };
  
  processing.click = function() {
    for (var i in NeuralNetwork.neurons) {
      var neuron = NeuralNetwork.neurons[i];
      
      if (Math.abs(this.mouse_x - neuron.position.x) < neuron.mass && Math.abs(this.mouse_y - neuron.position.y) < neuron.mass) {
        if (!NeuralNetwork.selected_neurons) NeuralNetwork.selected_neurons = [];
        
        if (neuron.is_selected) {
          neuron.is_selected = false;
          array_remove(NeuralNetwork.selected_neurons, NeuralNetwork.selected_neurons.indexOf(neuron));
        } else {
          neuron.is_selected = true;
          NeuralNetwork.selected_neurons.push(neuron);
        }
      }
    }
  };
  
  processing.mouse_up = function() {
    if (!NeuralNetwork.drag_neuron) {
      NeuralNetwork.drag_neuron = null;
      return;
    }
    
    NeuralNetwork.drag_neuron.is_fixed = false;
    NeuralNetwork.drag_neuron.is_being_dragged = false;
    NeuralNetwork.drag_neuron = null;
  };
  
  var processing2 = new Processing(document.getElementById('entropy-canvas'));
  processing2.size(415, 100);
  processing2.context.fillStyle = '#ccccff';
  var queue = new Queue(50);
  var graph_bar_width = processing2.context.canvas.width / queue.max_size / 2;
  
  processing2.draw = function() {
    queue.en(NeuralNetwork.entropy);
    
    for (var i in queue.data) 
      this.context.fillRect(i * (graph_bar_width * 2), this.context.canvas.height, graph_bar_width, -(Math.min((this.context.canvas.height / queue.peek()) * queue.data[i], queue.data[i])));
  }
  
  var processing3 = new Processing(document.getElementById('potentials-canvas'));
  processing3.size(415, 100);
  
  processing3.draw = function() {
    for (var i in NeuralNetwork.selected_neurons) {
      var neuron = NeuralNetwork.selected_neurons[i];
      
      this.context.fillStyle = neuron.color;
      
      for (var j in neuron.signal_history.data) {
        var signal = -neuron.signal_history.data[j] * 100;
        
        this.context.fillRect(j * (graph_bar_width * 2), this.context.canvas.height, graph_bar_width, signal, signal);
      }
    }
  }
  
  $(document).keypress(function(event) {
    console.log(event.keyCode + ': ' + String.fromCharCode(event.keyCode));
    
    switch (event.keyCode) {
      case 112: // p
        processing.is_looping ? processing.no_loop() : processing.loop();
        processing2.is_looping ? processing2.no_loop() : processing2.loop();
        processing3.is_looping ? processing3.no_loop() : processing3.loop();
        break;
    }
  });
  
  $(window).bind('focus', function() {
    processing.loop();
    processing2.loop();
    processing3.loop();
  });
  
  $(window).bind('blur', function() {
    processing.no_loop();
    processing2.no_loop();
    processing3.no_loop();
  });
});
