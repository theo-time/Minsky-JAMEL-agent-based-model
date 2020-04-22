function speculator(x, y, id, type, pDNA) {
  agent.call(this,x, y, id, pDNA)
  this.type = type;
  Speculators.push(this)

  this.ownFunds = 200
  this.targetLeverage = 5

  this.money = 0// 200;
  // if(type == "randomTrader") {
  //   this.clor = [76, 91, 150];
  // }
  // if(type == "fundamentalist") {
  //   this.clor = [170,78,3];
  // }
  // if(type == "noiseTrader") {
  //   this.clor = [100,35,206];
  // }
  this.clor = [random(250),random(250),random(250),]

  this.Orders = []
  this.fValues = {}
  this.eValues = {}


  this.behave = this.DNA.behavior

  this.id = id

  this.stock = {
    rock:100,
    food:100,
    wood:100,
    iron:100,
    house:100,
    gold:100
  }

  this.demand = {}

  this.portfolio = {}
  this.targetPortfolio = {}
  for(var i in this.stock) {
    this.portfolio[i] = 0
  }

  for(var i in this.stock) {
    this.fValues[i] = random(10)
  }


  this.imitate = function () {
    // Find best fitted other
    var bestFitted = Speculators[0]
    // console.log(Speculators[0].assetValue)
    for(var i in Speculators) {
      if(Speculators[i].assetValue > bestFitted.assetValue) {
        bestFitted = Speculators[i]
      }
    }
    // console.warn(bestFitted)
    this.target = bestFitted
    this.copy(bestFitted)
  }

  this.copy = function(other) {
    for(var asset in this.portfolio) {
      this.targetPortfolio[asset] = other.portfolio[asset]
    }
  }

  // Methods ----------------------
  if(this.type == "fundamentalist") {
    this.think = function() {
      for(var g in this.stock) {
        if(foodMarket.Markets[g].price <= this.fValues[g]) {
        var newOrder = foodMarket.makeOrder(g , "buy", foodMarket.Markets[g].price, 10, this)  
        }
        else{
        var newOrder = foodMarket.makeOrder(g , "sell", foodMarket.Markets[g].price, 10, this)  
        }
      }
      var newOrder = foodMarket.makeOrder(random(Resources),random(["sell","buy"]), random(10), 10, this)
      this.Orders.push(newOrder)
    }
  }

  if(this.type == "randomTrader") {
    this.think = function() {
      var newOrder = foodMarket.makeOrder(random(Resources),random(["sell","buy"]), random(10), 10, this)
      this.Orders.push(newOrder)
    }
  }

  if(this.type == "noiseTrader") {
    this.think = function() {

      for(var asset in this.stock) {
      
        // -----  Expectations -------
        var delta = foodMarket.Markets[asset].Prices[0] - foodMarket.Markets[asset].Prices[1]
        this.eValues[asset] = foodMarket.Markets[asset].price + delta
        // console.log(foodMarket.Markets[asset].Prices[0], foodMarket.Markets[asset].Prices[1], delta, this.eValues)

        //this.eValues[asset] = mean(foodMarket.Markets[asset].Prices)

        if(foodMarket.Markets[asset].price <= this.eValues[asset]) {

          var newOrder = foodMarket.makeOrder(asset , "buy", foodMarket.Markets[asset].price * 1.02, 1, this)  
        }
        else{
          var newOrder = foodMarket.makeOrder(asset , "sell", foodMarket.Markets[asset].price / 1.02, 1, this)  
        }
      }
      var newOrder = foodMarket.makeOrder(random(Resources),random(["sell","buy"]), random(10), 1, this)
      this.Orders.push(newOrder)
    }
  }


  this.computeOld = function() {


    for(u=0; u < this.Investments.length; u++) {
      this.Investments[u].value = this.Investments[u].quantity * foodMarket.price
    }

    for(u=0; u + 1 < this.marketPrices.length; u++) {
      this.marketPricesVar[u] = (this.marketPrices[u+1] - this.marketPrices[u])/this.marketPrices[u]
    }
  }

  this.speculate = function(){
    if (frameCount < 2) {
      newInvest = new task('invest', 10)
      this.Tasks.push(newInvest)
      //this.Investments.push(newInvest)
    }
    
  }

  this.operate = function(){
    for(var u=0; u < this.Tasks.length; u++){
      var task = this.Tasks[u]
      if(this.Tasks[u].type == "invest") { // Make investment an OBJECT

        // Remove Unmet Orders
        for(var v=0; v < task.orders.length; v++) {
          var order = task.orders[v] 
          if(order.state == "unmet"){
            req = foodMarket.cancelOrder(order.id, order.emetter)
            if(req == "success") {this.Tasks.orders.splice(v,0)}
          }
          else {
            task.completion = task.completion - order.q
          }
        }

        // End the investment task when completed
        if(this.Tasks[u].completion == 0) {
          this.Investments.push(new investment(this.Tasks[u].targetQ))
          this.Tasks.splice(u,1)
        }
        // Make new Order
        else {
          buyAttempt = this.buy(this.Tasks[u])
        }


      }
    }
  }

  class investment {
    constructor(quantity) {
      this.time = frameCount
      this.quantity = quantity
      this.value = quantity * foodMarket.price
    }
  }


  this.buy = function(task) {
    // Makes new Order
    var price = foodMarket.price + ( 1 - random(2) )
    newOrder = foodMarket.makeOrder("buy", price, task.targetQ, this)
    task.orders.push(newOrder)
    this.Orders.push(newOrder)
  }

  this.priceAdjuster = function() {
   if(this.raw > 3) { this.price = this.price * 0.9}
   else {this.price = this.price * 1.1 }
  }

  this.randomTrade = function() {
    foodMarket.makeOrder("buy", Math.random()*10, 1, this)
    foodMarket.makeOrder("sell", Math.random()*10, 1, this)
  }

  this.smartTrade = function() {

    if(this.action = "buy") {
      newOrder = foodMarket.makeOrder("buy", foodMarket.price, 1, this)
      this.Orders.push(newOrder)
    }
    if(this.action = "sell") {
      newOrder = foodMarket.makeOrder("sell", foodMarket.price, 1, this)
      this.Orders.push(newOrder)
    }
  }

}

