console.log("Firms Loaded")

function Firm (x, y, id, prop, brain) {
  agent.call(this,x, y, id, brain)
  
  this.id = "firm" + String(newId()) ;

  this.type = 'firm';
  this.clor = [0,250,250]

  this.creation = frameCount

  this.employees = []
  this.shareHolders = []
  this.Shares = []

  this.Tables = {
    // Balance Sheet
    cash:0,
    Money:0,
    retained_earnings:0,
    fixedCapital:0,
    debt:0,
    leverage:0,
    cash_flows:0,
    equity_ratio:0,
    assets:0,
    equity:0,

    //Income
    margin:0,
    sales:0,
    wageBill:0,
    final_wageBill:0,
    pretax_income:0,
    profit_tax:0,
    income:0,   
    debt_charge:0,
    miscellaneous:0,
    doubtfulDebt:0,
    dividends:0,
    profit_rate:0,

    // Flows 
    loans:0,

    // Behaviour
    nbr_machines:0,
    nbr_employees:0,
    target_employment:0,
    delta_employmentArr:0,
    capacity_utilization:0,
    smooth_capacity_utilization:0,
    Production:0,
    investment:0,
    effectiveInvest:0,
    wage:0,
    fullEmployment:0,
    vacancies:0,

    unsold_stock:0,
    unsold_ratio:0,
    unsold_prod:0,
    stock_ratio_after_prod:0,

    price:0,
    Offer:0,
    unitCost:0,
    unsold_prod:0,
    stocks_value:0

  }

  this.trackingVariables = {

  }

  //  FIXED CAPITAL 

  this.machine_productivity = 40
  this.machine_value = 220
  this.max_machines = 60;

  this.Machines = []
  this.nbr_machines = [7]
  for(var p=0; p < this.nbr_machines; p++) {
    this.Machines.push(new Machine(this.machine_productivity,this.machine_value * 10 ))
  }


  this.money = 0;

  this.delta_employment=0;

  this.solvability = "trustful"

  // | -- PARAMETERS -- |
  this.good = prop

  this.production_flexibility = 0.1;
  this.production_adjust_delay = randomInt(2,5);
  this.capa_util_smoothing = 1
  this.capacity_utilization_target = 0.81

  this.target_debt_ratio = Math.random(1)
  this.dividends_ratio = 0.3




  // Own parameters - specific to one firm
  this.production_capacity; 
  this.production_duration = 1
  this.commercial_capacity = 6
  this.wage_adjust_delay = randomInt(0,6);
  this.wage_flexibility = 0.01;
  this.price_flexibility = 0.04;
  this.m_price_flexibility = 0.04;
  // this.max_dividend_rate = 0.2;


  // | -- STATE VARIABLES -- |

  this.income = [0];
  this.debt_charge = [0];
  this.miscellaneous = [0,0]
  this.interest_charge = [0];
  this.netResult;
  this.dividends = [0,0];
  this.cash_after_dividends;
  this.cash = [0,0]
  this.fixedCapital = [0]

  this.equity = [0, 0];
  this.reimbursment;
  this.BFR;
  this.loans = [0];

  this.stock_after_prod;
  this.unsold_stock = [0];
  this.target_employment = [7];
  this.investment = [0];
  this.effectiveInvest = [0];

  this.fullEmployment_time = 0;
  this.wage  = [300]; 
  this.wageBill = [0];
  this.price = [10];

  this.profit_rate = [0]


  // | -- AUXILIARY VARIABLES -- |

  this.capacity_utilization = [0];
  this.smooth_capacity_utilization = [0];
  this.vacancies = [0]
  this.unsold_ratio = [0]
  this.sales = [0];
  this.real_production = 0;
  this.nbr_employees = [0]
  this.stock_ratio_after_prod = [0];
  this.leverage = [0]
  this.monthlyProd = 0 ;
  this.Monthly_results;
  this.MonthlyBalanceSheet;
  this.MonthlyOutputs = [];
  this.MonthlyNetResults = [];
  this.MonthlyDebtCharge = 500;
  this.balanceSheet = new balanceSheet();
  this.balanceSheetArr = []
  this.debt = [0]
  this.productivity = 0.1
  this.Money = [0]
  this.final_wageBill = [0]
  this.margin = [0]
  this.deltawageBill = 0
  this.Production = [0]
  this.internal_financing = [0]
  this.doubtfulDebt = [0]
  this.unitCost = [0]
  this.unsold_prod = [0]
  this.stocks_value =[0]
  this.cash_flows = [0]
  this.retained_earnings = [0]
  this.assets = [0]
  this.equity_ratio = [0]
  this.debt_ratio = [0]
  this.minsky_type = "hedge"
  this.annual_income = [0]
  this.target_debt_ratio_arr = [0]
  this.pretax_income = [0]
  this.profit_tax = [0,0]
  this.fitness; 
  this.nominal_fitness = [0];
  this.fitness_score = [0];
  this.annual_debt_charge = [0];
  this.annual_interest_charge = [0]; 

  // Tracking
  this.fullEmployment = []
  this.delta_employmentArr = []
  this.Offer = []


  // this.render = function() {
  //   this.production_capacity = this.employees.length * 
  // }

 this.brainProcess = function() {
    if(this.brain){

      var t = frameCount
      // Perception 
      var input = []

      input.push(this.income[t])
      input.push(this.cash[t])
      input.push(this.debt[t])
      input.push(this.stock.food)


      // Action 
      var output = this.brain.activate(input);
      var target_employment = this.target_employment[t-1] + ( output[0] - 0.5 ) * this.production_flexibility 
      var wage = this.wage[t-1] + ( output[1] - 0.5 ) * this.wage_flexibility 
      var price = this.price[t-1] + ( output[2] - 0.5 ) * this.price_flexibility 
      // console.warn(output, target_employment, wage, price)
    }
  }

  this.compute = function() {
    let delay = Math.min(frameCount, timePeriod/2)
    var lastProds = this.Production.slice(-delay)
    let meanProd = mean2(lastProds)
    if(meanProd > 0){
      this.production_capacity = this.Machines.length * this.Machines[0].productivity//mean2(lastProds)  
    }   //this.employees.length * this.Machines[0].productivity // sumProp(this.Machines, "productivity")// this.employees.length * this.Machines[0].productivity //sumProp(this.Machines, "productivity")
    // console.log(this.Production, lastProds, this.production_capacity)
    // if(frameCount > 100) {dzdn = dznin}
    this.commercial_capacity = 2 * this.production_capacity  //* this.employees.length * this.Machines[0].productivity
    this.debt_charge[this.age] = 0
    this.interest_charge[this.age] = 0
  }


  this.productionChoice = function() {
    var t  = this.age

    var unsold_ratio = this.stock.food / this.production_capacity
    this.unsold_ratio.push(unsold_ratio)
    this.investment[t] = 0;

    // remove destroyed machines
    for(var i = 0; i < this.Machines.length; i++ ) {
      if(this.Machines[i].deterioration <= 0){
        this.Machines.splice(i,1)
        i--
      }
    }

    if(this.age > 0 && this.age % this.production_adjust_delay == 0) {
      // console.warn("ADJUST target_employment")

      // console.warn("t : " + t)
      // console.warn ("unsold ratio : " +unsold_ratio)
      // unsold_ratio = mean([this.unsold_ratio[t-1],this.unsold_ratio[t-2],this.unsold_ratio[t-3]])
      // console.log(unsold_ratio,this.unsold_ratio[t-1],this.unsold_ratio[t-2],this.unsold_ratio[t-3])
      let adjust =  this.target_employment[t-1] * this.production_flexibility
      // console.warn("adjust : " + adjust)

      if( unsold_ratio < 1 ) {
        // console.warn("ADJUST UP",unsold_ratio, adjust, this.target_employment[t-1],  this.Machines.length)

        if( this.target_employment[t-1] + adjust <= this.Machines.length ) {
          // console.warn("ADJUSTING UP")
          this.target_employment[t] = this.target_employment[t-1] + adjust

        }
        else {

          this.target_employment[t] = this.Machines.length;

        }

      } 
      else if( unsold_ratio > 4 && this.target_employment[t-1] - adjust >= 0 ) {  /// Warning !!! TO FINISH
        this.target_employment[t] = this.target_employment[t-1] - adjust
      }
      else {
        this.target_employment[t] = this.target_employment[t-1]
      }

    }
    else {
      this.target_employment[t] = this.target_employment[t-1]
    }
    // WAAAAAAAAARNNNNNNNIIIIIIIIIIINGGGGGGGGG --> bad and unchecked
    if(this.target_employment[t] > this.Machines.length) {
        // this.investment[t] = this.target_employment[t] - this.Machines.length
        this.target_employment[t] = this.Machines.length
    }
    
  }

  this.createMachine = function(n) {
    for(var i = 0; i < n; i++ ){
      if(this.stock.food >= this.machine_value){
          this.stock.food -= this.machine_value
          this.Machines.push(new Machine(this.machine_productivity, this.effectiveInvest[t]/n))
      }
      else{
        console.error("Not enough food to create machine")
        dzdn = adin
      }
    }
  }

  this.Recruit = function() {
    var t  = this.age

    // End of work contracts
    for(var c = 0; c < this.employees.length; c++) {
      // console.warn(" HUMAN RESOURCES")
      if(frameCount - this.employees[c].date > this.employees[c].duration) {
        // console.warn(" END OF CONTRACT ",this.employees[c] )
        this.employees[c].worker.employed = false;
        this.employees[c].worker.lastEmployer = this.id;
        this.employees[c].worker.lastWage =  this.employees[c].wage
        this.employees[c].worker.contract = 0;
        this.employees.splice(c,1);
        c--;
      }
    }

    this.delta_employment = this.employees.length - Math.round( this.target_employment[t] )
    // console.error( " BORDEL ")


    // Labour Market Perception

  } 

  this.wageAdjust = function() {
    var t = this.age
    // Wage Adjusting   ------

    if(frameCount > 30 && this.employees.length < 3) {
      let samp = samplie(Firms, 3)
      for(var i = 0; i < samp.length; i++) {
        if(samp[i].Machines.length > this.Machines.length){
          this.wage[t] = samp[i].wage[t-1]
        }
      }
      // this.wage[t] = workMarket.data.bestWage[t-1]
    }

    // console.log(this.wage[t])

    // Price Maker firm
    if(!this.wage[t]) {
      if(this.fullEmployment_time > this.wage_adjust_delay ) {
        var adjust = -this.wage_flexibility
      }
      else if(this.fullEmployment_time < -this.wage_adjust_delay) {
        var adjust = this.wage_flexibility
        // console.warn("wage adjust : ", adjust, this.fullEmployment_time)
      }
      else {
        var adjust = 0
      }

      // Wage Adjust 

      if((1 + adjust) * this.wage[t-1] > minimum_wage) {
        this.wage[t] = Math.round((1 + adjust) * this.wage[t-1] * 10) / 10
      }
      else{
        this.wage[t] = this.wage[t-1] 
      }
    }

    

    // if(frameCount > 50) {
    //   dzni =zdj
    // }


  }

  this.productionFinancing = function(){
    var t = this.age
    this.loans[t] = 0
    this.wageBill[t] = sumProp(this.employees,"wage") - this.delta_employment * this.wage[t]
    
    if(this.money < this.wageBill[t]){
      // console.error(this.id + " tries to borrow")
      this.BFR =  ceilie( this.wageBill[t] - this.money )
      this.borrow(this.BFR, "ST")
      // this.loans[t] = this.BFR
    } 
    // else{
    //   this.loans[t] = 0
    // }
    // console.warn("BFR : ", this.BFR)
    // console.warn("Loans : ", this.Loans)
  }

  this.invest = function() {
    this.effectiveInvest[t] = 0
  
    let prevFood = this.stock.food

    if(this.investment[t] > 0) {
  
      let demand =  this.investment[t] * this.machine_value

      if(demand > sumProp(localMarket.products.food.Offers, "availableQ") - this.stock.food) {
        this.effectiveInvest[t] = 0
        return false
      }

      let estimated_cost = demand * localMarket.products.food.worstprice

      let prevmoney = this.money

      this.financing_need = this.money - estimated_cost
      // console.warn("previous money :" + this.money + " stock : " + this.stock.food)
      // console.warn(this)
      // console.log(this.investment[t], demand, estimated_cost, this.money, this.financing_need)
      
      if(this.financing_need < 0){
        if(this.equity_ratio[t-1] > (1 - this.target_debt_ratio) ) {
          this.borrow(-this.financing_need * 1.2, "LT")
          // this.loans[t] += -this.financing_need * 1.2
          let loan = -this.financing_need * 1.2
        }
        else{
          this.effectiveInvest[t] = 0;
          return false
        }
      }

      this.effectiveInvest[t] = 0
      for(var i in localMarket.products.food.Offers) {
        var offer = localMarket.products.food.Offers[i]

        if(offer.availableQ == 0 || offer.emetter.id == this.id){ continue }

        let finalQ = 0
        var quantity = Math.min(demand, offer.availableQ)
 

        if(demand>0) {
          finalQ = offer.buy(this, quantity)
        }

        demand -= finalQ
        this.effectiveInvest[t] += finalQ * offer.price

        if(demand <= 0 ){
          break
        }
      }

      if(demand > 0){
        console.warn("Not enough supply to invest !!", demand, this)
        cniei = nzdui
      }
      else {

        if(Math.round(this.stock.food - prevFood) < Math.round(this.investment[t] * 100)) {
          console.log(this.stock.food,  prevFood, this.stock.food - prevFood,this.investment[t] * 100)
          dzdn = dzjin
        }

          this.createMachine(this.investment[t])
      }

      if(this.effectiveInvest[t] == 0 && this.investment[t] > 0) {
        console.log(this.effectiveInvest[t],this.investment[t])
        dzdi =dzion
      }


      if(this.money > prevmoney + loan - this.effectiveInvest[t] + 0.001) {
        adzd = zd
      }
      // console.log(estimated_cost - this.effectiveInvest[t])
      // if(this.effectiveInvest[t] < estimated_cost && this.financing_need < 0) {
      //   this.gains_on_financing = min(-this.financing_need, estimated_cost - this.effectiveInvest[t])
      //   console.log(this.gains_on_financing)
      //   azdazd = dazd
      // }
      // else{
      //   this.gains_on_financing = 0
      // }

    }
    // else{
    //   this.gains_on_financing = 0
    // }


  }


  this.hirePolicy = function() {
    var t = this.age
    
    // Hire and dismiss 

    if(this.delta_employment < 0) {

      // console.warn("tries to hire")
      workMarket.addOffer(this, this.wage[t], -this.delta_employment)
    
    }

    if(0 < this.delta_employment) {

      // console.warn("tries to fire")
      this.dismiss(this.delta_employment)

    }

  }

  this.production2 = function() {
    var t = this.age

    this.Production[t] = 0;
    
    for(var i = 0; i < this.employees.length; i++) {
      var contract = this.employees[i]
      var worker = contract.worker
      if(frameCount - contract.date <= contract.duration) {
        if(worker.exhaust == 1 && this.Machines[i].used == 1) {
          this.Machines[i].process++
          this.Machines[i].used = 0
          worker.exhaust -= 1
          worker.money += contract.wage
          this.money -= contract.wage
          // this.Machines[i].deteriorate();
          if(this.Machines[i].process >= this.production_duration) {
            this.stock[this.good] += this.Machines[i].productivity * this.production_duration
            this.Production[t] += this.Machines[i].productivity * this.production_duration
            this.Machines[i].process = 0
          }
        }
      }
    }

    // MACHINE DETERIORATION (could/should be only on usage)
    for(var i = 0; i < this.Machines.length; i++){
        this.Machines[i].deteriorate();  
    }
    this.capacity_utilization[t] = this.employees.length / this.Machines.length
    if(this.Machines.length == 0) {this.capacity_utilization[t] = 1}
    this.smooth_capacity_utilization[t] = smoothen(this.capacity_utilization, this.capa_util_smoothing)
  }

  this.investment_choice = function() {
// if(this.smooth_capacity_utilization[t] > this.capacity_utilization_target && this.age % this.production_adjust_delay == 0 && frameCount > 1 && this.Machines.length < this.max_machines){
    if(this.smooth_capacity_utilization[t] > this.capacity_utilization_target  && this.age % this.production_adjust_delay == 0 && frameCount > 1 && this.Machines.length < this.max_machines){
      
      let investment = Math.max(1, Math.round(this.employees.length * this.production_flexibility))
      let estimated_cost = investment * this.machine_value * localMarket.products.food.mediumPrice
      let financing_need =  Math.max(estimated_cost - this.money,0)

      let estimated_debt_ratio = (this.debt[t-1] + financing_need + this.loans[t]) / (this.assets[t-1] + estimated_cost)

      // console.log(this, investment, estimated_cost, financing_need, estimated_debt_ratio)
 
      if(estimated_debt_ratio < this.target_debt_ratio){
        this.investment[t] = investment
      }
      else{
        this.investment[t] = 0
      }
      // console.log(this, investment, estimated_cost, financing_need, estimated_debt_ratio, this.target_debt_ratio, this.investment[t])
      // zdi =zd 
      if(this.investment[t] != 0) {
        // console.log(this, adjust, Math.round(adjust), this.investment[t])
      }
    }

  }


  this.priceCalc = function() {
    var t = this.age
      if(this.target_employment[t-1] > 0) {
        // This unsold ratio is calculated AFTER production (not the same as above)
        var stock_ratio_after_prod = this.stock[this.good] / this.production_capacity
        var adjust;

        this.stock_ratio_after_prod[t] = stock_ratio_after_prod
        // Adjust calculation
        if(stock_ratio_after_prod <= 2) {
          if(this.capacity_utilization[t] == 1) {
            adjust = this.m_price_flexibility 
          }
          else {
            adjust = this.price_flexibility
          }
        }
        else if (stock_ratio_after_prod > 2) {
         if(this.capacity_utilization[t] == 0) {
            adjust = -this.m_price_flexibility 
          }
          else {
            adjust = -this.price_flexibility
          }
        }
        else {
          adjust = 0
        }

      this.price[t] = Math.round( (1 + adjust) * this.price[t-1] * 100 ) / 100
    }
    else {
      this.price[t] = this.price[t-1]
    }
  }

  this.sell = function() {
    this.stock_before_sell = this.stock[this.good]
    if(this.stock[this.good] > 0) {
      if(this.stock[this.good] < this.commercial_capacity) {
        localMarket.addOffer(this, this.good, this.price[t], this.stock[this.good])
        this.Offer[t] = this.stock[this.good]
      }
      else {
        localMarket.addOffer(this, this.good, this.price[t], this.commercial_capacity)
        this.Offer[t] = this.commercial_capacity
      }
    }
    else{
      this.Offer[t] = 0
    }
  }
  
  this.resultCalc = function() {
    var t = this.age

    //  / ---- Exploitation Result ----- /

    var effectiveWageBill = sumProp(this.employees, "wage") // Effective wage Bill 

    this.unitCost[t] = effectiveWageBill / this.Production[t]
    if(this.employees.length == 0){this.unitCost[t] = this.unitCost[t-1]}


    if(this.Machines.length > 0 ){
      this.margin[t] = this.price[t] - this.wage[t] / this.Machines[0].productivity
    }
    else{
      this.margin[t] = 0
    }

    this.sales[t] = (this.stock_before_sell - this.stock[this.good]) * this.price[t]
    if(this.sales[t]<-1) {rden = enijun}

    this.unsold_prod[t] = this.Production[t] - (this.stock_before_sell - this.stock[this.good])

    if(this.unsold_prod[t] >= 0) {
      this.stocks_value[t] = this.stocks_value[t-1] + this.unsold_prod[t] * this.unitCost[t]
    }
    else{
      this.stocks_value[t] = this.stocks_value[t-1] + this.unsold_prod[t] * (this.stocks_value[t-1] / this.unsold_stock[t-1])
    }
    if(this.stock.food == 0) {this.stocks_value[t] = 0}
   
    if(!(this.stocks_value[t] >= 0))  { 
      sznuszin
    }
    this.delta_wageBill = this.wageBill[t] - effectiveWageBill


    this.pretax_income[t] = this.sales[t] - effectiveWageBill - this.interest_charge[t]
    this.profit_tax[t+1] = Math.max(this.pretax_income[t] * state.profit_tax, 0)
    this.income[t] =  this.pretax_income[t] - this.profit_tax[t+1]
    //this.annual_income[t] = smoothen(this.income,timePeriod)

    if(frameCount%timePeriod == 0){
        this.annual_income[t] = annualAggregate(this.income)
        this.annual_debt_charge[t] = annualAggregate(this.debt_charge)
        this.annual_interest_charge[t] = annualAggregate(this.interest_charge)
    }
    else{
        this.annual_income[t] = this.annual_income[t-1]
        this.annual_debt_charge[t] = this.annual_debt_charge[t-1]
        this.annual_interest_charge[t] = this.annual_interest_charge[t-1]
    }

    //  / ------ Payouts, Investment, Financing --------

    this.cash[t] = this.cash[t-1]  + this.loans[t] + this.pretax_income[t] - this.dividends[t] - ( this.debt_charge[t] - this.interest_charge[t] ) + this.deltawageBill - this.effectiveInvest[t] - this.profit_tax[t] - this.miscellaneous[t]
    this.fixedCapital[t] = sumProp(this.Machines,"book_value")

    this.debt[t] = sumProp(this.Loans, "principal")
    this.assets[t] = this.cash[t] + this.stocks_value[t] + this.fixedCapital[t]

    var target_equity = this.assets[t] * ( 1 - this.target_debt_ratio)

    this.cash_flows[t] = this.cash[t-1] + this.income[t]  
    // console.warn(" result to affect : ", this.result_to_affect, this.income, this.equity[t] )
    // this.reserve_ratio[t] = this.equity[t-1] / this.debt[t]

    this.equity[t] =  this.assets[t] - this.debt[t] //this.equity[t-1] - this.dividends[t] + this.income[t]

    this.Money[t] = this.money

    // if(Math.abs(this.Money[t] - this.cash[t]) > 0.01 && frameCount > 2) { 
    //   console.error("ACCOUNTING FAILURE", this.Money[t] - this.cash[t], this.investment[t], this.deltawageBill, this.debt_charge[t])
    //   xzdz = FAILURE
    // }

    this.equity_ratio[t] =  this.equity[t] / this.assets[t]
    this.debt_ratio[t] = this.debt[t] / this.assets[t]

    if(this.equity_ratio[t] > 0.05) {
      this.leverage[t] = this.debt[t] / this.equity[t]
    }
    else {
      this.leverage[t] = 19
    }

    // -------- PAYOUTS -----------
    if(this.income[t] > 0 && this.equity[t] > target_equity){
      this.dividends[t+1] = min(this.income[t] * this.dividends_ratio, this.cash[t]) //min(( this.equity[t] / target_equity ), this.max_dividend_rate, this.cash[t]) * this.income[t] 
    }
    else{
      this.dividends[t+1] = 0 
    }
    this.retained_earnings[t+1] = this.income[t] - this.dividends[t+1]

    // Performance and financial fragility
    this.profit_rate[t] = this.annual_income[t] / this.fixedCapital[t]
    if(this.fixedCapital[t] == 0) {
      this.profit_rate[t] = 0
    }


    let cash_flows = this.income[t] + this.interest_charge[t]
    if(cash_flows > this.debt_charge[t]) {
      this.minsky_type = "hedge"
    }
    else {
      if(cash_flows > this.debt_charge[t] - this.interest_charge[t]){
        this.minsky_type = "speculative"    
      }
      else if(cash_flows < this.interest_charge[t]){
        this.minsky_type = "ponzi"    
      }
    }


    // if(this.cash_flows[t] > 0) {
    //   if( this.reserve_ratio[t] > this.target_reserves){
    //       // Pay dividends
    //       this.retained_earnings[t] = this.retain_ratio * this.cash_flows[t]
    //       this.dividends[t+1] = this.cash_flows[t] -  this.retained_earnings[t]
    //   }
    //   else{
    //       this.retained_earnings[t] = this.cash_flows[t]
    //       this.dividends[t+1] = 0
    //   }
    // }
    // else{
    //   // No dividends
    //   this.dividends[t+1] = 0
    //   this.retained_earnings[t] = 0
    // }
    // This could (and has to) be made better (if hierarchy)

    this.vacancies[t] = Math.round(this.target_employment[t]) - this.employees.length

    // FULL EMPLOYMENT MODE ACTIVATING
    if(this.employees.length >= Math.round(this.target_employment[t])) {

      if(this.fullEmployment_time < 0 ) {
        this.fullEmployment_time = 0
      }
      else {
        this.fullEmployment_time += 1  
      }
    }

    // SEARCHING JOB MODE ACTIVATING
    if(this.employees.length < Math.round(this.target_employment[t])) {
        if( 0 < this.fullEmployment_time ) {
          this.fullEmployment_time = 0
        }
        else{
          this.fullEmployment_time -= 1
        }

    }

    // Tracking Variables 
    this.unsold_stock[t] = this.stock[this.good]
    this.nbr_employees[t] = this.employees.length
    this.fullEmployment[t] = this.fullEmployment_time
    this.delta_employmentArr[t] = this.delta_employment
    this.final_wageBill[t] = effectiveWageBill
    this.internal_financing[t] = (this.wageBill[t] - this.BFR)  / effectiveWageBill
    this.nbr_machines[t] = this.Machines.length
    this.target_debt_ratio_arr[t] = this.target_debt_ratio
    // this.doubtfulDebt[t] = sumProp(this.Loans.filter((loan) => loan.quality == "doubtful" && loan.principal > 0  ), "principal")

    this.miscellaneous[t+1] = 0
   }

  this.profitTax = function() {
    var t = this.age
    this.payTax(this.profit_tax[t])
  }

  this.payDividends = function() {
      var t = this.age

      if(this.dividends[t] > 0) {
        // console.warn("tries to pay dividends")
        this.totalShares = this.Shares.length
        // console.warn("total shares " + this.totalShares )
        // console.warn("total dividend " + amount )

        var dividend_per_share = this.dividends[t] / this.totalShares

        // console.warn("tdividend per share " + dividend_per_share  )
        for(var i in this.Shares) {
          this.Shares[i].payDividend(dividend_per_share)
          
          displayMoneyTransfer(this, this.Shares[i].owner, dividend_per_share, 250,0)
        }
      }
      else if( this.dividends[t] < 0) {
      }
  }


  this.fitnessCalc = function() {
    //var lastIncomes = this.income.slice(-timePeriod)
    this.fitness = this.annual_income[t] //this.profit_rate[t] //this.annual_income[t] // lastIncomes.reduce((accumulator, currentValue) => accumulator + currentValue)
    this.nominal_fitness[t] = this.fitness

    // if(frameCount > 12) {dznio = iznod}
  }

  this.evolve = function() {
    let draw = Math.random(1)
    if(draw < 0.5) {
      var model = random(FirmsPop.matingpool)
      this.target_debt_ratio =  model.target_debt_ratio * (1.05 - Math.random() * 0.1 )

    }
    if(draw > 0.5) {
      this.target_debt_ratio = Math.random() //Math.max(Math.min( this.target_debt_ratio * (1.5 - Math.random()), 1), 0)
    }
    if(draw > 1) {
       this.target_debt_ratio = Math.random()
    }
    // if(draw > 0.7) {
    //   this.target_debt_ratio =  Math.max(Math.min( this.target_debt_ratio * (1.5 - Math.random()
    // }
  }


  this.evolve = function() {
    let draw = Math.random(1)
    if(draw < 0.5) {
      var model = random(FirmsPop.matingpool)
      this.target_debt_ratio =  model.target_debt_ratio + (0.05 - Math.random() * 0.1 )

    }
    if(draw > 0.5) {
      this.target_debt_ratio = Math.max(Math.min(this.target_debt_ratio + (0.5 - Math.random() * 1), 1), 0) //Math.random() //
    }
    if(draw > 1) {
       this.target_debt_ratio = Math.random()
    }
    // if(draw > 0.7) {
    //   this.target_debt_ratio =  Math.max(Math.min( this.target_debt_ratio * (1.5 - Math.random()
    // }
  }

  this.copy = function(){
    var model = random(FirmsPop.matingpool)
    this.target_debt_ratio = model.target_debt_ratio * (1.05 - Math.random() * 0.1 )
  }

  this.dismiss = function(n) {

    for(var i = 0; i < n; i++){
      var contract = this.employees[this.employees.length-1]
        contract.worker.employed = false;
        contract.worker.contract = 0;
        contract.worker.employer = 0;
        contract.worker.lastEmployer = this.id;
        contract.worker.lastWage = contract.wage  
        this.employees.splice(-1,1)
    }
  }



  this.buy = function () {
    for(var i in this.Demand){
      if(this.Demand[i] > 0 && localMarket.products[Resources[i]].Offers.length > 0) {
          var offer = localMarket.products[Resources[i]].Offers[0]
          /*console.log('Firm try to buy ' + this.Demand[i] +
            " of " + Resources[i] + 
            " to " + offer.emetter.id +
            " at " + offer.price + "$" )*/
          var resource = Resources[i]
          exchange(this, offer.emetter, offer.prop, offer.price, this.Demand[i])
      }
    }
  }


  this.payWages = function() {
    if(this.MonthlyNetResult < 0) {
      this.wage -= 5
      if(this.wage < minimumWage) {
        this.wage = minimumWage
      }
    }

    for(u=0; u < this.employees.length; u++) {
      this.money -= this.wage 
      this.employees[u].money += this.wage 
      this.employees[u].income = this.wage 
    }
  }



  // ---- Stocks & Shareholders --------------



  this.stockIssue = function(n) {
    for(var i = 0; i < n; i++) {
      this.Shares.push(new share(this, random(Workers), 1))
    }
  }

}


