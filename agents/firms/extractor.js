function newExtractor(x, y, id, resource, rate) {
  firm.call(this, x, y, id)

  this.type = 'extractor';
  this.resource = resource
  this.clor = Colors[resource]

  this.id = IDs.pop()


  this.wage = 100
  this.extractionRate = rate
  this.price = 5;

  this.Orders = [];
  this.Tasks = [];
  this.Loans = [];

  this.Marketplace = 0;

  this.extract = function() {
    var production =  this.extractionRate * this.employees.length
    this.stock[this.resource] += production
    this.monthlyProd += production
  }

  this.priceCalc = function() {
    this.unitCost = 1/this.extractionRate * this.wage/timePeriod
    this.price = this.unitCost * (1 + this.profitRate)
  }

  this.sell = function() {
    // Find a Marketplace
    if(this.Marketplace == 0) {
      this.Marketplace = localMarket
      this.Marketplace.addOffer(this, this.resource, this.price, this.stock[this.resource])
    }
    else{
      this.Marketplace.modifyOffer(this, this.resource, this.price, this.stock[this.resource])
    }
  }
  
}