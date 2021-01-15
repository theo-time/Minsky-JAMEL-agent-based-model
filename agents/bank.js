class bank {
  constructor(x, y, type, id) {
    Firm.call(this)
    this.id = "Bank" + id
    this.pos = createVector(x,y);
    this.type = type;
    this.clor = [255, 225, 0]
    this.size = agentSize

    this.Loans = {}
    this.oldLoans = []
    this.Accounts = []

    this.balanceSheet = 0;
    this.balanceSheetArr = [];

    for(var i in Agents) {
      this.Accounts[i] = new currentAccount(Agents[i])
      Agents[i].bankAccount = this.Accounts[i]
    }

    this.Tables = {
      month_inflation:0,
      base_interest:0,
      totalLoans:0,
      targetOwnFunds:0,
      Profits:0,
      ownFunds:0,
      result_to_affect:0,
      dividends:0,
      cash:0,
    }

  // | -- PARAMETERS -- |

    this.credit_duration_ST = 12
    this.credit_duration_LT = 80
    this.reserve_rate = 0.1
    this.target_inflation = 0.02 / 12
    this.inflation_reaction = 2
    this.risk_premium = 0.04


  // | -- STATE VARIABLES -- | 
    this.interest_rate = 0.05
    this.m_interest_rate = 0.1
    this.base_interest = [0]
    this.annual_inflation = [0]
    this.month_inflation = [0]
    this.ownFunds = [0,0];
    this.dividends=  [0,0]; 
    this.Profits = [0] ; 
    this.totalLoans = [0];
    this.result_to_affect = [0];
    // this.maxLeverage = [];

  // | -- AUXILIARY VARIABLES -- |  for now, but it could be used lateer...

    this.trustLoans = 0
    this.doubtLoans = 0
    this.bankruptcies = 0
    this.profits = 0
    this.targetOwnFunds = [0]
    this.cash = [0]
    this.moneyDestruction= [0]

    this.out_of_market = 0 
    this.bankrupted = 0


    this.transfer = function(emetter, recipient) {

      // TO DO ....

    }

    this.interestAdjust = function() {
      if(frameCount > timePeriod + 1){
        this.annual_inflation[t-1] = (Globals.arr.averagePrice[t-2] - Globals.arr.averagePrice[t - timePeriod - 2]) / Globals.arr.averagePrice[t - timePeriod - 2]
        this.month_inflation [t-1] = this.annual_inflation[t-1] / 12
        this.interest_rate = max(this.inflation_reaction * (this.month_inflation[t-1] - this.target_inflation), 0) 
        this.m_interest_rate = this.interest_rate + this.risk_premium
        this.base_interest[t] = this.interest_rate
        // zd =z
      }
    }

    this.loanIssue = function(borrower, amount, quality, type) {
        if(quality == "trustful"){
          var interest = this.interest_rate
        }
        else if(quality == "doubtful" || quality == "badDebt"){
          var interest = this.m_interest_rate
        }

        if(type == "ST"){
          var delay = this.credit_duration_ST
        }
        else if(type == "LT"){
          var delay = this.credit_duration_LT
        }

        if(borrower.id == "state"){
          var interest = 0
        }


        if(!delay){zd=dznd}

        borrower.loans[t] += amount
        borrower.money += amount 
        var Loan = new loan(borrower, amount, interest, delay, quality)

        if(!this.Loans[borrower.id]){this.Loans[borrower.id] = []}

        this.Loans[borrower.id].push(Loan)
        borrower.Loans.push(Loan)

        // Visualisation
        push()
          strokeWeight(amount/200*30)
          stroke(255,255,0)
          line(borrower.pos.x, borrower.pos.y, Bank.pos.x, Bank.pos.y)
        pop()

        return Loan
    }



    this.recoverDoubtful = function() {
      this.profits = 0    
      for(var i = 0; i < this.Loans.length; i++) {

        if(this.Loans[i].quality == "doubtful") {
          var reimburse = this.Loans[i].reimburseDoubt()

          if(reimburse) {
            this.oldLoans.push(this.Loans[i])
            this.Loans.splice(i,1)
          }
          else{
            // this.bankruptcy(this.Loans[i].borrower, this.Loans[i])
          }
        }
      }

    }

    this.recoverCredits = function() {
    this.age = frameCount - this.creation

    this.bankruptcies = 0  
    this.moneyDestruction = 0
    this.profits = 0 

      for(var firm in this.Loans) {

        if(this.Loans[firm].length == 0) {continue}

        let interests = 0
        let reimbursment = 0
        let borrower = this.Loans[firm][0].borrower

        // Calculation of payment obligations
        for(var i = 0; i < this.Loans[firm].length; i++) {

            // --- Remove reimbursed loan ---- 
            if(this.Loans[firm][i].principal == 0) {
              this.Loans[firm][i].principal = 0
              this.oldLoans.push(this.Loans[firm][i])
              this.Loans[firm].splice(i,1)
              i--
              continue
            }

            if(this.Loans[firm][i].type == "amortized" && this.Loans[firm][i].date != frameCount) {
              interests += this.Loans[firm][i].interest * this.Loans[firm][i].principal
              reimbursment += this.Loans[firm][i].init_sum / this.Loans[firm][i].duration
            }

        }

        let sum = reimbursment + interests
        // console.log(sum, reimbursment, interests, borrower.money)

        // Overdraft Loan if unable to repay
        if(borrower.money < sum ) {
            let delta_money = sum - borrower.money 
            this.loanIssue(borrower, delta_money + 1, "doubtful", "ST")
        }

        // Then proceed to payments 
        for(var i = 0; i < this.Loans[firm].length; i++) {
            if(this.Loans[firm][i].type == "amortized" && this.Loans[firm][i].date < frameCount) {
              reimbursment = this.Loans[firm][i].init_sum / this.Loans[firm][i].duration
              this.Loans[firm][i].payInterest()
              this.Loans[firm][i].reimburse(reimbursment)
            }
        }

      }
  

    }


    this.handleBankruptcies = function() {
      for(var i = 0; i < Firms.length; i++){
        // Insolvency Bankruptcy 
        if(Firms[i].equity[t] < 0) {
          // Firms[i].solvability = "bankrupt"

          // Dismiss all employees
          Firms[i].dismiss(Firms[i].employees.length)
          
          // Compute losses
          let debt = sumProp(Firms[i].Loans, "principal")
          let liquidity = Firms[i].money
          let loss = debt - liquidity

          // console.log(Firms[i], debt, liquidity, loss, Firms[i].stock.food, Firms[i].Machines, this.money, this.totalLoans[t-1])
          
          if(Bank.money < loss) {
            console.error("the Economy has crashed")
            // play = false
          }


          // Take liquidities and register losses
          Firms[i].money -= liquidity
          Firms[i].miscellaneous[t+1] += liquidity
          this.money -= loss
          this.profits -= loss
          this.moneyDestruction += debt

          // Cancel all Loans
          this.Loans[Firms[i].id] = []
          Firms[i].Loans = []

          // Copy a successful firm
          Firms[i].copy()

         // zddz = zdzj
          // Firms.splice(i,1)

          // i--
          this.bankruptcies++
          this.bankrupted++
        }

        // No production bankruptcy 
        if(Firms[i].Machines.length == 0) {

          Firms[i].Machines.push(new Machine(Firms[i].machine_productivity, Firms[i].machine_value *  localMarket.products.food.mediumPrice))
          // console.log(Firms[i].machine_value, localMarket.products.food.mediumPrice)
          
          Firms[i].target_employment[t] = 1
          this.bankruptcies++
          
          // play = false
          Firms[i].copy()
          this.out_of_market++ 
        }

      }
    }

    this.balanceSheetCalc = function() {
      var t = frameCount

      this.trustLoans = 0
      this.doubtLoans = 0

      for(var firm in this.Loans){

          for(var i = 0; i < this.Loans[firm].length; i++) {

            if(this.Loans[firm][i].quality == "trustful"){
              this.trustLoans += this.Loans[firm][i].principal 
            }
            else{
              this.doubtLoans += this.Loans[firm][i].principal  
            }

          }
        }
    }

    this.resultCalc = function() {
      // Only income is the interests on loans
      this.Profits[t] = this.profits
      this.totalLoans[t] =  this.trustLoans + this.doubtLoans 

      this.result_to_affect[t] = this.Profits[t] + this.ownFunds[t] 

      this.targetOwnFunds[t] =  roundie ( this.reserve_rate * this.totalLoans[t] )

      this.ownFunds[t+1] = Math.min(this.result_to_affect[t], this.targetOwnFunds[t])

      this.dividends[t+1] = this.result_to_affect[t] - this.ownFunds[t+1]

      this.cash.push(this.money)
    }



    this.depositIssue = function(emetter, amount) {
      console.warn("DEPOSIT ISSUE ATTEMPT")
      emetter.money -= amount 
      this.assets  -= amount

      var Deposit = new deposit(emetter, amount, this.depositRate)
      emetter.Assets.push(this)
      this.Deposits.push(Deposit)

      // Visualisation
      push()
        strokeWeight(amount/200*30)
        stroke(255,255,0)
        line(emetter.pos.x, emetter.pos.y, Bank.pos.x, Bank.pos.y)
      pop()
      return deposit
    }

    this.show = function() {
      show(this)
    }

    this.operate = function() {
      for(var i=0; i < this.Loans.length; i++) {
        if(this.Loans[i].principal == 0) {
          this.Loans.splice(i,1)
        }
      }

      this.assetsValue = sumProp(this.Loans, "principal")
    }

    this.buildBalanceSheet = function () {
      var balanceSheet = {}

      balanceSheet.Assets = {
        loans: sumProp(this.Loans,"principal"),
        ownAccount: this.ownAccount,

        total: this.fixedCapital + this.assetsValue
      }

      balanceSheet.Liabilities = {
        ownFunds: this.ownFunds,
        deposits: sumProp(this.Accounts,"sum"),

        total: this.ownFunds + this.debt
      }

      this.balanceSheet = balanceSheet
      this.balanceSheetArr.push(balanceSheet)
    }

    this.bankruptcy = function(borrower) {
      console.warn("BANKRUPTCY PROCEDURE", borrower, borrower.money, Bank.profits)
      borrower.solvability = "bankrupt"
      borrower.dismiss(borrower.employees.length)
      var loss = 0
      for(var i =0; i < borrower.Loans.length; i++) {
        if(borrower.Loans[i].principal > 0) {
          loss += borrower.Loans[i].default()
        }
      }
      console.log(loss)
      loss -= borrower.money
      this.money += borrower.money
      borrower.money = 0
      this.profits -= loss
      console.log(loss, Bank.money)
      Bank.money -= loss
      if(Bank.money < 0) {
        console.error("The Economy has Crashed")
        Bank = BANKRUPT
      }
      // dedi = deni
      AgentsGarbage.push(borrower)

      for(var i = 0; i < Agents.length; i++){
        if(Agents[i] === borrower){
          Agents.splice(i,1);
          i--
        }
      }
    }

    this.refund = function(loan, index) {
      var newLoan = this.loanIssue(loan.borrower, loan.principal * (1 + loan.interest) + 1 , "doubtful")
      loan.borrower.loans[t] += newLoan.principal
      console.log(loan,newLoan)
      var reimburse = loan.reimburse()
      // console.log(reimburse)
      if(reimburse){
        this.oldLoans.push(this.Loans[index])
        this.Loans.splice(index,1)
      }
      else{
        console.error('BIG PROBLEM')
        dnjzdizn = 0
      }
    }


  }

}