function arraySum(array1, array2) {
  var output = []
  for(var i = 0; i < array1.length; i++){
   output[i] = array1[i] + array2[i]
  }
  return output
}

function arrayMult(array, x) {
  output = []
  for(var i = 0; i < array.length; i++){
    output[i] = array[i] * x
  }
  return output
}

function arrayLastElems(array, n) {
  var arr = []; 
  for(i=0; i < n; i++) {
    if(array[array.length-i]) {arr.push(array[array.length-i])} ;
  }
  return arr;
}

function RawCost(prop) {
  var Matrix = ProdMatrix[prop]
  var Matrik = {
    rock: Matrix[0],
    food: Matrix[1],
    wood: Matrix[2],
    iron: Matrix[3]
  }
  
  var cost = 0
  for(var prop in Matrik) {
    cost += Matrik[prop] * localMarket.products[prop].bestprice
  }

  return cost
}

function canProduce (agent, prop) {
  var Matrix = ProdMatrix[prop]
  var Matrik = {
    rock: Matrix[0],
    food: Matrix[1],
    wood: Matrix[2],
    iron: Matrix[3]
  }

  if(  Matrik.rock <= agent.stock.rock 
    && Matrik.food <= agent.stock.food 
    && Matrik.wood <= agent.stock.wood 
    && Matrik.iron <= agent.stock.iron ) 
  { 
    return true
  }
  else {
    return false
  }
}


