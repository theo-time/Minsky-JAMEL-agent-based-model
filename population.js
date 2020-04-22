var PLAYER_AMOUNT     = 10
var ITERATIONS        = 1000;
var START_HIDDEN_SIZE = 0;
var MUTATION_RATE     = 0.3;
var ELITISM_PERCENT   = 0.1;

// Trained population
var USE_TRAINED_POP = false;


function Population(agent, popSize) {
  this.Blobs = [];
  this.agent = agent
  this.popSize = popSize
  this.Scores = []

  this.infos = {
    generation:0,
    averageFitness:0,
    popSize:this.popSize,
    mutationRate:1/100,
  }

  // this.generatePop = function(nbr) {
  //   this.Blobs = []
  //   this.infos.generation = 0
  //   for( var i = 0; i < nbr; i++) {
  //     this.Blobs[i] = new Blob(50 + random(width-100), 50 + random(height-100));
  //   } 
  //   this.infos.popSize = nbr
  //   console.log(this.Blobs)
  // }

  this.evaluate = function() {
    console.log('evaluating')

    // Calculating Maximum Fitness && Assigning fitness // 
    var maxfit = 0
    for(var u = 0; u < this.infos.popSize; u++) {
      this.Blobs[u].calcFitness();
      if (this.Blobs[u].fitness > maxfit) {
        maxfit = this.Blobs[u].fitness;
      }                   
    }
    console.warn("Fitness assigned Blobs", Pop.Blobs)

    MaxfitElt = document.createElement('p')
    MaxfitElt.textContent = maxfit
    globalElt.appendChild(MaxfitElt)
    this.averageFitnessCalc();

    // Mapping fitness to max // 
    for(var i= 0; i < this.infos.popSize; i++) {
      this.Blobs[i].fitness /= maxfit;
    }

  }



  this.averageBlob = function(GoodProps) {
    var output = {}
    for(var i in GoodProps) {
      prop = GoodProps[i]
      output[prop] = 0; // init on 0 
      for(var p in this.Blobs) {
        output[prop] += this.Blobs[p][prop]
        console.log(i, output[prop], this.Blobs[p]) // incremented by Blob value
      }
      output[prop] = output[prop] / this.Blobs.length
    }
    console.log(output)
    return output
  }


  /** Construct the genetic algorithm */
  this.initNeat = function(){
    this.neat = new neataptic.Neat(
      4, // Input
      3, // Output
      null,
      {
        mutation: [
          neataptic.methods.mutation.ADD_NODE,
          neataptic.methods.mutation.SUB_NODE,
          neataptic.methods.mutation.ADD_CONN,
          neataptic.methods.mutation.SUB_CONN,
          neataptic.methods.mutation.MOD_WEIGHT,
          neataptic.methods.mutation.MOD_BIAS,
          neataptic.methods.mutation.MOD_ACTIVATION,
          neataptic.methods.mutation.ADD_GATE,
          neataptic.methods.mutation.SUB_GATE,
          neataptic.methods.mutation.ADD_SELF_CONN,
          neataptic.methods.mutation.SUB_SELF_CONN,
          neataptic.methods.mutation.ADD_BACK_CONN,
          neataptic.methods.mutation.SUB_BACK_CONN
        ],
        popsize: this.popSize,
        mutationRate: MUTATION_RATE,
        elitism: Math.round(ELITISM_PERCENT * PLAYER_AMOUNT),
        network: new neataptic.architect.Random(
          4,
          START_HIDDEN_SIZE,
          3
        )
      }
    );

    if(USE_TRAINED_POP){
      this.neat.population = population;
    }
  }

    /** Start the evaluation of the current generation */
  this.startEvaluation = function(){
    this.Blobs = [];
    highestScore = 0;

    for(var i in this.neat.population){
      brain = this.neat.population[i];
      this.Blobs[i] = new agent(50 + random(width-100), 50 + random(height-100), "NEAT" + i, brain); //new Blob(50 + random(width-100), 50 + random(height-100), childDNA,parentA, parentB);
    }
    console.log(this.Blobs)
  }


  /** End the evaluation of the current generation */
  this.reproduction = function() {

    for(var i in this.Blobs) {
      this.Blobs[i].fitnessCalc();
    }
    console.log('Generation:', this.neat.generation, '- average score:', this.neat.getAverage());

    this.Scores.push(this.neat.getAverage())

    this.neat.sort();
    var newPopulation = [];

    // Elitism
    for(var i = 0; i < this.neat.elitism; i++){
      newPopulation.push(this.neat.population[i]);
    }

    // Breed the next individuals
    for(var i = 0; i < this.neat.popsize - this.neat.elitism; i++){
      newPopulation.push(this.neat.getOffspring());
    }

    // Replace the old population with the new population
    this.neat.population = newPopulation;
    this.neat.mutate();

    this.neat.generation++;
    // this.startEvaluation();

    for(var i = 0; i < Pop.Blobs.length; i++) {
       Pop.Blobs[i].brain = this.neat.population[i]
    }
  }

  this.evaluateFitness = function() {
    console.log('evaluating')

    // Calculating Maximum Fitness && Assigning fitness // 
    var maxfit = 0
    for(var u = 0; u < this.infos.popSize; u++) {
      this.Blobs[u].fitnessCalc();
      if (this.Blobs[u].fitness > maxfit) {
        maxfit = this.Blobs[u].fitness;
      }                   
    }
    console.warn("Fitness assigned Blobs", Pop.Blobs)

    // MaxfitElt = document.createElement('p')
    // MaxfitElt.textContent = maxfit
    // globalElt.appendChild(MaxfitElt)
    // this.averageFitnessCalc();

    // Mapping fitness to max // 
    for(var i= 0; i < this.infos.popSize; i++) {
      this.Blobs[i].fitness /= maxfit;
    }

  }

}