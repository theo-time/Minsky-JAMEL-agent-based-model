class loan {
  constructor(borrower, amount, interest, duration, quality){
    this.borrower = borrower
    this.principal = amount
    this.init_sum = amount
    this.interest = interest 
    this.quality = quality
    this.type = "amortized"
    this.duration = duration
    this.date = frameCount
    this.id = borrower.id + "#" + Bank.Loans.length

    this.payInterest = function() {
      if(this.borrower.money >= this.principal * this.interest) {
        //Real
        this.borrower.money -= this.principal * this.interest
        Bank.money += this.interest * this.principal

        //Account
        this.borrower.interest_charge[borrower.age] += this.principal *  this.interest
        this.borrower.debt_charge[borrower.age] += this.principal * this.interest
        Bank.profits += this.interest * this.principal
      }
      else{
        console.error('CANT PAY INTEREST',this.principal * this.interest, this.borrower.money, this ) 
        zzn = zdin
      }
    }

    this.reimburse = function(sum) {
      // If the borrower has enough money, proceed
      if(sum > this.principal) { sum = this.principal }

      if(this.borrower.money >= sum && this.principal > 0 ) {

        //Real
        this.borrower.money -= sum
        Bank.moneyDestruction += sum

        //Account
        this.borrower.debt_charge[borrower.age] += sum
        this.principal -= sum
        
        return true
      }

      // else error
      else if(this.principal == 0) {
        console.error(" STUPID BANK TRY TO RECOVER ALREADY REPAID LOANS")
        zdzni = dznin
      }

      else {

        console.error("Sum > Borrower money", this, sum)
        zdzni = dznin
        return false 
      }
    }


    this.reimburseOld = function(sum) {
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
      console.warn(this.borrower.money, this.principal, Bank.money)
      if(this.borrower.money > this.principal * this.interest) {
        var sum = this.principal
      }
      else{
        var sum = this.borrower.money / ( 1 + this.interest ) 
      }

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
      console.warn(this.borrower.money,this.principal, Bank.money)
    }

    this.default = function() {
      // if(borrower.money > 0) {
      //   this.principal -= borrower.money
      //   borrower.money = 0
      // }
      this.quality = "default"
      var loss = this.principal
      this.principal = 0
      console.log(loss)
      return loss
    }

  }

}