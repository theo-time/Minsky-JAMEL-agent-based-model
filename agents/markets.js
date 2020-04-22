function StockMarket(props) {
  this.Markets = {}
  for(var i in props) {
    this.Markets[props[i]] = new Market(props[i])
  }

  this.operate = function() {
    for (var i in this.Markets) {
      this.Markets[i].operate()
    }
  }

  this.makeNow = function(act, asset, q, emetter) {
    if(act == "sell") {
      this.Markets[asset].sellNow(emetter, q)
    }
    if(act == "buy") {
      this.Markets[asset].buyNow(emetter, q)
    }   

  }

  this.makeOrder = function(good, act, price, q, emetter) {
    var newOrder = new limitedOrder(price, q, emetter, good)
    if(act == "sell") {
      this.Markets[good].sellOrders.push(newOrder) 
      return newOrder
    }
    if(act == "buy") {
      this.Markets[good].buyOrders.push(newOrder)
      return newOrder
    }
  }
}

 

class Market {
  constructor(prop){
    this.sellOrders = []
    this.buyOrders = []
    this.price = 3;
    this.Prices = [];
    this.prop = prop

    this.compute = function() {
      if(this.sellOrders[0]) {
        this.bestSellPrice = this.sellOrders[0].price
      } 
      else{this.bestSellPrice = undefined}
      if(this.buyOrders[0]) {
        this.bestBuyPrice = this.buyOrders[0].price
      }
      else{this.bestSellPrice = undefined}
    }

    // The Market creates the order and send it to the emetter
    this.makeOrder = function(act, price, q, emetter) {
      if(act == "sell") {
        var newOrder = new limitedOrder(price, q, emetter)
        this.sellOrders.push(newOrder) 
        return newOrder
      }
      if(act == "buy") {
        var newOrder = new limitedOrder(price, q, emetter)
        this.buyOrders.push(newOrder)
        return newOrder
      }
    }

    this.cancelOrder = function(ID, emetter) {
      for(var u=0; u < this.buyOrders.length; u++) {
       
        if(this.buyOrders[u].id == ID) {
          this.buyOrders.splice(u,1)
          return "success removed"
        }
      }
      for(var u=0; u < this.sellOrders.length; u++) {
      
        if(this.sellOrders[u].id == ID) {
          this.sellOrders.splice(u,1)
          return "order successfully removed"
        }
      }
      return ["removal fail", ID,emetter]
    }


    this.operate = function(){
      // Sort Orders by price ---------
      this.buyOrders.sort(function(a, b){return b.price - a.price});
      this.sellOrders.sort(function(a, b){return a.price - b.price })

      // Remove outdated orders ---------
      for(var i in this.buyOrders) {
        if((frameCount - this.buyOrders[i].creationDate) > this.buyOrders[i].validity) {
          this.buyOrders.splice(i,1)
        }
      }
      for(var i in this.sellOrders) {
        if((frameCount - this.sellOrders[i].creationDate) > this.sellOrders[i].validity) {
          this.sellOrders.splice(i,1)
        }
      }


      // Makes counterparts meet ---------
      if(this.buyOrders[0] && this.sellOrders[0]) {
        while(this.buyOrders[0].price >= this.sellOrders[0].price){
         // console.log(this.buyOrders[0].emetter,this.sellOrders[0].emetter)
           d3.max(this.buyOrders[0].q, this.sellOrders)
           var exchangeR = exchange(this.buyOrders[0].emetter,this.sellOrders[0].emetter, this.prop , this.sellOrders[0].price, this.buyOrders[0].q)
           if(exchangeR > 0) {
             this.Prices.push(this.sellOrders[0].price)
             this.price = this.sellOrders[0].price
           }
         // console.log(this.buyOrders[0].emetter,this.sellOrders[0].emetter)
            this.send(this.sellOrders[0].emetter, this.sellOrders[0].id)
            this.send(this.buyOrders[0].emetter, this.buyOrders[0].id)


            // Remove met Orders
            this.buyOrders.splice(0,1)
            this.sellOrders.splice(0,1)
            this.compute();



            if(this.buyOrders.length == 0 || this.sellOrders.length == 0) {break}
        }
      }
    }

    this.buyNow = function(emetter, q){
        // console.error('BEGINNING OF BUYNOW')
        var totalBought = 0
        var q = q
        for(var i in this.sellOrders){
          if(q > 0) {
            // console.warn( emetter.id + " buying now " + prop + " to ", this.sellOrders[i].emetter.id, "for", q)
            if(this.sellOrders[i].q <= q) { q = this.sellOrders[i].q  }
            // console.warn("new quantity : ",q)

            totalBought += exchange(emetter, this.sellOrders[i].emetter, prop, this.sellOrders[i].price , q)
            q -= totalBought
            // console.warn("final exchange : ",totalBought, "new desired q :", q)      

            this.price = this.sellOrders[i].price
            // this.Prices.push(this.price)
          }
        }
        return totalBought
    }

    this.sellNow = function(emetter, q){
        // console.error('BEGINNING OF SELLNOW')
        var totalSold = 0
        var q = q
        for(var i in this.buyOrders){
          if(q > 0) {
            // console.warn( emetter.id + " buying now " + prop + " to ", this.sellOrders[i].emetter.id, "for", q)
            if(this.buyOrders[i].q <= q) { q = this.buyOrders[i].q  }
            // console.warn("new quantity : ",q)

            totalSold += exchange(this.buyOrders[i].emetter, emetter, prop, this.buyOrders[i].price , q)
            q -= totalSold
            // console.warn("final exchange : ",totalSold, "new desired q :", q)      

            this.price = this.buyOrders[i].price
            // this.Prices.push(this.price)
          }
        }
        return totalSold
    }

    this.send = function(emetter, orderId) {
      for(var u = 0; u < emetter.Orders.length; u++ ) {
        if(emetter.Orders[u].id == orderId) {
            emetter.Orders[u].state = "met"
        }
      }
    }


  }
}

