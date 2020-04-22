function initialisation() {
  frameCount = 0

  var Trades = [];

  Workers = []
  Firms = [];
  Speculators = [];
  Agents = [];
  Contracts = []
  deadFirms = []
  AgentsGarbage = []

  Shares = []
  ShareTrades = []

  var phillipsCurve
  Time = []

  Workers.do = function(f) {
    shuffler(Workers)
    for(var n = 0; n < Workers.length; n++) {
      Workers[n][f]()
    }
  }

  Firms.do = function(f) {
    shuffler(Firms)
    for(var n = 0; n < Firms.length; n++) {
      Firms[n][f]()
    }
  }


  frameRate(1)

  // --------- Canvas creation -------------

  createCanvas(800, 800);
  canvas = document.getElementById('defaultCanvas0')
  document.getElementById('viz').appendChild(canvas)


  // ---- Agents Creation --------------

  // Population
  // Pop = new Population(smartFirm, 5)
  // Pop.initNeat();
  // Pop.startEvaluation();
  // for(var i in Pop.Blobs){
  //   Pop.Blobs[i].clor = "blue"
  //   console.log(Pop.Blobs[i])
  //   Firms.push(Pop.Blobs[i])
  // }


  console.warn(nbr_consumers)
  for(var i=0; i < nbr_consumers; i++) {
    Workers.push(new Worker(100 + 50*i, 430,i))
  }

  for(var i=0; i < nbr_industrials; i++) {
    var firm = new Firm(100*i + 100,250,i, "food")
    firm.stockIssue(5)
    Firms.push(firm)
  }

  // for(var i=0; i < nbr_industrials; i++) {
  //   var firm = new Firm(100*i + 100,250,i, "jewels")
  //   firm.stockIssue(5)
  //   Firms.push(firm)
  // }


  // ------ MARKETS ----------

  workMarket = new WorkMarket(500, 200)
  localMarket = new simpleMarket(100,100)
  stockMarket = new Market('shares')
  // Banking & Financial System ----------

  Bank = new bank(400, 60, "bank", 0)
  Bank.stockIssue(5)


  // ------ Globals initialisation -----------

  Globals = new globals() 
}
