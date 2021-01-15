function State(x, y, id) {
  agent.call(this,x, y, id)

  this.Tables = {
  tax_income: 0,
  flatRate:0,
  contracyclic_spend:0,
  consumption_rate:0,
  consumption: 0,
  expected_consumption:0,
  effectiveConsumption:0,
  consumption_gap:0,
  social_transfers: 0,
  demand_boost:0,
  year_deficit:0,
  deficit: 0,
  deficit_to_GDP:0,
  loans: 0,
  e_interests:0,
  interest_charge: 0,
  debt_charge: 0,
  debt:0,
  Money:0,
  stock_before_ex:0,
  stock_after_ex:0,
  consumption_gap_n:0,
  }

  // Parameters
  this.flatRate = [0.2, 0.2]
  this.profit_tax = 0.21
  this.structural_size = 0.3
  this.contracyclical_rate = 0.04
  this.capacity_util_target = 0.93
  this.allocation_rate = 0.7
  this.allocation_duration = 0

  // State Variables
  this.tax_income = [0]
  this.firmsTax = [0]
  this.workersTax = [0]
  this.consumption_rate = [0]
  this.consumption = [0]
  this.contracyclic_spend = [0]
  this.effectiveConsumption = [0]
  this.social_transfers = [0]
  this.deficit = [0]
  this.deficit_to_GDP = [0]
  this.loans = [0]
  this.e_interests = [0]
  this.interest_charge = [0]
  this.debt_charge = [0]
  this.debt = [0]
  this.Money = [0]
  this.demand_boost = [0]
  this.consumption_gap = [0]
  this.expected_consumption = [0]
  this.year_deficit = [0]
  this.stock_before_ex = [0]
  this.stock_after_ex = [0]
  this.consumption_gap_n = [0]

  this.init = function() {
  	this.tax_income[frameCount] = 0
    this.firmsTax[t] = 0
    this.workersTax[t] = 0
    this.interest_charge[t] = 0 
    this.debt_charge[t] = 0  
  }

  this.flatTax = function(income) {
  	return income * this.flatRate[t]
  }

  this.budget = function() {
    let t = frameCount

  	this.stock_before_ex[t] = this.stock.food

    this.loans[t] = 0
    this.e_interests[t] = this.Loans.reduce((acc, loan, i) => {return acc + loan.principal * loan.interest} , 0)

    // Contracyclic spending 
    if(Globals.employmentRate < this.capacity_util_target) {
      this.contracyclic_spend[t] = this.contracyclical_rate * ( this.capacity_util_target - Globals.employmentRate) //- Globals.capacity_utilization//
    }
    else{
      this.contracyclic_spend[t] = 0
    }
    // if(frameCount < 200) {
    //  this.contracyclic_spend[t] = 0
    // }
    // State Structural size in economy
   	// this.consumption[t] = Globals.nbr_machines * Firms[0].machine_productivity * (this.structural_size + this.contracyclic_spend[t])
  	this.consumption_rate[t] =  (this.structural_size + this.contracyclic_spend[t])

  	this.consumption[t] = Globals.production * this.consumption_rate[t]
    
    if(frameCount == 1){
      this.consumption[t] = 0
    }

    // Evaluate allocation costs 
    this.social_transfers[t] = 0
    for(var i = 0; i < Workers.length; i++) {
      if(Workers[i].employed == false && Workers[i].unemployment_time[t] < Workers[i].contract_length * this.allocation_duration && Workers[i].lastWage > 0) {
        this.social_transfers[t] += Workers[i].lastWage * this.allocation_rate
      }
    }
    if(this.social_transfers[t] == NaN) { adzidn = dzd }

    this.expected_consumption[t] = this.consumption[t] * localMarket.products.food.bestprice
	
    this.deficit[t] =  this.money - this.social_transfers[t] - this.e_interests[t] - this.expected_consumption[t]
    this.deficit_to_GDP[t] = this.deficit[t] / Globals.GDP 

    if(this.deficit[t] < 0) {
      this.borrow(-this.deficit[t], "ST")
    }
    else{
      if(this.deficit_to_GDP[t-1] > 0.5) {
        this.consumption[t] += Math.floor((this.deficit[t] * 0.3 ) / localMarket.products.food.bestprice) //(this.deficit_to_GDP[t] - 0.1) * Globals.GDP * 0.1 // 
      }
    }

    this.expected_consumption[t] = this.consumption[t] * localMarket.products.food.bestprice

    this.demand_boost[t] = this.consumption[t] + this.social_transfers[t]



  }

  this.Allocations = function() {
    for(var i = 0; i < Workers.length; i++) {
      if(Workers[i].employed == false && Workers[i].unemployment_time[t] < Workers[i].contract_length * this.allocation_duration && Workers[i].lastWage > 0) {
        let transfer = Workers[i].lastWage * this.allocation_rate
        Workers[i].money += transfer
        this.money -= transfer

        Workers[i].allocations[t] += transfer
      }
    }
  }

  this.spend = function() {

  	this.effectiveConsumption[t] = 0

    if(this.consumption[t] > 0) {
      var consumption =  this.consumption[t]

      for(var i in localMarket.products.food.Offers) {
        var offer = localMarket.products.food.Offers[i]

        if(offer.availableQ == 0){ continue }

        var demand = Math.min(consumption, offer.availableQ)

        if(demand>0) {
          var result = offer.buy(this, demand)
        }

        if(result) {
	        consumption -= result 
	        this.effectiveConsumption[t] += result * offer.price
	    }

        if(consumption <= 0){
          break
        }
      }
    }

    this.consumption_gap[t] = this.expected_consumption[t] - this.effectiveConsumption[t]
  	this.stock_after_ex[t] = this.stock.food
  	this.consumption_gap_n[t] = (this.stock_after_ex[t] - this.stock_before_ex[t]) - this.consumption[t]
    this.year_deficit[t] = this.tax_income[t] - this.social_transfers[t] - this.e_interests[t] - this.expected_consumption[t]

    if(this.year_deficit[t] < 0) {
      if(this.flatRate[t] < 0.7){
        this.flatRate[t+1] = this.flatRate[t] * 1
      }
      else{
        this.flatRate[t+1] = this.flatRate[t]
      }
    }
    if(this.year_deficit[t] == 0) {
      this.flatRate[t+1] = this.flatRate[t]
    }
    if(this.year_deficit[t] > 0) {
      this.flatRate[t+1] = this.flatRate[t] * 1

    }

    if(this.consumption_gap_n[t] > 200) {  
    	// zjid = dzn;
    }
  }


  this.spend2Q = function() {

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

   }

   this.resultCalc = function() {
    this.debt[t] = sumProp(this.Loans, "principal")
    this.Money[t] = this.money
   }




}