function offer (emetter, price, availableQ, prop) {
  this.price = price
  this.availableQ = availableQ
  this.emetter = emetter
  this.prop = prop
  this.date = frameCount

  this.buy = function(buyer, q) {
    // console.log(buyer, " tries to buy")
    exchange(buyer, this.emetter, this.prop, this.price, q)
    this.availableQ = emetter.stock[prop]
    buyer.lastSupplier = this.emetter.id
  }
}


function jobOffer (emetter, wage, Q) {
  this.wage = wage
  this.availableQ = Q
  this.emetter = emetter

  this.hire = function(worker) {
    if(this.availableQ > 0) {
      var contract = new Contract(emetter, worker, worker.contract_length, this.wage)
      emetter.employees.push(contract)
      worker.employed = true
      worker.contract = contract
      this.availableQ -= 1
      return true
    }
    else {
      return false
    }
  }
}

function Contract (employer, worker, duration, wage) {
  this.employer = employer
  this.worker = worker
  this.duration = duration
  this.wage = wage
  this.date = frameCount

  Contracts.push(this)
}


function simpleMarket(x, y) {
  this.pos = createVector(x,y)

  this.Tables = {
    excess_demand:0,
    excess_supply:0,
  }

  this.excess_demand = []
  this.excess_supply = []

  this.products = {}

  for(var i = 0; i < Resources.length; i++) {
    this.products[Resources[i]] = {
      bestprice:0,
      worstprice:0,
      Offers : []
    }
  }

  this.operate = function () {
    // Sorts Offers for each product and provides bestprice
    for(var prop in this.products) {
      this.products[prop].Offers.sort(function(a, b){return a.price - b.price})
      if(this.products[prop].Offers[0]) {
        this.products[prop].bestprice = this.products[prop].Offers[0].price
        this.products[prop].worstprice = this.products[prop].Offers[this.products[prop].Offers.length-1].price
        this.products[prop].mediumPrice = sumProp(this.products[prop].Offers, "price") / this.products[prop].Offers.length
      }
    }
  }

  this.addOffer = function(emetter, prop, price, availableQ) {
    this.products[prop].Offers.push(new offer(emetter, price, availableQ, prop))
  }

  this.modifyOffer = function(emetter, prop, newprice, newavailableQ) {
    for(var i=0; i < this.products[prop].Offers.length; i++) {
      if(emetter === this.products[prop].Offers[i].emetter) {
        var offer = this.products[prop].Offers[i];
        offer.price = newprice;
        offer.availableQ = newavailableQ;
      }
    }
  }

  this.clearOffers = function() {
    for(var p in this.products) {
      this.products[p].Offers = []
    } 
  }

  this.stats = function() {
    let t = frameCount
    this.excess_demand[t] = sumProp2(Workers, "unmet_demand")
    this.excess_supply[t] = sumProp(this.products.food.Offers, "availableQ")
    // if(this.excess_demand[t]  > 7000) { oz = ozcdzdcz[0]}
  }
}

function WorkMarket (x,y) {
  simpleMarket.call(this)
  
  this.jobOffers = []
  this.unemployedWorkers = []

  this.data = {
    jobOffers:[],   
    vacancies:[],
    unemployed:[],
  }

  this.enroll = function(applier) {
    for(var u = 0; u < this.jobOffers.length && u > 0; u++) {
      if(this.jobOffers[u].availableQ > 0) {
        employer = this.jobOffers[u].emetter
        employer.employees.push(applier)
        this.jobOffers[u].availableQ -= 1
        return employer
      }
    }
  }

  this.addOffer = function(emetter, wage, availableQ) {
    this.jobOffers.push(new jobOffer(emetter, wage, availableQ))
  }

  this.modifyOffer = function(emetter, prop, newprice, newavailableQ) {
    for(var i=0; i < this.products[prop].Offers.length; i++) {
      if(emetter === this.products[prop].Offers[i].emetter) {
        var offer = this.products[prop].Offers[i];
        offer.price = newprice;
        offer.availableQ = newavailableQ;
      }
    }
  }

  this.clearOffers = function() {
    this.jobOffers = []
  }

  this.sortOffers = function() {
    this.jobOffers.sort(function(a, b){return b.wage - a.wage});
  }

  this.operate = function() {
    this.data.jobOffers[t] = this.jobOffers.length
    this.data.unemployed[t] = this.unemployedWorkers.length
    this.data.vacancies[t] = sumProp(this.jobOffers, "availableQ")
    this.unemployedWorkers = []
  }

}


function creditaMarket (x,y) {
  simpleMarket.call(this)
  
  this.jobOffers = []

  this.enroll = function(applier) {
    for(var u = 0; u < this.jobOffers.length; u++) {
      if(this.jobOffers[u].availableQ > 0) {
        this.jobOffers[u].emetter.employees.push(applier)
        this.jobOffers[u].availableQ -= 1
        employer = this.jobOffers[u].emetter
        console.log(employer)
        return employer
      }
    }
  }

  this.addOffer = function(emetter, wage, availableQ) {
    this.jobOffers.push(new offer(emetter, wage, availableQ, "work"))
  }

  this.modifyOffer = function(emetter, prop, newprice, newavailableQ) {
    for(var i=0; i < this.products[prop].Offers.length; i++) {
      if(emetter === this.products[prop].Offers[i].emetter) {
        var offer = this.products[prop].Offers[i];
        offer.price = newprice;
        offer.availableQ = newavailableQ;
      }
    }
  }

}