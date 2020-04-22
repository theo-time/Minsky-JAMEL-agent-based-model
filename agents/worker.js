function Worker(x, y, id, pDNA) {
  agent.call(this,x, y, id, pDNA)

  this.type = "worker"
  this.name = this.type + this.id
  this.clor = [250,50,50]

  this.life = 100;

  this.contract = 0;

  this.Tables = {
    deposits:0,
    wage :0,
    dividends :0,
    income :0,
    annual_income:0,
    targetSaving:0,
    consumption:0,
    saving :0,
    effectiveConsumption:0,
    unmet_demand:0,
    cash:0,
    accepted_wage:0,
    unemployment_time:0,
  }

  // | --  Assets -- |

  this.Shares = {

  }

  // | -- PARAMETERS -- |

  this.contract_length = randomInt(6,37);
  this.nbr_consult_offers = 4
  this.accepted_wage_flexibility = 0.1;
  this.accepted_wage_adjust_delay = randomInt(6,12);
  this.savePropensity = 0.05
  this.savePropensity_adjust_delay = randomInt(4,7);
  this.foodNeed = 1

  // | -- STATE VARIABLES -- |

  this.dividends = [0];
  this.income = [0];
  this.deposits = [0];
  this.saving = [0];
  this.wage = [0];
  this.accepted_wage = [1]; 
  this.employed = false 
  this.unemployment_time = [0]; 
  this.exhaust = 0; 
  this.consumption = [0]
  this.annual_income = [0]
  // this.revendication = 10
  this.lastEmployer

  // auxilirary
  this.effectiveConsumption = []
  this.unmet_demand = []
  this.cash = []
  this.targetSaving = [0]
  this.Saving = []

  this.depositAccount = function() {
    this.deposits[frameCount] = this.money
    console.log("compute")
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
          sample.push(lastEmployerOffer)
        }
        else{
          sample = samplie(Offers, this.nbr_consult_offers)
          // console.log("nolastemployerOffer")
        }
      }
      else{
        sample = samplie(Offers, this.nbr_consult_offers)
        console.error("no last employer", sample, frameCount)
      }
      
      sample.sort(function(a, b){return b.wage - a.wage})
      console.warn(sample, this.accepted_wage[t])

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
    
    this.income[t] = this.wage[t] + this.dividends[t] 

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
    var delta_saving = this.targetSaving[t] - this.deposits[t]

    if(delta_saving > this.savePropensity * this.income[t] ) {
      this.consumption[t] = (1 - this.savePropensity) * this.income[t]
    }
    else {
      this.consumption[t] = this.income[t] - delta_saving // Can be désepargne
    }

    // Savings 
    this.saving[t] = this.income[t] - this.consumption[t]
   
  }

  this.spend = function() {

    if(this.consumption[t] > 0) {
      var consumption =  this.consumption[t]

      for(var i in localMarket.products.food.Offers) {
        var offer = localMarket.products.food.Offers[i]
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
    this.unmet_demand[t] = this.consumption[t] - this.effectiveConsumption[t]

    this.Saving[t] = this.cash[t]
  }

  this.spend2 = function() {

    if(this.consumption[t] > 0) {
      var consumption =  this.consumption[t] // / localMarket.products.food.bestprice
      console.warn("Consumer " + id + " tries to spend " + consumption + "$ an own" + this.money +"$")
      var Offers =  localMarket.products.food.Offers.filter((element) => element.availableQ > 0)
      let sample = []

      let i = 0
      while( localMarket.products.food.worstprice < consumption && Offers.length > 0 && i < 10){

        let sampleResults  = cutSample(Offers, this.nbr_consult_offers)
        sample = sampleResults[1]
        console.log(Offers, sample)

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
        console.log(sample, offer, demand, this.money, this)

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
        console.error("no last employer", sample, frameCount)
      }
      return sample
  }



  this.buildPlan = function() {
    var plan = []
    var goal;
    // FIND A GOAL 
    for(var g in Goals) {
      if(Goals[g].isValid(this) && !goal) {
        goal = Goals[g]; 
      }
      else{/*console.warn('goal ' + Goals[g] + " is not valid")*/}
    }


    if(goal) {
     // console.warn("ready for finding actions",goal.dState)

      // Find Actions 
      firstAction = findAction(goal.dState)
      plan.push(firstAction)
     // console.log("1st Action", firstAction)
     // console.log("Plan", plan)
      while(plan[0].condition){
       // console.log("Plan", plan[0])
        var newAction = findAction(plan[0].condition)
        plan.unshift(newAction)
       // console.log("New Action", newAction)
      }
      this.Plans.push(plan)
    }
    
  }

  this.eat = function() {
    this.food -= 5
    this.life = 100
  }

  this.act = function(){
    if(this.Plans.length == 0) {this.buildPlan();}
    else{
      for(var i in this.Plans){
        console.log(this.Plans[i][0])
        this.Plans[i][0].effect(this)
        if(this.Plans[i][0].reached(this)) {
          console.warn("Action " + this.Plans[i][0].id + " reached")
          this.Plans[i].shift()
          if(this.Plans[i].length == 0) {this.Plans.splice(i,1)}
        }
      }
    }
    this.compute();
    this.buy("food",2);
    this.revendicate();
    this.hunger();
  }

  // At the end of the month, worker calculates his demand and Lifecost
  this.compute = function() {
    this.foodPrice = foodMarket.price
    this.lifeCost = this.consumption * this.foodPrice
    this.demand = this.consumption * 10 - this.food;
  }

  // Worker calculates what he can afford and buys it on the market
  this.buy = function(prop, q) {
    while (q * localMarket.products[prop].bestprice > this.money) {
      var q  = q - 1
    }
    if(q > 0) {
      //var req = foodMarket.buyNow(this, this.demand) deprecated
      if(localMarket.products[prop].Offers.length > 0) {
          var offer = localMarket.products[prop].Offers[0]
          exchange(this, offer.emetter, offer.prop, offer.price, q)
          console.log("buys " + q + " of " + prop)
      }
    }
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

  // the Worker revendicates a wage which allows him to live
  this.revendicate = function() {
    if(this.foodPrice) {
      this.revendication = this.lifeCost - this.income
      if(this.revendication < 0 ) {this.revendication = 0}
    }
    //this.employer.augmAskers.push(this)
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