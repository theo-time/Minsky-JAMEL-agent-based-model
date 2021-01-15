var play = true

var t;

var Trades = [];

var Workers = []
var Firms = [];
var Speculators = [];
var Agents = [];
var Contracts = []
var deadFirms = []
var AgentsGarbage = []

var Shares = []

var phillipsCurve
var Time = []

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

function replaceAgents() {
  for(var u = 0; u < AgentsGarbage.length; u++) {

    for(var i = 0; i < Firms.length; i++){ 
      if(Firms[i] === AgentsGarbage[u]){
        var id = Firms[i].id
        deadFirms.push(Firms[i])
        Firms.splice(i,1);
        AgentsGarbage.splice(u,1)
        Firms.push(new Firm(100*id + 100,250,id))
        break
      }
    }
  
    
  }
}





var lastId = -1

function newId() {
  lastId++
  return lastId 
}

var nbr_consumers = 640
var nbr_industrials = 60


var Resources = ['rock', "wood", "food", "iron", "house", "gold", "jewels"]

var Colors = {
  rock:[132, 125, 125],
  wood:[158, 89, 33],
  food:[255,228,96],
  iron:[112, 19, 14],
  gold:[255,233,0]
}


const FirmsGoodProps = [
  "money",
  "debt",
  "wage",
  "sales",
  "wageBill",
  "income",
  "extractionRate",
  "price",
  "profitRate",
  "monthlyProd",
  "MonthlyDebtCharge",
  "productivity",
  "unitCost",
  "MonthlySales",
  "MonthlyLabourCost",
  "MonthlyNetResult",
  "addedValue",
  "Actifs",
  "Passifs",
  "totalPassif",
  "totalActif",
  "assetValue",
  "leverage",
  "unitCost",
  "ownFunds"
]


var totalStock = {}

var ProdMatrix = {
    house:[1,1,1,0,3]
}

var minimum_wage = 1

var spaceBetween = 100
var agentSize = 70
var scaleValue = 1

var playcanva = true
var playchart = false
var visual = "boost"

var graphSize = 450

var timePeriod = 10

var Dates = []
var frameTime = 1
var FPS = 50
var Duration = 0 

var basePrice = 0
var GDP_launched = false

var totalDebtArr = []

function setup() {
  initialisation();
}


function draw() {
  if (play == true) {
    main()
    userInterface()
  }
  else {
    frameCount -= 1
  }

}

function print(array, col, label) {
  // var Arr = buildArray(array, label)
  // timeSerie(Arr, label, 1, 200, 100, col);
  newGraph(Time, array, label, "scatter", "lines")
}

function displayAgents(arr){
  var printer = document.createElement('div')
  printer.setAttribute("class", "firmPrinter")
  for(var i in arr) {
    printProperties(arr[i], printer, FirmsGoodProps)
  }
  VizElt.appendChild(printer)
}

function printFirms() {
  var printer = document.createElement('div')
  printer.setAttribute("class", "firmPrinter")
  for(var i in Firms) {
    printProperties(Firms[i], printer, FirmsGoodProps)
  }
  VizElt.appendChild(printer)
}

function printSpeculators() {
  var printer = document.createElement('div')
  printer.setAttribute("class", "firmPrinter")
  for(var i in Speculators) {
    printProperties(Speculators[i], printer, FirmsGoodProps)
  }
  VizElt.appendChild(printer)
}

function arrange(n) {
  output = []
  for(var i=0; i < n; i++) {
    output.push(i)
  }
  return output
}

function shuffler(array) {
  array.sort(() => Math.random() - 0.5);
}

function showContracts() {
  var Contracts = []
  for(var i in Workers) {
    if(Workers[i].employed) {
      Contracts.push(Workers[i].contract)
    }
  }
  for(var i in Contracts) {
    var contract = Contracts[i]
    push()
      strokeWeight(contract.wage/200*30)
      stroke(0,255,0)
      line(contract.employer.pos.x, contract.employer.pos.y, contract.worker.pos.x, contract.worker.pos.y)
    pop()
  }
}



