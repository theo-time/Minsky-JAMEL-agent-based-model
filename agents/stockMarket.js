class Market {
  constructor(prop){
    this.sellOrders = []
    this.buyOrders = []
    this.price = 15;
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
      else{this.bestBuyPrice = undefined}
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
      // for(var i in this.buyOrders) {
      //   if((frameCount - this.buyOrders[i].creationDate) > this.buyOrders[i].validity) {
      //     this.buyOrders.splice(i,1)
      //   }
      // }
      // for(var i in this.sellOrders) {
      //   if((frameCount - this.sellOrders[i].creationDate) > this.sellOrders[i].validity) {
      //     this.sellOrders.splice(i,1)
      //   }
      // }


      // Makes counterparts meet ---------
      if(this.buyOrders[0] && this.sellOrders[0]) {
        while(this.buyOrders[0].price >= this.sellOrders[0].price){
            let price = (this.buyOrders[0].price + this.sellOrders[0].price)/2
           //Math.max(this.buyOrders[0].q, this.sellOrders[0].q)
           let exec = exchangeShare(this.buyOrders[0].emetter, this.sellOrders[0].emetter, price)
           
           if(exec) {
             this.Prices.push( price)
             this.price = price
             this.buyOrders[0].q--
             this.sellOrders[0].q--

             // Remove orders if completed
             if(this.buyOrders[0].q == 0){
              this.buyOrders.splice(0,1)
             }
             if(this.sellOrders[0].q == 0){
              this.sellOrders.splice(0,1)
             }

           }
           else{
            dzen = no
           }



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

  this.clearOrders = function() {
    // Remove outdated orders ---------
    for(var i =0; i < this.buyOrders.length; i++) {
      if((frameCount - this.buyOrders[i].creationDate) >= this.buyOrders[i].validity) {
        this.buyOrders.splice(i,1)
        i--
      }
    }
    for(var i =0; i < this.sellOrders.length; i++) {
      if((frameCount - this.sellOrders[i].creationDate) >= this.sellOrders[i].validity) {
        this.sellOrders.splice(i,1)
        i--
      }
    }
  }


  }
}