function Worker(x, y, id, pDNA) {
  agent.call(this,x, y, id, pDNA)

  this.type = "worker"
  this.name = this.type + this.id
  this.clor = [250,50,50]

  this.life = 100;
  this.age = 0

  this.contract = 0;

  this.Tables = {
    deposits:0,
    wage :0,
    dividends:0,
    preTax_income:0,
    inc_tax:0,
    allocations:0,
    income:0,
    annual_income:0,
    targetSaving:0,
    consumption:0,
    saving :0,
    effectiveConsumption:0,
    unmet_demand:0,
    cash:0,
    accepted_wage:0,
    unemployment_time:0,
    risky_ratio:0,
    target_risky_ratio_arr:0,
    demand_time:0,
  }

  // | --  Assets -- |

  this.Shares = []


  // | -- PARAMETERS -- |

  this.contract_length = randomInt(12,37);
  this.nbr_consult_offers = 3
  this.accepted_wage_flexibility = 0.01;
  this.accepted_wage_adjust_delay =  randomInt(2,5);
  this.targetSaving = 0.2
  this.savePropensity = 0.2 // 0.05
  this.savePropensity_adjust_delay = randomInt(4,7);
  this.max_savePropensity = 0.8
  this.foodNeed = 1
  this.target_risky_ratio = 0.1
  this.max_target_risky_ratio = 0.5
  this.PE_norm = randomInt(5,10)

  // | -- STATE VARIABLES -- |

  this.dividends = [0];
  this.income = [0];
  this.preTax_income = [0];
  this.inc_tax = [0]
  this.allocations = [0];
  this.deposits = [0];
  this.financial_wealth = [0];
  this.wealth = [0];
  this.saving = [0];
  this.wage = [0];
  this.accepted_wage = [1]; 
  this.employed = false 
  this.unemployment_time = [0]; 
  this.exhaust = 0; 
  this.consumption = [0]
  this.annual_income = [0]
  this.real_wealth = [0]
  this.real_income = [0]
  // this.revendication = 10
  this.lastEmployer
  this.savePropensity_arr = [0]
  this.offer_time = [0]
  this.demand_time = [0]

  // auxilirary
  this.effectiveConsumption = [0]
  this.unmet_demand = [0]
  this.cash = [0]
  this.targetSaving = [0]
  this.Saving = []
  this.risky_ratio = [0]
  this.target_risky_ratio_arr = [0]


  this.depositAccount = function() {
    this.deposits[frameCount] = this.money
    this.allocations[frameCount] = 0
  }

  this.acceptedWageAdjust = function() {
    var t = frameCount
    // If delay is outpassed, adjust down the accepted wage
    if(this.unemployment_time[t-1] >= this.accepted_wage_adjust_delay && frameCount > 0) {
      this.accepted_wage[t] = (1 - this.accepted_wage_flexibility) * this.accepted_wage[t-1]
      // console.warn("WAGE ADJUST")
    }
    // If employed, accepted wage = actual wage
    else if(this.employed) {
      this.accepted_wage[t] = this.contract.wage
    }
    // Else do nothing for now
    else{
      this.accepted_wage[t] = this.accepted_wage[t-1]
    }

  }

  this.findJob = function() {
    var t = frameCount
    if(!this.employed){
      // console.warn( this.id + " SEARCHING FOR JOB")
      // for(var i = 0; i < workMarket.jobOffers.length; i++) {

      //   // try to find a job
      //   // console.log(this.accepted_wage[t], workMarket.jobOffers[i].wage, workMarket.jobOffers[i].availableQ)
      //   if(workMarket.jobOffers[i].wage >= this.accepted_wage[t] && workMarket.jobOffers[i].availableQ > 0) {
      //      workMarket.jobOffers[i].hire(this)
      //   }

      //   // If found job, sets unemployment time to 0
      //   if(this.employed == true) {
      //     break
      //   }
      // }


      // [ ---  Imperfect information market ---- ]
      var Offers = workMarket.jobOffers.filter((element) => element.availableQ > 0)
      var sample = []
      // console.log(Offers)
      if(this.lastEmployer) {

        // console.warn(this.lastEmployer)
        var lastEmployerOffer = Offers.filter((element) => element.emetter.id == this.lastEmployer )[0]
        
        if(lastEmployerOffer) {
          sample = samplie(Offers, this.nbr_consult_offers - 1)
          // sample.push(lastEmployerOffer)
        }
        else{
          sample = samplie(Offers, this.nbr_consult_offers)
          // console.log("nolastemployerOffer")
        }
      }
      else{
        sample = samplie(Offers, this.nbr_consult_offers)
      }
      
      sample.sort(function(a, b){return b.wage - a.wage})

      if(0 < sample.length){
        for(var i = 0; i < sample.length; i++) {

          // try to find a job
          // console.log(sample,this)
          // console.log(this.accepted_wage[t], workMarket.jobOffers[i].wage, workMarket.jobOffers[i].availableQ)
          if(sample[i].wage >= this.accepted_wage[t] && sample[i].availableQ > 0) {
             sample[i].hire(this)
          }
          else if (sample[i].availableQ == 0 ) {
            sample = cec
          }
          else if (sample[i].wage < this.accepted_wage[t]) {
            // console.error(this.accepted_wage)
            // console.error("Wage too small")        
          }

          // If found job, sets unemployment time to 0
          if(this.employed == true) {
            break
          }
        }
      }
      else if (sample.length < 3 && Offers.length > 3) {
        sample = cec
      }
    }

    // Unemployment time counter
    if(!this.employed) {
      workMarket.unemployedWorkers.push(this)
      this.unemployment_time[t] = this.unemployment_time[t-1] + 1 ; 

    }
    else{

      this.unemployment_time[t] = 0;

    }
  }


  this.budget = function() {
    var t = frameCount
    // Wage calculation
    if(this.employed) {
      // console.warn( "NEW WAGE  :: " + this.contract.wage)
      this.wage[t] = this.contract.wage
    }
    else {
      this.wage[t] = 0
    }

    // If no dividends in t, then dividends are 0
    if(!this.dividends[t]) {
      this.dividends[t] = 0
    }


    
    // Income

    this.preTax_income[t] = this.wage[t] + this.dividends[t] 
    this.inc_tax[t] = state.flatTax(this.preTax_income[t])
    this.payTax(this.inc_tax[t])
    this.income[t] = this.preTax_income[t] - this.inc_tax[t] + this.allocations[t]


    this.real_income[t] = this.annual_income[t-1] / Globals.averagePrice

    if(this.real_income[t] < 50) {
      this.savePropensity = 0
      this.target_risky_ratio = 0
    }
    else {
      this.savePropensity = Math.min(Map(this.real_income[t], 50, 1000, 0.1, this.max_savePropensity), this.max_savePropensity)
      this.target_risky_ratio = Math.min(Map(this.real_income[t], 100, 1000, 0.1, this.max_target_risky_ratio), this.max_target_risky_ratio)
    }


    this.savePropensity_arr[t] = this.savePropensity
    this.target_risky_ratio_arr[t] = this.target_risky_ratio


    // Average annual income calculation

    if(frameCount%timePeriod == 0 && frameCount != 0) {
      var lastIncomes = this.income.slice(-this.savePropensity_adjust_delay)
      var average_income = mean2(lastIncomes)

      this.annual_income[t] = timePeriod * average_income
    }
    else{
      this.annual_income[t] = this.annual_income[t-1]
    }

    // [ -- TARGET SAVING -- ]

    if(frameCount%this.savePropensity_adjust_delay == 0 && frameCount != 0) {

      this.targetSaving[t] = this.annual_income[t] * this.savePropensity

    }
    else if(frameCount == 0) {
      this.annual_income[t] = timePeriod * this.income[t]
      this.targetSaving[t] = this.annual_income[t] * this.savePropensity
    }
    else {
      this.targetSaving[t] = this.targetSaving[t-1]
    }

    // Consumption determination
    var delta_saving = this.targetSaving[t] - this.deposits[t] // this.wealth[t-1]

    if(delta_saving > this.savePropensity * this.income[t] ) {
      this.consumption[t] = (1 - this.savePropensity) * this.income[t]
    }
    else {
      this.consumption[t] = this.income[t] - delta_saving * this.savePropensity// Can be désepargne
    }


    // this.consumption[t] = this.income[t] + this.cash[t-1]
    // this.saving[t] = 0

    for(var i = 0; i < this.Shares.length; i++) {
      if(this.Shares[i].owner != this) {
        console.log(this)
        eizo = zenoin
      }
    }
  }


  this.budget_old = function() {
    var t = frameCount
    // Wage calculation
    if(this.employed) {
      // console.warn( "NEW WAGE  :: " + this.contract.wage)
      this.wage[t] = this.contract.wage
    }
    else {
      this.wage[t] = 0
    }

    // If no dividends in t, then dividends are 0
    if(!this.dividends[t]) {
      this.dividends[t] = 0
    }


    
    // Income

    this.preTax_income[t] = this.wage[t] + this.dividends[t] 
    this.inc_tax[t] = state.flatTax(this.preTax_income[t])
    this.payTax(this.inc_tax[t])
    this.income[t] = this.preTax_income[t] - this.inc_tax[t] + this.allocations[t]


    this.real_income[t] = this.income[t] / Globals.averagePrice

    if(this.real_income[t] < 10) {
      this.savePropensity = 0
      this.target_risky_ratio = 0.1
    }
    else {
      this.savePropensity = Math.min(Map(this.real_income[t], 10, 100, 0.1, this.max_savePropensity), this.max_savePropensity)
      this.target_risky_ratio = Math.min(Map(this.real_income[t], 10, 100, 0.1, this.max_target_risky_ratio), this.max_target_risky_ratio)
    }


    this.savePropensity_arr[t] = this.savePropensity

    // [ -- TARGET SAVING -- ]
    if(frameCount%this.savePropensity_adjust_delay == 0 && frameCount != 0) {

      var lastIncomes = this.income.slice(-this.savePropensity_adjust_delay)
      var average_income = mean2(lastIncomes)

      this.annual_income[t] = timePeriod * average_income

      this.targetSaving[t] = this.annual_income[t] * this.savePropensity

    }
    else if(frameCount == 0) {
      this.annual_income[t] = timePeriod * this.income[t]
      this.targetSaving[t] = this.annual_income[t] * this.savePropensity
    }
    else {
      this.targetSaving[t] = this.targetSaving[t-1]
      this.annual_income[t] = this.annual_income[t-1]  
    }

    // Consumption determination
    var delta_saving = this.targetSaving[t] - this.deposits[t] // this.wealth[t-1]

    if(delta_saving > this.savePropensity * this.income[t] ) {
      this.consumption[t] = (1 - this.savePropensity) * this.income[t]
    }
    else {
      this.consumption[t] = this.income[t] - delta_saving // Can be désepargne
    }


    // this.consumption[t] = this.income[t] + this.cash[t-1]
    // this.saving[t] = 0

    for(var i = 0; i < this.Shares.length; i++) {
      if(this.Shares[i].owner != this) {
        console.log(this)
        eizo = zenoin
      }
    }
  }


  this.spend = function() {
    var t = frameCount 
    if(this.consumption[t] > 0) {
      var consumption =  this.consumption[t]

      for(var i in localMarket.products.food.Offers) {
        var offer = localMarket.products.food.Offers[i]

        if(offer.availableQ == 0){ continue }

        var demand = Math.min(Math.floor(consumption / offer.price), offer.availableQ)

        if(demand>0) {
          offer.buy(this, demand)
        }

        consumption -= demand * offer.price

        if(consumption < this.consumption[t]/10){
          break
        }
      }
    }
    this.cash[t] = this.money
    this.effectiveConsumption[t] = this.income[t] - (this.cash[t] - this.cash[t-1])
    this.saving[t] = this.income[t] - this.effectiveConsumption[t]

    this.unmet_demand[t] = this.consumption[t] - this.effectiveConsumption[t]
    this.dividends[t+1] = 0 // Initialisation of dividends
    this.Saving[t] = this.cash[t]
  }

  this.spend2 = function() {
    var t = frameCount

    if(this.consumption[t] > 0) {
      var consumption =  this.consumption[t] // / localMarket.products.food.bestprice
      var Offers =  localMarket.products.food.Offers.filter((element) => element.availableQ > 0)
      let sample = []

      let i = 0
      while( localMarket.products.food.worstprice < consumption && Offers.length > 0 && i < 10){

        let sampleResults  = cutSample(Offers, this.nbr_consult_offers)
        sample = sampleResults[1]

        if(i == 0 && this.lastSupplier){
          let lastSupplierOffer = Offers.filter((element) => element.emetter.id == this.lastSupplier )[0]
          if(lastSupplierOffer) {
            sample.push(lastSupplierOffer)
          }
        }

        sample.sort(function(a, b){return a.price - b.price})

        let offer = sample[0]
        let demand = Math.min(Math.floor(consumption/offer.price), offer.availableQ)
        // if(demand * offer.price > this.money) { }


        offer.buy(this, demand)
        consumption -= demand * offer.price

        Offers =  localMarket.products.food.Offers.filter((element) => element.availableQ > 0) //sampleResults[0]
        i++
      }
    }

    this.cash[t] = this.money
    this.effectiveConsumption[t] = this.income[t] - (this.cash[t] - this.cash[t-1])
    this.unmet_demand[t] = this.consumption[t] - this.effectiveConsumption[t]
    this.dividends[t+1] = 0 // Initialisation of dividends
    // if(this.effectiveConsumption[t] < 0 ) {  zadazoni = adzd}
    // if(this.unmet_demand[t] > 100 && frameCount > 10) {  zadazoni = adzd}
    this.Saving[t] = this.cash[t]
  }

  this.portfolioBehavior = function () {
    var t = frameCount

    // Wealth 
    this.financial_wealth[t] = this.Shares.length * stockMarket.price
    this.wealth[t] = this.money + this.financial_wealth[t]
    this.real_wealth[t] = this.wealth[t] / Globals.averagePrice

    this.risky_ratio[t] = this.financial_wealth[t] / this.wealth[t]

    // if(Globals.price_earnings_ratio < this.PE_norm) {
    //   this.target_risky_ratio = Math.min(this.target_risky_ratio * 1.4, 1)
    // }
    // else {
    //   this.target_risky_ratio = this.target_risky_ratio * 0.6
    // }

    this.target_risky_ratio_arr[t] = this.target_risky_ratio

    if(this.risky_ratio[t] < this.target_risky_ratio ) {

      let delta = (this.target_risky_ratio - this.risky_ratio[t]) * this.wealth[t]
      let demand = Math.round(delta/stockMarket.price)
      let adjust = Map(this.demand_time[t-1], 0, 100, 0, 0.3)
      let price = stockMarket.price * (1 + adjust)


      if(demand > 0 && this.money > price * 1){

          stockMarket.makeOrder("buy", price, 1, this)    

      } 

      this.demand_time[t] =  this.demand_time[t-1] + 1
      this.offer_time[t] = 0

    }
    else {
      let delta =  (this.risky_ratio[t] - this.target_risky_ratio) * this.wealth[t]
      let offer = Math.round(delta/stockMarket.price)  
      let adjust = Map(this.offer_time[t-1], 0, 100, 0, 0.3)
      let price = stockMarket.price * (1 - adjust)

      if(offer > 0 && this.Shares.length > 1){

          stockMarket.makeOrder("sell", price, 1, this)
           
      }  

      this.offer_time[t] =  this.offer_time[t-1] + 1
      this.demand_time[t] = 0

    }

    // var draw = Math.random()
    // if(draw > 0.5 && this.money > stockMarket.price) {
    //   stockMarket.makeOrder("buy", 1, 1, this)
    // }
    // else if(this.Shares.length > 0) {
    //   stockMarket.makeOrder("sell", 1, 1, this)
    // }
  }

  this.test = function() {
    let t = frameCount
    if(this.unmet_demand[t] > 100 && frameCount > 10) {
      console.log(this)
     zadazoni = adzd
   }
  }

  this.goodsMarketSample = function() {
      var sample = []
      // console.log(Offers)
      if(this.lastSupplier) {

        // console.warn(this.lastEmployer)
        var lastSupplierOffer = Offers.filter((element) => element.emetter.id == this.lastSupplier )[0]
        
        if(lastSupplierOffer) {
          sample = samplie(Offers, this.nbr_consult_offers - 1)
          sample.push(lastEmployerOffer)
        }
        else{
          sample = samplie(Offers, this.nbr_consult_offers)
          // console.log("nolastemployerOffer")
        }
      }
      else{
        sample = samplie(Offers, this.nbr_consult_offers)
      }
      return sample
  }




  this.eatFood = function() {

    this.life -= this.foodNeed

    if(this.life < 100 - this.foodNeed) {
      if(this.stock.food > this.foodNeed) {
          this.stock.food -= this.foodNeed
          this.life += this.foodNeed 
      }
      else {
      this.stock.food -= this.stock.food
      this.life += this.stock.food
      }
    }

    if(this.life < 0) {
      this.alive = false
      this.clor = [20,20,20]
    }
  }

  this.ageing = function() {
    this.age++
  }

  this.actualize = function() {
    var toAct = [
      "dividends", 
      "income", 
      "preTax_income", 
      "inc_tax", 
      "allocations", 
      "deposits", 
      "financial_wealth", 
      "wealth", 
      "saving", 
      "wage", 
      "accepted_wage",
      "unemployment_time", 
      "exhaust",  
      "consumption",
      "annual_income", 
      "real_wealth",
      "real_income", 
      // this.revendication = 10

      "savePropensity_arr", 
      "offer_time" ,
      "demand_time", 

      // auxilirary
      "effectiveConsumption", 
      "unmet_demand", 
      "cash", 
      "targetSaving", 
      "Saving", 
      "risky_ratio", 
      "target_risky_ratio_arr"
    ]

    for(var i in toAct){
      console.log(this)
      this[toAct[i]][frameCount] = this[toAct[i]][0]
    }

    // zszd = zddfz
  }

  if(frameCount > 1) {
    this.actualize()
  }

}



function mean2(arr) {
  var sum = 0;
  for( var i = 0; i < arr.length; i++ ){
      sum += arr[i]
  }
  var avg = sum/arr.length
  return avg
}

function randomInterval(min,max) {
   return Math.random() * (max - min) + min;
}

function samplie(array, n){
  // Shuffle array
  const shuffled = [...array].sort(() => 0.5 - Math.random())

  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, n);

  return selected
}

function cutSample(array, n){
  // Shuffle array
  const shuffled = [...array].sort(() => 0.5 - Math.random())

  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, n);
  shuffled.splice(0,n)

  return [shuffled, selected]
}