console.log("Firms Loaded")

function Firm (x, y, id, prop, brain) {
  agent.call(this,x, y, id, brain)
  
  this.id = "firm" + String(newId()) ;
  console.log(this.id)

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
    debt:0,
    leverage:0,
    ownFunds:0,

    //Income
    margin:0,
    sales:0,
    wageBill:0,
    final_wageBill:0,
    income:0,   
    debt_charge:0,
    doubtfulDebt:0,
    dividends:0,

    // Flows 
    loans:0,

    // Behaviour
    nbr_employees:0,
    Production:0,
    target_employment:0,
    delta_employmentArr:0,
    wage:0,
    fullEmployment:0,
    vacancies:0,

    unsold_stock:0,
    unsold_ratio:0,
    stock_ratio_after_prod:0,

    price:0,

  }

  this.trackingVariables = {

  }

  this.Machines = []
  this.nbr_machines = randomInt(20,26)
  for(var p=0; p < this.nbr_machines; p++) {
    this.Machines.push(new Machine(40))
  }


  this.money = 0;

  this.delta_employment=0;

  this.solvability = "trustful"

  // | -- PARAMETERS -- |
  this.good = prop

  this.production_flexibility = 1/6;
  this.production_adjust_delay = 3;
  this.target_reserves = 0.3

  // Own parameters - specific to one firm
  this.production_capacity; 
  this.production_duration = 1
  this.selling_capacity;
  this.wage_adjust_delay = randomInt(0,7);
  this.wage_flexibility = 0.01;
  this.price_flexibility = 0.01;
  this.m_price_flexibility = 0.05;

  // | -- STATE VARIABLES -- |

  this.income = [0];
  this.debt_charge = [0];
  this.interest_charge = [0];
  this.netResult;
  this.dividends = [0,0];
  this.cash_after_dividends;
  this.cash = [0,0]

  this.ownFunds = [0, 0];
  this.reimbursment;
  this.BFR;
  this.loans = [0];

  this.stock_after_prod;
  this.unsold_stock = [0];
  this.target_employment = [10];

  this.fullEmployment_time = 0;
  this.wage  = [300]; 
  this.wageBill = [0];
  this.price = [7];


  // | -- AUXILIARY VARIABLES -- |

  this.capacity_utilization = [0];
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

  // Tracking
  this.fullEmployment = []
  this.delta_employmentArr = []

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

  this.ageing = function() {
    this.age = frameCount - this.creation
  }

  this.compute = function() {
    this.production_capacity = sumProp(this.Machines, "productivity")// this.employees.length * this.Machines[0].productivity //sumProp(this.Machines, "productivity")
    this.debt_charge[this.age] = 0
    this.interest_charge[this.age] = 0
  }


  this.productionChoice = function() {
    var t  = this.age

    var unsold_ratio = this.stock.food / this.production_capacity
    this.unsold_ratio.push(unsold_ratio)

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

          this.target_employment[t] = this.Machines.length 

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

    // Labour Market Perception

    if(this.fullEmployment_time > this.wage_adjust_delay) {
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
      this.wage[t] = (1 + adjust) * this.wage[t-1]
    }
    else{
      this.wage[t] = this.wage[t-1] 
    }


  }

  this.productionFinancing = function(){
    var t = this.age

    this.wageBill[t] = sumProp(this.employees,"wage") - this.delta_employment * this.wage[t]
   
    if(this.money < this.wageBill[t]){
      // console.error(this.id + " tries to borrow")
      this.BFR =  ceilie( this.wageBill[t] - this.money )
      this.borrow(this.BFR)
      this.loans[t] = this.BFR
    } 
    else{
      this.loans[t] = 0
    }
    // console.warn("BFR : ", this.BFR)
    // console.warn("Loans : ", this.Loans)
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

  this.production = function() {
    var t = this.age

    this.Production[t] = 0;
    
    for(var i = 0; i < this.employees.length; i++) {
      var contract = this.employees[i]
      var worker = contract.worker
      if(frameCount - contract.date <= contract.duration) {
        if(worker.exhaust == 1 && this.Machines[i].used == 1) {
          this.stock[this.good] += this.Machines[i].productivity
          worker.money += contract.wage
          this.money -= contract.wage
          worker.exhaust -= 1
          this.Machines[i].used = 0
          this.Production[t] += this.Machines[i].productivity
        }
      }
    }
    this.capacity_utilization[t] = this.employees.length / this.Machines.length
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
          if(this.Machines[i].process >= this.production_duration) {
            this.stock[this.good] += this.Machines[i].productivity * this.production_duration
            this.Production[t] += this.Machines[i].productivity * this.production_duration
            this.Machines[i].process = 0
          }
        }
      }
    }
    this.capacity_utilization[t] = this.employees.length / this.Machines.length
  }


  this.priceCalc = function() {
    var t = this.age
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

      // New price calculation
      // if(adjust > 0 && this.delta_employment == 0) {
      //   adjust = adjust * 2 // the firm is already at full employment
      // }

      // if(adjust < 0 && this.target_employment == 0) {
      //   adjust = adjust * 2 // the firm is already at 0 employment
      // }

      this.price[t] = (1 + adjust) * this.price[t-1]
  }

  this.sell = function() {
    this.stock_before_sell = this.stock[this.good]
    if(this.stock[this.good] > 0) {
      localMarket.addOffer(this, this.good, this.price[t], this.stock[this.good])
    }
  }
  
  this.resultCalc = function() {
    var t = this.age

    this.margin[t] = this.price[t] - this.wage[t] / this.Machines[0].productivity

    this.sales[t] = (this.stock_before_sell - this.stock[this.good]) * this.price[t]
    var effectiveWageBill = sumProp(this.employees, "wage") // Effective wage Bill 
    this.delta_wageBill = this.wageBill[t] - effectiveWageBill
    this.income[t] = this.sales[t] - effectiveWageBill - this.interest_charge[t]

    this.result_to_affect = this.ownFunds[t-1] + this.income[t]  
    // console.warn(" result to affect : ", this.result_to_affect, this.income, this.ownFunds[t] )
    
    if(this.result_to_affect > 0) {
      // Pay dividends
      this.ownFunds[t] = this.target_reserves * this.result_to_affect
      this.dividends[t+1] = this.result_to_affect -  this.ownFunds[t]
    }
    else{
      // No dividends
      this.dividends[t+1] = 0
      this.ownFunds[t] = this.result_to_affect

    }

    this.debt[t] = sumProp(this.Loans, "principal")

    this.cash[t] = this.cash[t-1]  + this.loans[t] + this.income[t] - this.dividends[t] - ( this.debt_charge[t] - this.interest_charge[t] ) + this.deltawageBill
    this.Money[t] = this.money
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
    // this.doubtfulDebt[t] = sumProp(this.Loans.filter((loan) => loan.quality == "doubtful" && loan.principal > 0  ), "principal")

    if(this.ownFunds[t] > 10 ) {
      this.leverage[t] = this.debt[t] / this.ownFunds[t]
    }
    else {
      this.leverage[t] = 0
    }

   }


  this.payDividends = function() {
      var t = this.age

      if(this.dividends[t] > 0) {
        // console.warn("tries to pay dividends")
        this.totalShares = sumProp(this.Shares, "amount")
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
        console.error("Firm pays negative dividends !!", this)
      }
  }


  this.fitnessCalc = function() {
    this.brain.score = this.income.reduce((accumulator, currentValue) => accumulator + currentValue)
  }












  this.dismiss = function(n) {
    console.log(this.employees.length, n)
    for(var i = 0; i < n; i++){
      console.error("Dismiss employee", this)
      var contract = this.employees[this.employees.length-1]
        contract.worker.employed = false;
        contract.worker.contract = 0;
        contract.worker.employer = 0;
        contract.worker.lastEmployer = this.id;
        this.employees.splice(-1,1)
      console.error("Dismiss employee", this.employees.length)
    }
  }



  this.demandCalc = function() {
    if(this.Processing)
    for(var p in this.ProductionGoal) {
      var product = this.ProductionGoal[p].product
      var q = this.ProductionGoal[p].q
      //console.log(product, q, ProdMatrix[product])
      var needs = arrayMult(ProdMatrix[product], q)
      //console.log(product, q, needs)
      this.Demand = arraySum(this.Demand, needs)
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


  this.buildResultAccount = function() {
    this.resultAccount = {}
    
    this.resultAccount.receipts = {
      sales: this.MonthlySales,
      financialIncome: 0,

      total: this.MonthlySales + 0
    }

    this.resultAccount.expenses = {
      wages: this.LabourCost,
      debtCharge: 0 ,
      rawCost: this.MonthlySpendings,
      amortization: 0,

      total: this.LabourCost + this.MonthlySpendings
    }

    this.resultAccount.netRes = this.resultAccount.receipts.total - this.resultAccount.expenses.total

    }

  
  this.buildBalanceSheet = function () {
    var balanceSheet = {}

    balanceSheet.Assets = {
      fixedCapital: this.fixedCapital,
      // stocks: this.assetsValue,
      cash:  this.cash,
      // total: this.fixedCapital + this.assetsValue + this.money

    }

    balanceSheet.Liabilities = {
      ownFunds: this.ownFunds,
      debt: this.debt,
      // result: this.MonthlyNetResult,
      // total:this.ownFunds + this.debt + this.MonthlyNetResult

    }

    this.balanceSheet = balanceSheet
    this.balanceSheetArr.push(balanceSheet)
  }


  // ---- Stocks & Shareholders --------------



  this.stockIssue = function(n) {
    for(var i = 0; i < n; i++) {
      this.Shares.push(new share(this, random(Workers), 1))
    }
  }

}


/*


function firm (x, y, id, pDNA) {
  agent.call(this,x, y, id, pDNA)
 
  this.type = 'firm';
  this.clor = [100,100,100]

  this.employees = []
  this.wage = 100
  this.extractionRate = 0.1
  this.price = 5
  this.unitCost;
  this.profitRate = 1/5;

  this.monthlyProd = 0 
  this.MonthlyOutputs = []


  this.priceAdjuster = function() {
   if(this.raw > 3) { this.price = this.price * 0.9}
   else {this.price = this.price * 1.1 }
  }

  this.sell = function(task) {
    // Remove Unmet Orders
    for(var u=0; u < task.orders.length; u++) {
      var order = task.orders[u] 
      if(order.state == "unmet"){
        req = foodMarket.cancelOrder(order.id, order.emetter)

      }
    }

    // Makes new Order
    newOrder = foodMarket.makeOrder("sell", this.price, task.targetQ, this)
    task.orders.push(newOrder)
    this.Orders.push(newOrder)
  }

  this.priceCalc = function() {
    this.unitCost = 1/this.extractionRate * this.wage / timePeriod
    this.price = this.unitCost * (1 + this.profitRate)
  }

  this.priceAdjuster = function() {
    if(this.raw > 100) { this.price = this.price * 0.9}
    else {this.price = this.price * 1.1 }
  }

  this.payWages = function() {
    for(u=0; u < this.employees.length; u++) {
      this.money -= this.wage 
      this.employees[u].money += this.wage 
      this.employees[u].income = this.wage 
    }
  }

  this.operate = function(){
    for(var u=0; u < this.Tasks.length; u++){

        // Remove Completed task
        if(this.Tasks[u].completion == 0) {
          this.Tasks.splice(u,1)
        }

        // Try again to complete the task
        else {
          this.sell(this.Tasks[u])
        }

    }
  }

  this.resultCalc = function() {
    this.MonthlyOutputs.push(this.monthlyProd)
    this.monthlyProd = 0
  }
  
}
*/
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

function Produce (producer, prop) {
  var Matrix = ProdMatrix[prop]
  var Matrik = {
    rock: Matrix[0],
    food: Matrix[1],
    wood: Matrix[2],
    iron: Matrix[3]
  }
  console.error(Matrik, producer.stock)
  for(var p in Matrik) {
    producer.stock[p] -= Matrik[p]
  }
  console.error(Matrik, producer.stock)
}

function buyFirm(x, y, id, pDNA) {
  firm.call(this,x, y, id, pDNA)
  this.LabourCost = 0
  this.clor = [255, 131, 0]

  this.act = function() {
    for(var asset in this.stock) {

      // -----  Expectations -------
      this.expectedDemand = 3
      this.totalPrice = this.expectedDemand * foodMarket.Markets[asset].price
      var d = this.money - this.totalPrice + 10
      if(d < 0 ) {
        this.borrow(-d)
      }
      foodMarket.makeNow("buy", asset , this.expectedDemand, this)  
      }
  

      // ----- Sales ----------
      this.price = foodMarket.Markets[asset].price // * this.mark_up

      // if(this.stock[asset] > 3) {
      //   this.stock[asset] -= 3 // Effective demand
      //   this.money += 3 * this.price
      // }
      // else{
      //   this.money += this.stock[asset] * this.price
      //   this.stock[asset] = 0
      // }

  
    // if(this.money < 10) {
    //   this.borrow(50)
    // }
  }
}

function sellFirm(x, y, id, pDNA) {
  firm.call(this,x, y, id, pDNA)
  this.LabourCost = 0
  this.extractionCost = {
    rock:3,
    food:3,
    wood:3,
    iron:3,
    house:3,
    gold:3
  }


  this.productivity = {
    rock:3,
    food:3,
    wood:3,
    iron:3,
    house:3,
    gold:3
  }

  this.act = function() {
  for(var asset in this.stock) {

  // -------- Production --------
  this.stock[asset] += this.productivity[asset]

  // -----  Price Calculation -------
  var price = this.extractionCost[asset] * this.mark_up

  // ------- Selling -----------
  // foodMarket.makeNow("sell", asset , this.stock[asset], this)  
  var newOrder = foodMarket.makeOrder(asset , "sell", price, this.stock[asset], this) 

  // ------- Paying Wages and Raw Material -------
  // this.money -= this.extractionCost[asset] * this.productivity[asset]
  this.LabourCost += this.extractionCost[asset] * this.productivity[asset]
  }
  // if(this.money < 10) {
  //   this.borrow(100)
  // }

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
  this.ownFunds = 100
  this.debt = 0
  this.result = 0


  this.totalLiabilities = this.ownFunds + this.debt + this.result 
  
}

 this.resultCalc = function() {
    this.MonthlyOutputs.push(this.monthlyProd)
    this.monthlyProd = 0

    this.MonthlySales = 0 
    for(var u = 0; u < this.sellOps.length; u++) {
      if(this.sellOps[u].time > frameCount - 10) {
        this.MonthlySales += this.sellOps[u].price * this.sellOps[u].q
      }
    }

    this.MonthlySpendings = 0 
    for(var u = 0; u < this.buyOps.length; u++) {
      if(this.buyOps[u].time > frameCount - 10) {
        this.MonthlySpendings += this.buyOps[u].price * this.buyOps[u].q
      }
    }

    this.MonthlyLabourCost = this.employees.length * this.wage 
    this.MonthlyNetResult = this.MonthlySales - this.MonthlyLabourCost - this.MonthlySpendings //- this.MonthlyDebtCharge
    //console.warn(this.MonthlySales, this.MonthlyLabourCost, this.MonthlySpendings, this.MonthlyDebtCharge, this.MonthlyNetResult)
    this.MonthlyNetResults.push(this.MonthlyNetResult)

    this.addedValue = this.MonthlySales - this.MonthlySpendings

    this.MonthlyDebtCharge = 0
    this.Actifs = [this.money]

    this.assetsValue = []
    for(var prop in this.stock) {
      this.assetsValue.push(this.stock[prop] * localMarket.products[prop].bestprice);
      console.error(this.stock[prop], localMarket.products[prop].bestprice)
    }
    console.error(this.assetsValue)
    this.assetsValue = this.assetsValue.reduce((accumulator, currentValue) => accumulator + currentValue)


    this.Passifs =  [this.debt, this.MonthlyNetResult]
    this.totalPassif = this.Passifs.reduce((accumulator, currentValue) => accumulator + currentValue)
    this.totalActif =  this.Actifs.reduce((accumulator, currentValue) => accumulator + currentValue)
  }


function Machine (prod) {
  this.productivity = prod
  this.used = 1
  this.process = 0
}

function ceilie(x) {
  return Math.ceil(x * 100) / 100
}