function mean(arr) {
  var sum = 0;
  for( var i = 0; i < arr.length; i++ ){
      sum += parseInt( arr[i], 10 ); //don't forget to add the base
  }

  var avg = sum/arr.length;
  return avg
}


function mimeticTrader (x, y, id, type, pDNA) {
    speculator.call(this,x, y, id, pDNA)
    this.clor = [127, 255, 0]
    this.type = "mimeticTrader "  
    this.id =  id
    this.think = function() {
      for(var asset in this.stock) {
      
        // -----  Expectations -------
        var delta = this.targetPortfolio[asset] - this.portfolio[asset] // Delta of portfolio in %
        delta = delta * 1000  // Delta in moeny $
        this.demand[asset] = delta / Globals.price[asset] // Demand in units of asset
        // console.warn("target : " + this.targetPortfolio[asset] + " / Stock : " + this.portfolio[asset] + " / delta " + delta + ' / price' + Globals.price[asset] + " demand" + this.demand[asset])

        //this.eValues[asset] = mean(foodMarket.Markets[asset].Prices)

        if(this.demand[asset] > 0) {
          var newOrder = foodMarket.makeOrder(asset , "buy", foodMarket.Markets[asset].price * 1.1, this.demand[asset], this)  
          this.Orders.push(newOrder)
          // console.warn(newOrder)
        }
        else if (this.demand[asset] < 0) {
          this.demand[asset] = -this.demand[asset]
          var newOrder = foodMarket.makeOrder(asset , "sell", foodMarket.Markets[asset].price / 1.1, this.demand[asset], this)  
          this.Orders.push(newOrder)
          // console.error(newOrder)
        }
      }
      // var newOrder = foodMarket.makeOrder(random(Resources),random(["sell","buy"]), random(10), 1, this)

    }
}
  

