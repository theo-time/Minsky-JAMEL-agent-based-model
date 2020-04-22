var PLAYER_AMOUNT     = Math.round(WIDTH * HEIGHT * 8e-5);
var ITERATIONS        = 1000;
var START_HIDDEN_SIZE = 0;
var MUTATION_RATE     = 0.3;
var ELITISM_PERCENT   = 0.1;

// Trained population
var USE_TRAINED_POP = true;

// Global vars
var neat;

/** Construct the genetic algorithm */
function initNeat(){
  neat = new Neat(
    5, // Input
    2, // Output
    null,
    {
      mutation: [
        Methods.Mutation.ADD_NODE,
        Methods.Mutation.SUB_NODE,
        Methods.Mutation.ADD_CONN,
        Methods.Mutation.SUB_CONN,
        Methods.Mutation.MOD_WEIGHT,
        Methods.Mutation.MOD_BIAS,
        Methods.Mutation.MOD_ACTIVATION,
        Methods.Mutation.ADD_GATE,
        Methods.Mutation.SUB_GATE,
        Methods.Mutation.ADD_SELF_CONN,
        Methods.Mutation.SUB_SELF_CONN,
        Methods.Mutation.ADD_BACK_CONN,
        Methods.Mutation.SUB_BACK_CONN
      ],
      popsize: PLAYER_AMOUNT,
      mutationRate: MUTATION_RATE,
      elitism: Math.round(ELITISM_PERCENT * PLAYER_AMOUNT),
      network: new Architect.Random(
        5,
        START_HIDDEN_SIZE,
        2
      )
    }
  );

  if(USE_TRAINED_POP){
    neat.population = population;
  }
}

/** Start the evaluation of the current generation */
function startEvaluation(){
  players = [];
  highestScore = 0;

  for(var genome in neat.population){
    genome = neat.population[genome];
    new Player(genome);
  }
}