class currentAccount {
  constructor(owner){
    this.owner = owner
    this.sum = 0
    this.id = owner.type + owner.id
  }

}

class deposit {
  constructor(emetter, amount, interest){
    this.emetter = emetter
    this.principal = amount
    console.warn("DEPOSIT ISSUE SUCCEED", amount)
    this.interest = interest
    this.id = emetter.type + Bank.Loans.length

    this.yields = function() {
      if(this.principal > 0) {
        emetter.money += this.principal *  this.interest
        bank.money -= this.principal *  this.interest
        Bank.assets -= sum
        emetter.MonthlyDebtCharge += sum
      }
    }
  }
}

class share {
  constructor(emetter, owner, amount){
    this.emetter = emetter
    this.owner = owner
    this.amount = amount
    this.id = newShareID()
    this.owner.Shares.push(this)

    Shares.push(this)

    this.payDividend = function(amount) {
      if(emetter.money > amount && amount > 0) {
        // console.log("PAYS DIVIDEND ", "amount : " + amount, emetter, owner)
        emetter.money -= amount
        this.owner.money += amount
        this.owner.dividends[frameCount] += amount
      }
    }
  }
}

function roundie(x) {
  return Math.round(x * 100) / 100
}


SharesID = []
for(i=0; i < 100; i++) {
  SharesID.push(i)
}

function newShareID() {
  var IDnumber = Math.round(random(SharesID.length))
  var ID = SharesID[IDnumber]
  SharesID.splice(IDnumber, 1)
  return ID
}