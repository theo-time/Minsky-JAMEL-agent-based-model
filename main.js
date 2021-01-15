function main() {
  t = frameCount

  // ++++++++++++++++ Simulation ++++++++++++

  if(frameCount == 300) {
    // shock(Workers, "savePropensity", 0.4)
    // productivityShock(5)
     // shock(Firms, "target_debt_ratio", 3/10)
  }

  if(frameCount == 400) {
    // shock(Workers, "savePropensity", 0.2)
    // productivityShock(5)
     // shock(Firms, "target_debt_ratio", 3/10)
  }

  if(frameCount > 300 && frameCount < 600) {
    // additiveShock(Firms, "dividends_ratio", 0.2/300)
  }



  workMarket.clearOffers();
  localMarket.clearOffers();
  stockMarket.clearOrders();


  Firms.do("ageing")
  Workers.do("ageing")
  Bank.ageing()
  state.ageing()

  Workers.do("depositAccount")
  state.init()

  Bank.interestAdjust()

  Bank.payDividends();

  shuffler(Firms)
  for(i=0; i < Firms.length; i++){
    firm = Firms[i];
    firm.payDividends()
    firm.profitTax()
    firm.compute()
    // firm.brainProcess()
    firm.productionChoice()
    firm.Recruit()
    firm.wageAdjust()
    firm.productionFinancing()
    firm.hirePolicy()
    for(var p in firm.Machines) {
      firm.Machines[p].used = 1
    }
  }

  workMarket.sortOffers();

  shuffler(Workers)
  for(i=0; i < Workers.length; i++){
    worker = Workers[i];
    worker.acceptedWageAdjust();
    worker.findJob();
    worker.exhaust = 1
  }
  

  state.budget()
  state.Allocations()

  Workers.do("budget")

  // Production 
 shuffler(Firms)
  for(i=0; i < Firms.length; i++){
    firm = Firms[i];
    firm.production2()
    firm.priceCalc()
    firm.sell()
    firm.investment_choice()
  }

  localMarket.operate();

  shuffler(Workers)
  Firms.do("invest")
  Workers.do("spend")
  state.spend()

  Workers.do("eatFood")
  // Workers.do("portfolioBehavior")
  stockMarket.operate();



  // Bank.recoverDoubtful()
  Bank.recoverCredits()
  Bank.balanceSheetCalc()

  state.resultCalc()

  Firms.do("resultCalc")
  Firms.do('createMachine')
  // Firms.do("buildBalanceSheet")

  Bank.handleBankruptcies()
  Bank.resultCalc()
  //  -------- Market ----------------
  workMarket.operate();
  // Workers.do("test")
  // --------- Globals  ---------

  localMarket.stats();

  // Globals.pricesCalc(); 
  Globals.monthlyCalc();

  if(frameCount % timePeriod == 0) { 
    Globals.stockCalc(); 
    Globals.yearlyCalc();
    FirmsPop.evaluate();
    Firms.do("evolve");
  }
  Globals.arrayConstruct();

  // if(frameCount < 170) {
  //   growth()
  // }

  // ------- Date and Time -------

  Dates.push(Date.now())
  Time.push(frameCount)

  replaceAgents();


  // [ -------- EVOLUTION -------- ]

  // if(frameCount % 100 == 1){
  //   Pop.evaluateFitness();
  //   Pop.reproduction();
  // }

}

function printTime() {
    push()
      fill(0,250,250)
      textSize(25)
      if(Dates.length > 2) {
        frameTime = (Dates[Dates.length-1]-Dates[Dates.length-2]) / 1000
        FPS = Math.round(1/frameTime*100)/100
        Duration = (Dates[Dates.length-1]-Dates[0]) / 1000
        text(FPS + " FPS", 0, 750)
        text(Duration + " s", 0, 730)
      }
      text(Math.floor(frameCount/10) + " Months", 0, 770)
      text(frameCount + ' Days' ,0,795)
    pop()
}



function productivityShock(x) {
  for(var i = 0; i < Firms.length; i++) {
     for(var j = 0; j < Firms[i].Machines.length; j++){
      Firms[i].Machines[j].productivity += x
     }
  }
}

function shock(arr, prop, x) {
  for(var i = 0; i < arr.length; i++) {
      arr[i][prop] = x
  }
}


function growth() {
  Workers.push(new Worker(100,100, Workers.length))
}

function additiveShock(arr, prop, x) {
  for(var i = 0; i < arr.length; i++) {
      arr[i][prop] += x
  }
}