function trace(x, y, mode, type) {
  this.x = x
  this.y = y
  this.type = type
  this.mode = mode
}

function newGraph(xData, yData, title, type, mode) {
  var graph = document.createElement("div")

  var trace1 = {
    x: xData,
    y: yData, 
    mode: mode, 
    type: type,
    text:Time,
    textfont : {
      family:'Times New Roman',
      size:30
    },
    textposition: 'bottom center',
    marker: { size: 12 },
  }

  var layout = {
      title: title,
      width: graphSize,
      height: graphSize,
      font: {
        size: 18,
        color: '#7f7f7f'
      }
  };

  VizElt.appendChild(graph)

  Plotly.react(graph, [trace1], layout);

  return graph
}

function compositionGraph(props, title, type, mode) {
  var graph = document.createElement("div")

  var Traces = []
  for(var i in props) {
    var trace1 = {
      x: Time,
      y: Globals.arr[props[i]], 
      mode: mode, 
      type: type,
      name :props[i],

      text:Time,
      textfont : {
        family:'Times New Roman',
        size:30
      },
      textposition: 'bottom center',
      marker: { size: 12 },
      fill:'tozeroy'
    }

  Traces.push(trace1)
  }


  var layout = {
      title: title,
      width: graphSize,
      height: graphSize,
      font: {
        size: 18,
        color: '#7f7f7f'
      }
  };

  VizElt.appendChild(graph)

  Plotly.react(graph, Traces, layout);

  return graph
}


    function printGlobal(prop) {
        newGraph(Time, Globals.arr[prop], prop, "scatter", "lines")
    }

function stackedAreas(props, title) {
  var graph = document.createElement("div")

  var Traces = [];

  for(var i = 0; i < props.length; i ++) {

    var trace1 = {
      x: Time,
      y: Globals.arr[props[i]],
      name:props[i],
      stackgroup:'one',

      text:Time,
      textfont : {
        family:'Times New Roman',
        size:30
      },
      textposition: 'bottom center',
      marker: { size: 12 },
    }

    Traces.push(trace1)

  }

  var layout = {
      title: title,
      width: graphSize,
      height: graphSize,
      font: {
        size: 18,
        color: '#7f7f7f'
      }
  };

  VizElt.appendChild(graph)

  Plotly.react(graph, Traces, layout);
}

function multigraph(props, title) {
  var graph = document.createElement("div")

  var Traces = [];

  for(var i = 0; i < props.length; i ++) {

    var trace1 = {
      x: Time,
      y: Globals.arr[props[i]],
      name:props[i],

      text:Time,
      textfont : {
        family:'Times New Roman',
        size:30
      },
      textposition: 'bottom center',
      marker: { size: 12 },
    }

    Traces.push(trace1)

  }

  var layout = {
      title: title,
      width: graphSize,
      height: graphSize,
      font: {
        size: 18,
        color: '#7f7f7f'
      }
  };

  VizElt.appendChild(graph)

  Plotly.react(graph, Traces, layout);
}

function stackedAreasNorm(props, title) {
  var graph = document.createElement("div")

  var Traces = [];

  for(var i = 0; i < props.length; i ++) {

    var trace1 = {
      x: Time,
      y: Globals.arr[props[i]],
      name:props[i],
      stackgroup:'one',

      text:Time,
      textfont : {
        family:'Times New Roman',
        size:30
      },
      textposition: 'bottom center',
      marker: { size: 12 },
    }

    if(i == 0) {trace1.groupnorm = 'percent'}

    Traces.push(trace1)

  }

  var layout = {
      title: title,
      width: graphSize,
      height: graphSize,
      font: {
        size: 18,
        color: '#7f7f7f'
      }
  };

  VizElt.appendChild(graph)

  Plotly.react(graph, Traces, layout);
}

function distribute(arr, n) {
  for(var i = 0; i < arr.length; i++) {
    arr[i].money += n
  }
}

function myFunction(inputTab) {

    for(i=0; i < inputTab.length; i++) {

        
        
    }
    return "ça marche"
}
