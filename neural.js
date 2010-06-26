var NeuralNetwork = { // uninstantiable/singleton (will make it instantiable once necessary)
  neurons: [],
  
  synapses: [],
  
  run: function() { // two steps necessary to emulate (?) parallel nature of neural networks
    for (var i in this.neurons) // push to action potential
       this.neurons[i].activation_test();
    
    for (var i in this.neurons) // push to membrane potential
       this.neurons[i].send();
  },
  
  create_neuron: function() {
    var neuron = new Neuron();
    
    this.neurons.push(neuron);
    
    return neuron;
  },
  
  create_synapse: function(one_end, other_end, weight) { // helper function
    var synapse = one_end.create_synapse(other_end, weight || 1);
    
    this.synapses.push(synapse);
    
    return synapse;
  }
};

var Neuron = function() { // work-horse, going to have lots of these (i.e. instantiable)
  this.membrane_potential = 0;
  this.action_potential = 0;
  this.threshold = 0;
  this.axon = []; // with weights (self-adjusting - making this a recurrent feed-forward network)
  this.dendrites = []; // also has weights but for now just used for drawing (might be useful later though)
  return true;
};

// methods made public to save on memory consumption
Neuron.prototype.receive = function(value) {
  this.membrane_potential += value;
};

Neuron.prototype.activation_test = function() {
  if (this.membrane_potential > this.threshold) this.action_potential += this.membrane_potential; // normally would use an activation function (step) and weights would come in to play
  this.membrane_potential = 0; // normally wouldn't clear this out but diminish it instead
};

Neuron.prototype.send = function() {
  for (var i in this.axon) 
    this.axon[i]['neuron'].receive(this.action_potential * this.axon[i]['weight']);
  
  this.action_potential = 0; // normally wouldn't clear this out but diminish it instead
};

Neuron.prototype.create_synapse = function(other_end, weight) {
  var synapse = {
    'one_end': this,
    'other_end': other_end,
    'weight': weight
  };
  
  this.axon.push({
    'neuron': other_end,
    'weight': weight
  });
  
  other_end.dendrites.push({
    'neuron': this,
    'weight': weight
  });
  
  return synapse;
};
