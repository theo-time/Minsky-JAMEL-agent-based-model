function main() {
  t = frameCount

  // ++++++++++++++++ Simulation ++++++++++++

  if(frameCount == 240) {
    // shock(Workers, "savePropensity", 0.05)
    // productivityShock(5)
  }

  workMarket.clearOffers();
  localMarket.clearOffers();

  Firms.do("ageing")
  Bank.ageing()
  Workers.do("depositAccount")

  Bank.payDividends();

  shuffler(Firms)
  for(i=0; i < Firms.length; i++){
    firm = Firms[i];
    firm.payDividends()
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
    worker.budget();
    worker.exhaust = 1
  }


  // Production 
 shuffler(Firms)
  for(i=0; i < Firms.length; i++){
    firm = Firms[i];
    firm.production2()
    firm.priceCalc()
    firm.sell()
  }

  localMarket.operate();

  Workers.do("spend2")
  Workers.do("eatFood")

  Bank.recoverDoubtful()
  Bank.recoverCredits()
  Bank.balanceSheetCalc()
  Bank.resultCalc()

  Firms.do("resultCalc")
  Firms.do("buildBalanceSheet")

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
  }

  Globals.arrayConstruct();


  // ------- Date and Time -------

  Dates.push(Date.now())
  Time.push(frameCount)

   // replaceAgents();


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
      arr[i][prop] += x
  }
}