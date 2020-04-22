function agent(x, y, id, brain){
  if(brain){this.brain = brain}


  Agents.push(this)
  // General
  this.id = id;
  this.pos = createVector(x,y);
  this.clor = [250,250,250];
  this.size = agentSize;

  // SMART
  this.Tasks = []

  // Real 
  this.stock = {
    rock:0,
    food:0,
    wood:0,
    iron:0,
    house:0,
    gold:0,
    jewels:0
  }

  // Economic
  this.money = 0;
  this.income = 0;
  this.raw = 0;
  this.food = 0;
  this.alive = true;
  this.consumption = 0.1;
  this.debt = 0;
  this.leverage = 0
  this.Orders = [];
  this.Shares = []
  this.Investments = [];
  this.Loans = [];
  this.Assets = [];
  this.buyOps = [];
  this.sellOps = [];


    // Methods 
    this.show = function() {
      show(this);
    }

    this.borrow = function(amount) {
        var newLoan = Bank.loanIssue(this, amount, "trustful")
        // console.log("agent borrow")
        if(newLoan != "fail") {
          // this.Loans.push(newLoan)
        }
        else{
          // console.error("Loan Failed", newLoan)
        }
    }

    this.makeDeposit = function(amount) {
      if(this.money<1){
        this.Loans.push(Bank.depositIssue(this, amount))
      }
    }

    this.reimburse = function () {
      var financialExpenses = 0
      for(var i = 0; i < this.Loans.length; i++) {
        if(this.Loans[i].principal > 0) {
          financialExpenses += this.Loans[i]
          this.Loans[i].reimburse(10)
        }
      }
      // console.log(financialExpenses)
    }
 

    this.payDebt = function() {
      for(var i=0; i < this.Loans.length ; i++) {
        this.Loans[i].reimburse(3)
        if(this.Loans[i].principal < 0) {this.Loans.splice(i,1)}
      }
      this.debt = sumProp(this.Loans,"principal")
    }

    this.hunger = function() {
      this.life -= 1
    }

    this.compute = function() {
      this.assetValue = 0
      for(var i in this.stock) {
        this.assetValue += foodMarket.Markets[i].price * this.stock[i]
      }
      this.totalAssetsValue = this.money + this.assetValue

      for(var asset in this.portfolio) {
        if(this.assetValue != 0) {
          this.portfolio[asset] = this.stock[asset] * Globals.price[asset] / this.assetValue
        }
        else {
          this.portfolio[asset] = 0     
        }
      }
    }
}





