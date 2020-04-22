console.log("Firms Loaded")

function smartFirm (x, y, id, brain) {
  var id = newId();

  Firm.call(this,x, y, id, brain)
 
  this.smart = {}


  this.brainProcess = function() {
    if(this.brain){

      var t = frameCount
      // Perception 
      var input = []

      input.push(normalize(this.income[t-1], -1000, 1000))
      // input.push(normalize(this.cash[t-1], -1000, 1000) )
      input.push(normalize(this.fullEmployment_time, -100, 100) )
      input.push(normalize(this.debt[t-1], 0, 1000) )
      input.push(normalize(this.stock.food / this.production_capacity / 100 , 0, this.production_capacity * 4) )// unsold stock ratio

      console.warn(input)


      // Action 
      var output = this.brain.activate(input);
      this.smart = {
        target_employment: this.target_employment[t-1] + ( output[0] - 0.5 ) * this.production_flexibility ,
        wage: this.wage[t-1] + ( output[1] - 0.5 ) * this.wage_flexibility ,
        price: this.price[t-1] + ( output[2] - 0.5 ) * this.price_flexibility 
      }
       console.warn(output, this.smart)
    }
  }


  this.productionChoice = function() {
    var t  = this.age

    if(this.age > 0 && this.age % firm.production_adjust_delay == 0) {

      this.target_employment[t] = this.smart.target_employment
    
    }
    else {
      this.target_employment[t] = this.target_employment[t-1]
    }
    
  }


  this.wageAdjust = function() {

    // Wage Adjusting   ------

    if(this.age > 0 && this.age % firm.wage_adjust_delay == 0) {

      this.wage[t] = this.smart.wage

    }
    else {
      this.wage[t] = this.wage[t-1]
    }
  }



  this.priceCalc = function() {
      var t = this.age
      this.price[t] = this.smart.wage
  }

  this.fitnessCalc = function() {
    this.brain.score = this.income.reduce((accumulator, currentValue) => accumulator + currentValue) / Globals.arr.averagePrice[Globals.arr.averagePrice.length - 1]
  }


}

function normalize(val, min, max) { return (val - min) / (max - min); }