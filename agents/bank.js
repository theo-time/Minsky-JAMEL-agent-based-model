class bank {
  constructor(x, y, type, id) {
    Firm.call(this)
    this.id = "Bank" + id
    this.pos = createVector(x,y);
    this.type = type;
    this.clor = [255, 225, 0]
    this.size = agentSize

    this.Loans = []
    this.oldLoans = []
    this.Accounts = []

    this.balanceSheet = 0;
    this.balanceSheetArr = [];

    for(var i in Agents) {
      this.Accounts[i] = new currentAccount(Agents[i])
      Agents[i].bankAccount = this.Accounts[i]
    }

    this.Tables = {
      totalLoans:0,
      targetOwnFunds:0,
      Profits:0,
      ownFunds:0,
      result_to_affect:0,
      dividends:0,
      cash:0,
    }

  // | -- PARAMETERS -- |

    this.credit_duration = 12
    this.reserve_rate = 1/10
    this.interest_rate = 0.05
    this.m_interest_rate = 0.1
    this.max_leverage = 100

  // | -- STATE VARIABLES -- | 

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

    this.transfer = function(emetter, recipient) {

      // TO DO ....

    }

    this.loanIssue = function(borrower, amount, quality) {
      if(quality == "trustful"){
        var interest = this.interest_rate
      }
      else if(quality == "doubtful" || quality == "badDebt"){
        var interest = this.m_interest_rate
      }
      // console.error("New Loan Issue", borrower.leverage, this.maxLeverage)
      // if(borrower.leverage < this.max_leverage) {
        borrower.money += amount 
        var Loan = new loan(borrower, amount, interest, this.credit_duration, quality)
        this.Loans.push(Loan)
        borrower.Loans.push(Loan)
        push()
          strokeWeight(amount/200*30)
          stroke(255,255,0)
          line(borrower.pos.x, borrower.pos.y, Bank.pos.x, Bank.pos.y)
        pop()
        return Loan
      // }
      // else{
      //   console.warn("TOO MUCH LEVERAGE", borrower.leverage, this.maxLeverage)
      //   return "fail"
      // }
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
        }
      }

    }

    this.recoverCredits = function() {
    this.age = frameCount - this.creation

    this.bankruptcies = 0  
    this.moneyDestruction = 0

      for(var i = 0; i < this.Loans.length; i++) {

        // if(this.Loans[i].borrower.solvability == "bankrupt") {
        //   this.Loans[i].principal = 0
        //   this.oldLoans.push(this.Loans[i])
        //   this.Loans.splice(i,1)
        //   continue
        // }

        if(frameCount - this.Loans[i].date > this.Loans[i].duration) {
          // console.warn(" BANK RECOVER CREDIT", this.Loans[i])
          var sum = ceilie( this.Loans[i].principal * ( 1 + this.Loans[i].interest))
          var delta_money = this.Loans[i].borrower.money - sum

     //  --- CASE 1 : Direct Reimboursment  ---

          if(delta_money >= 0) {
            var reimburse = this.Loans[i].reimburse()

            if(reimburse == true) {
              this.oldLoans.push(this.Loans[i])
              this.Loans.splice(i,1)
              // console.warn("Fully reimbursed",reimburse)
            }
            else{
              console.error('BIG PROBLEM')
              dnjzdizn = 0
            }
          }

          // Remboursment impossible 
          else if(this.Loans[i].borrower.money >= 0) {

            // Bank makes a new loan to pay the old one
            if(this.Loans[i].quality == "trustful"){
              // console.warn("Borrower can't reimburse", sum, this.Loans[i].borrower.money)
              // console.warn(this.Loans[i].borrower.money, Bank.money, sumProp(this.Loans, "principal"))
              // console.log(" OLD LOAN :", this.Loans[i])
              var newLoan = this.loanIssue(this.Loans[i].borrower, ceilie(-delta_money + 1) , "doubtful")
              this.Loans[i].borrower.loans[t] += newLoan.principal
              // console.log(" NEW LOAN : " ,newLoan)
              reimburse = this.Loans[i].reimburse()
              // console.log(reimburse)
              // console.warn(this.Loans[i].borrower.money, Bank.money,  sumProp(this.Loans, "principal"))
              if(reimburse){
                this.oldLoans.push(this.Loans[i])
                this.Loans.splice(i,1)
              }
              else{
                console.error('BIG PROBLEM')
                dnjzdizn = 0
              }
            }
            // Bankruptcy of the firm
            else{
              // bankruptcy(this.Loans[i].borrower, this)
              this.bankruptcies++
              // console.log(this.Loans[i].borrower.money, this.Loans[i])
              var newLoan = this.loanIssue(this.Loans[i].borrower, -delta_money + 1 , "doubtful")
              this.Loans[i].borrower.loans[t] += newLoan.principal
              // console.log(newLoan)
              reimburse = this.Loans[i].reimburse()
              // console.log(reimburse)
              if(reimburse){
                this.oldLoans.push(this.Loans[i])
                this.Loans.splice(i,1)
              }
              else{
                console.error('BIG PROBLEM')
                dnjzdizn = 0
              }
            }
            
          }
          else {
            console.error("BORROWER HAS NEGATIVE MONEY", this.Loans[i].borrower.money)
          }

          // Remove Reimbursed Loans 
          // for(var i = 0; i < this.Loans[i]; i++) {
          //   if(this.Loans[i].principal == 0){
          //     this.oldLoans.push(this.Loans[i])
          //     this.Loans.splice(i,1)
          //     i--
          //     // console.warn("Fully reimbursed",reimburse)
          //   }
          // }
        }
      }
  

    }

    this.balanceSheetCalc = function() {
      var t = frameCount

      this.trustLoans = 0
      this.doubtLoans = 0
      for(var i = 0; i < this.Loans.length; i++) {
        if(this.Loans[i].quality == "trustful"){
          this.trustLoans += this.Loans[i].principal 
        }
        else{
          this.doubtLoans += this.Loans[i].principal  
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

  }

}

class loan {
  constructor(borrower, amount, interest, duration, quality){
    this.borrower = borrower
    this.principal = amount
    this.interest = interest
    this.quality = quality
    this.duration = duration
    this.date = frameCount
    this.id = borrower.type + Bank.Loans.length

    this.reimburse = function(sum) {
      // If the borrower has enough money, proceed
      if(this.borrower.money >= this.principal * ( 1 + this.interest) && this.principal > 0 ) {
        borrower.money -= this.principal * ( 1 + this.interest)
        Bank.money += this.interest * this.principal
        Bank.profits += this.interest * this.principal
        borrower.debt_charge[borrower.age] += this.principal * ( 1 + this.interest)
        borrower.interest_charge[borrower.age] += this.principal *  this.interest
        displayMoneyTransfer(borrower, Bank, this.principal, 250,0)
        Bank.moneyDestruction += this.principal
        this.principal -= this.principal
        return true
      }

      // else error
      else if(this.principal == 0) {
        console.warn(" STUPID BANK TRY TO RECOVER ALREADY REPAID LOANS")
      }

      else {
        // borrower.clor = [250,100,100]
        console.warn("Borrower unable to repay loan", this)
        borrower.solvability = "liquidity_bankruptcy"
        return false 
      }
    }

    this.reimburseDoubt = function() {
      var sum = Math.min(this.borrower.money, this.principal)
      if(this.borrower.money > 0 && this.principal > 0 ) {
        borrower.money -= sum * ( 1 + this.interest)
        Bank.money += this.interest * sum
        Bank.profits += this.interest * sum
        borrower.debt_charge[borrower.age] += sum * ( 1 + this.interest)
        borrower.interest_charge[borrower.age] += sum *  this.interest
        displayMoneyTransfer(borrower, Bank, sum, 250,0)
        Bank.moneyDestruction += sum
        this.principal -= sum
        if(this.principal == 0) {
          return true
        }
      }

      // else error
      else if(this.principal == 0) {
        console.warn(" STUPID BANK TRY TO RECOVER ALREADY REPAID LOANS")
      }

      else {
        // borrower.clor = [250,100,100]
        console.warn("Borrower unable to repay loan", this)
        borrower.solvability = "liquidity_bankruptcy"
        return false 
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
    if(!this.owner.Shares[this.emetter.id]) {
      this.owner.Shares[this.emetter.id] = []
    }

    this.owner.Shares[this.emetter.id].push(this)

    Shares.push(this)

    this.payDividend = function(amount) {
      if(emetter.money > amount && amount > 0) {
        // console.log("PAYS DIVIDEND ", "amount : " + amount, emetter, owner)
        emetter.money -= amount
        owner.money += amount
        owner.dividends[t] += amount
        // console.warn(emetter, "Pays dividend to lucky capitalist bastard ", owner)
      }
    }
  }
}

function bankruptcy(borrower, creditor) {
  borrower.solvability = "bankrupt"
  borrower.money = 0
  borrower.dismiss(borrower.employees.length)
  AgentsGarbage.push(borrower)

  for(var i = 0; i < Agents.length; i++){
    if(Agents[i] === borrower){
      Agents.splice(i,1);
      i--
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