var agentSize = 70

function DNA (newProp) {

  this.behavior = function(){

    if(this.marketPricesVar[this.marketPricesVar.length-1]>0) {
      this.action = "buy" 
    }
    else{
      this.action = "sell"
    }
  }

  if(newProp) {this.Maxlife = newProp}
  
  this.crossover = function(partner,prop){
    var newProp;
    if (partner[prop] > this[prop]) {
      Dist = partner[prop] - this[prop]
      newProp = this[prop] + random(Dist)
      return new DNA(newProp)
    }
    else {
      Dist = this[prop] - partner[prop] 
      newProp = this[prop] + random(Dist)
      return new DNA(newProp)
    }
  }

  this.mutation = function(prop) {
    if(random(1)<0.05) {
      this[prop] = this[prop] + 1 - random(2)
    }
  }

}

  function task(type,q,money) {
      this.type = type
      this.targetQ = q
      this.completion =  q 
      this.orders = []
  }







function trade(buyer, seller, prop, price, q) {
    this.buyer = buyer
    this.seller = seller
    this.prop = prop
    this.price = price;
    this.q = q;
    this.date = frameCount
}

function operation (price, prop, q) {
  this.price = price;
  this.prop = prop;
  this.q  = q;
  this.time = frameCount;
  this.total = this.price * this.q
}

function exchange(buyer, seller, prop, price, q) {
  // console.warn(buyer, seller)
  if(buyer.money >= price * q && seller.stock[prop] != 0 && q > 0) {
    if(seller.stock[prop] <= q) {q = seller.stock[prop]}
    buyer.stock[prop] += q ;
    seller.stock[prop] -= q ;

    buyer.money -= price * q ;
    seller.money += price * q ;
    fill(0,250,0)

    Trades.push(new trade(buyer, seller, prop, price, q))


    // Report trade to buyer and seller
    buyer.buyOps.push(new operation(price, prop, q))

    seller.sellOps.push(new operation(price, prop, q))

    // show trade
    if(playcanva) {
      push()
      strokeWeight(price*q/200*30)
      stroke(255,255,0)
      line(buyer.pos.x, buyer.pos.y, seller.pos.x, seller.pos.y)
      pop()
    }

    return q 
  }
  if(q <= 0 ) { stop = stoppp}
  return 0
}

function exchangeShare(buyer, seller, price) {
  // Verify that the buyer owns a share
  if(seller.Shares.length == 0){
    console.log(seller, "  does not posess any share ")
    return false
  }

  if(buyer.money >= price) {
    
    seller.Shares[seller.Shares.length - 1].owner = buyer
    moveElements(seller.Shares, buyer.Shares, seller.Shares.length - 1)

    buyer.money -= price;
    seller.money += price;
    fill(0,250,0)

    ShareTrades.push(new trade(buyer, seller, "share", price, 1))

    // show trade
    if(playcanva) {
      push()
      strokeWeight(price/200*30)
      stroke(255,255,0)
      line(buyer.pos.x, buyer.pos.y, seller.pos.x, seller.pos.y)
      pop()
    }

    return true
  }
  else{
     console.warn(buyer, " has not enough money to buy share", price, buyer.money)
    return false
  }
}

function displayMoneyTransfer(agent1, agent2, sum, clor) {
    push()
        strokeWeight(sum/200*30)
        stroke(255,255,0)
        if(clor){
          stroke(clor)
        }
        line(agent1.pos.x, agent1.pos.y, agent2.pos.x, agent2.pos.y)
    pop()
}

function bestOfferCalc(obj) {
    Arr = obj
    bestOffers = []
    bestPrice = Arr[0].price
    for(u=0; u < Arr.length; u++) {
        Arr[u].clor =  [250,250,250]
      if(Arr[u].price == bestPrice) {
        bestOffers.push(Arr[u])
      }
      if(Arr[u].price < bestPrice) {
        bestOffers = [];
        bestOffers.push(Arr[u])
        bestPrice = Arr[u].price
      }
    }
    bestOffer = random(bestOffers)
    bestOffer.clor = [250,0,0]
    return(bestOffer)
}


function randomize(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}



function show(obj) {

  if(obj.stock) {
    if(obj.stock.house >= 1) {houseSkin(obj)}
  }

  fill(obj.clor)
  push()
  strokeWeight(5)
  stroke(250,250,250,40)
  strokeWeight(obj.money/130)
  rect(obj.pos.x, obj.pos.y,  obj.money/5, obj.money/5)
  pop()

  fill(0,0,0)
  text(obj.type, obj.pos.x + 5, obj.pos.y - 5)
  text("M  " + Math.floor(obj.money), obj.pos.x + 2, obj.pos.y + 15);  
  text("R  " + Math.floor(obj.raw), obj.pos.x + 2, obj.pos.y + 30)
  text("P  " + Math.floor(obj.price), obj.pos.x + 40, obj.pos.y + 15)
  if(obj.stock) {text("F  " + Math.floor(obj.stock.food), obj.pos.x + 2, obj.pos.y + 60)}
  text("D  " + obj.debt, obj.pos.x + 40, obj.pos.y + 60)
  if(obj.type == "industrial" || obj.type == "extractor") {
    text("E  " + Math.floor(obj.employees.length), obj.pos.x + 40, obj.pos.y + 30)
  }
  if(obj.type == "bank") {
    text("A  " + obj.assets, obj.pos.x + 40, obj.pos.y + 40)
  }
  if(obj.assetValue) {text("AV  " + Math.floor(obj.assetValue), obj.pos.x + 40, obj.pos.y + 45)}
     if(obj.totalValue) {text("totalValue  " + Math.floor(obj.totalValue), obj.pos.x + 40, obj.pos.y + 75)}
}

function movingAverage(arr, time){
  if(time > arr.length) {return undefined}
  var sum = 0;
  for(m = 0; m < time; m++) {
      sum = sum + arr[arr.length-1-m]
  }
  var mean = sum/time
  return mean
}

function houseSkin(obj) {
  push()
  translate(-10,-10)
  fill(242,235,159,100)
  rect(obj.pos.x, obj.pos.y,  obj.money/4+20, obj.money/4+20)
  pop()
}



function moveElements(source, target, index) {
    let element = source[index];
    source.splice(index, 1);
    target.push(element);
}



function oldmoveElements(source, target, moveCheck) {
    for (var i = 0; i < source.length; i++) {
        var element = source[i];
        if (moveCheck(element)) {
            source.splice(i, 1);
            target.push(element);
            i--;
        }
    } 
}
