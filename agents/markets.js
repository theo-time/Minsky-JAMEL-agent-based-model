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



function offer (emetter, price, availableQ, prop) {
  this.price = price
  this.availableQ = availableQ
  this.emetter = emetter
  this.prop = prop
  this.date = frameCount

  this.buy = function(buyer, q) {
    // console.log(buyer, " tries to buy")
    let fq = exchange(buyer, this.emetter, this.prop, this.price, q)
    this.availableQ = emetter.stock[prop]
    buyer.lastSupplier = this.emetter.id
    return fq
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
    bestWage:[],
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
    if(this.jobOffers[0]) {
      this.data.bestWage[t] = this.jobOffers[0].wage
    }
    else{
      this.data.bestWage[t] = 0
    }
    this.unemployedWorkers = []
  }

}

