function consumer(x, y, type, id) {
  this.id = id
  this.pos = createVector(x,y);
  this.type = "consumer";
  this.money = 200;
  this.clor = [250,250,250]
  this.size = agentSize
  this.raw = 0;
  //this.employer = random([random(Industrials),random(Extractors)])
  //this.employer.employees.push(this)
  this.income = 10;
  this.food = 2;
  this.consumption = 1;
  this.debt = 0;
  this.revendication = 10

  this.show = function() {
    show(this)
  }

  this.consume = function() {
    this.food -= this.consumption
    this.money += this.income
  }

  this.compute = function() {
    this.demand = this.consumption * 10 - this.food;
  }

  this.buy = function(prop) {
    while (this.demand * foodMarket.price > this.money) {
      this.demand = this.demand - 1
    }
    if(this.demand > 0) {
      var bestSeller = BestOffer.industrial
      var req = foodMarket.buyNow(this, this.demand)
      console.log(req)
    }
  }

  this.priceAdjuster = function() {

   if(this.raw > 3) { this.price = this.price * 0.9}
   else {this.price = this.price * 1.1 }
  }

  this.borrow = function() {
    if(this.money<0){
      this.money += 100 
      Bank.assets += 100
      this.debt +=100
    }


  }

  this.revendicate = function() {
    if(this.price) {
      this.lifeCost = this.consumption * this.price
      this.revendication = this.lifeCost - this.income
      if(this.revendication < 0 ) {this.revendication = 0}
    }
    this.employer.augmAskers.push(this)
  }

}