function resultAccount(firm) {
  // Receipts
  this.Sales = 0
  this.financialIncome = 0

  // Expenses
  this.Wages = firm.employees.length * firm.wage 
  this.debtCharge = 0 
  this.rawCost = 0
  this.amortization = 0

  this.netResult = ( + this.Sales 
                   + this.financialIncome
                   - this.Wages
                   - this.debtCharge
                   - this.rawCost
                   - this.amortization ) 
}

function balanceSheet() {
  // Assets
  this.fixedCapital = 0
  this.stocks = 0 
  this.cash = 100

  this.totalAssets = this.fixedCapital + this.stocks + this.cash

  // Liabilities
  this.equity = 100
  this.debt = 0
  this.result = 0


  this.totalLiabilities = this.equity + this.debt + this.result 
  
}



function Machine (prod, val) {
  this.productivity = prod
  this.used = 1
  this.process = 0
  this.creationDate = frameCount
  this.init_value = val
  this.book_value = val
  this.lifetime = randomInt(60,120)
  this.deterioration = this.lifetime


  this.deteriorate = function() {
    this.deterioration--
    this.book_value = this.init_value * (this.deterioration / this.lifetime)
  }
}

function ceilie(x) {
  return Math.ceil(x * 100) / 100
}

function smoothen(arr, n) {
    let delay = Math.min(frameCount, n)
    var lastValues = arr.slice(-delay)
    return mean2(lastValues)
}

function annualAggregate(arr) {
  let annualValues = arr.slice(-timePeriod)
  let agg = 0
  for(var i = 0; i < annualValues.length; i++) {
      agg += annualValues[i]
  }
  return agg
}