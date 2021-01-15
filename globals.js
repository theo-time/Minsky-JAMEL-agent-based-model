function globals() {

	this.stock = {
		rock:0,
		food:0,
		wood:0,
		iron:0,
		house:0,
		gold:0
	}

	this.stock_arr = {}
	this.price = {}
	this.price_arr = {}


	this.lastTrades;
	this.monthlyTraded;
	this.totalTraded;
	this.moneySupply;
	this.moneyVelocity;
	this.moneyDestruction;
	this.numberTransac;
	this.monthly_number_transac;
	this.wageInflation;


	for(var r in Resources) {
		this.stock_arr[Resources[r]] = []
	}

	for(var r in Resources) {
		this.price_arr[Resources[r]] = []
	}


	this.monthlyCalc = function() {
		// --- Money ----
		var t = frameCount
		this.lastTrades = Trades.filter(trade => 1 > frameCount - trade.date)
		this.monthlyTraded = this.lastTrades.reduce((acc, trade, i) => {return acc + trade.price * trade.q} , 0)
		this.totalTraded = Trades.reduce((acc, currentValue, i) => {return acc + Trades[i].price * Trades[i].q}, 0)
		this.moneySupply = floor(((sumProp(Agents, "money") - Bank.money) * 100)) / 100
		this.moneyVelocity = this.monthlyTraded / this.moneySupply
		this.moneyDestruction = Bank.moneyDestruction
		// this.numberTransac = sumProp(Trades, "q")
		this.monthly_number_transac = this.lastTrades.length
		this.arr.monthly_number_transac.push(this.monthly_number_transac)


		this.firmsProfits = sumProp2(Firms, "income") 
		this.bankProfits = Bank.Profits[t]
	 	this.Profits = 0 
	 	if(this.firmsProfits>0) {this.Profits += this.firmsProfits}
	 	if(this.bankProfits>0) {this.Profits += this.bankProfits}
	 	this.profitRate = sumProp2(Firms, "annual_income") / sumProp2(Firms, "fixedCapital")

	 	this.bankDividends = Bank.dividends[t-1]
	 	this.firmsDividends = sumProp2(Firms, "dividends")

		this.GDP = sumProp2(Firms, "sales") 
		this.Consumption_v = sumProp(this.lastTrades, "q")
		if(frameCount > 1){
			this.averagePrice = this.monthlyTraded / this.Consumption_v
		}
		else{
			this.averagePrice = Firms[0].price[0]
		}
		if(this.monthlyTraded == 0) { this.averagePrice = localMarket.products.food.mediumPrice}

		this.GDP_growth =  ( this.GDP - this.arr.GDP[frameCount-2] )  / this.arr.GDP[frameCount-2] 
		if(frameCount < 3 || this.arr.GDP[frameCount-2] == 0) {
			this.GDP_growth = 0
		}

		this.financial_wealth = sumProp2(Workers, "financial_wealth")

		// Deflating GDP -------
		if(this.averagePrice ){
			// Launch GDP Account 
			if(!GDP_launched) {
				this.realGDP = this.GDP
				basePrice = this.averagePrice
				GDP_launched = true
			}

			else {
				this.realGDP = this.GDP * ( basePrice / this.averagePrice)
			}
		}
		else{
			this.realGDP = 0
		}

		// this.assetValueTotal = sumProp(Agents, "assetValue")

		this.totalDividends = this.bankDividends + this.firmsDividends

        // EMPLOYMENT
        this.labourSupply = Workers.length
		this.employment = 0;
		for(var i = 0; i < Workers.length; i++) {
			if(Workers[i].employed == true) {
				this.employment++;
			}
	 	}
        this.arr.employment.push(this.employment)

		let Wages = [];
		this.employment = 0;
		this.totalWages = 0;
		for(var i = 0; i < Workers.length; i++) {
			if(Workers[i].employed == true) {
				Wages.push(Workers[i].wage[t])
				this.employment++;
				this.totalWages += Workers[i].wage[t];
			}
	 	}
	 	this.totalStock = 0;
		for(var i = 0; i < Firms.length; i++) {
			this.totalStock += Firms[i].stock.food 
	 	}

	 	this.averageWage = mean2(Wages)
	 	this.realWage = mean2(Wages)/ this.averagePrice 
	 	this.accepted_wage = sumProp2(Workers, "accepted_wage") / Workers.length
	 	this.offered_wage = sumProp2(Firms, "wage") / Firms.length
	 	this.employmentRate = this.employment / Workers.length

	 	this.target_employment = sumProp2(Firms, "target_employment")
	 	this.nbr_machines =  sumProp2(Firms, "nbr_machines")

	 	this.production_capacity = sumProp(Firms, "production_capacity")
	 	this.totalWorkForce = Workers.length
	 	this.capacity_utilization = sumProp2(Firms, "capacity_utilization") / Firms.length
	 	this.production = sumProp2(Firms, "Production")
	 	this.vacancies = sumProp2(Firms, "vacancies")
	 	this.internal_financing = sumProp2(Firms, "internal_financing")

	 	this.Consumption = sumProp2(Workers, "consumption")
	 	this.InvestmentDemand = sumProp2(Firms, "effectiveInvest")
	 	this.stateDemand = state.effectiveConsumption[t]
	 	this.Demand = this.Consumption + this.InvestmentDemand + this.stateDemand
	 	this.Savings = sumProp2(Workers, "saving") / sumProp2(Workers, "income")
	 	this.totalIncome = sumProp2(Workers, "income") //this.totalWages + this.totalDividends

	 	this.Investment = sumProp2(Firms, "investment")
	 	this.retained_earnings = sumProp2(Firms, "retained_earnings") / this.firmsProfits

	 	this.dividends_to_profits = (sumProp2(Firms, "dividends") + Bank.dividends[t]) / this.arr.Profits[t-1]
	 	this.profitShare = 1 - (this.totalWages / this.GDP)
	 	// this.wageShare =  1 - this.profitShare

	 	this.totalSaving = sumProp2(Workers, "Saving") / this.totalIncome

	 	// Firms 
	 	this.average_target_debt_ratio = sumProp2(Firms, "target_debt_ratio_arr") / Firms.length
	 	this.unsold_ratio = sumProp2(Firms, "unsold_ratio")/Firms.length
	 	this.stock_after_prod = sumProp2(Firms, "stock_ratio_after_prod")/Firms.length
	 	this.excess_firms = count(Firms, (e) => e.stock_ratio_after_prod[frameCount] > 2)
	 	this.ok_firms = count(Firms, (e) => e.stock_ratio_after_prod[frameCount] <= 2)
	 	this.excess_firms_st = count(Firms, (e) => e.unsold_ratio[frameCount] > 4)
	 	this.ok_firms_st = count(Firms, (e) => e.unsold_ratio[frameCount] < 1)

	 	this.Production_capacity = sumProp(Firms, "nbr_machines")

        this.investment_yearly = annualAggregate(this.arr.InvestmentDemand)
        this.Demand_yearly = annualAggregate(this.arr.Demand)
        this.investment_to_GDP = this.investment_yearly / this.Demand_yearly
	        
	 	// Workers
	 	this.averageSavingProp = sumProp(Workers, "savePropensity") / Workers.length
	 	this.wealthQuantiles = Quantiles(Workers, "wealth", 10)

  		//  | -- MONETARY & FINANCIAL DATA -- |
  		this.stockMarketPrice = stockMarket.price
  		this.stockMarketCap = this.stockMarketPrice * Shares.length
  		this.stockMarketCap_to_GDP = this.stockMarketCap / this.GDP
  		this.price_earnings_ratio = this.stockMarketCap /  sumProp2(Firms, "annual_income")
  		this.tobin_Q = this.stockMarketCap / sumProp2(Firms, "assets")

  		this.publicDebt = state.debt[t]
  		this.privateDebt = sumProp2(Firms, "debt")
  		this.totalDebt = sumProp2(Firms, "debt") + sumProp(Workers, "debt") + state.debt[t]
  		this.public_debt_to_GDP = state.debt[t] / this.GDP
		this.firmsDeposits = sumProp2(Firms, "cash")
		this.workersDeposits = sumProp2(Workers, "cash")
		this.bankReserves = Bank.money
  		this.bankruptcies = Bank.bankruptcies
  		this.Leverage = sumProp2(Firms, "debt")  / sumProp2(Firms, "equity") 
		this.totalLoans = sumProp2(Firms, "loans")
		this.trustLoans = Bank.trustLoans
		this.doubtLoans = Bank.doubtLoans
		this.doubtfulRate = this.doubtLoans / this.totalDebt
		this.liquidity_over_debt = this.moneySupply / this.totalDebt
		this.assetValue_over_money = this.assetValueTotal / this.moneySupply 
		if(frameCount > 3) {
			this.debt_to_capital = this.totalDebt / this.assetValueTotal * 100
		}
		else {
			this.debt_to_capital = 0
		}

		// UNEQUALITIES ----------
		this.firstDecileInc = firstDecileCalc2(Workers, "income")
		if(frameCount>1){
			this.firstDecileWealth =  firstDecileCalc2(Workers, "wealth")
		}
		else{
			this.firstDecileWealth =  0
		}
		// Production
		this.unemployment = Workers.length - this.employment
		// this.GDP = sumProp(Firms, "addedValue")

		this.stateDeposits = State.money

	}

	this.yearlyCalc = function() {
		if(frameCount >= timePeriod) {
			// Prices 
			// if(this.monthly_number_transac != 0) {
			// 	this.averagePrice = this.monthlyTraded / this.monthly_number_transac
			// }
			// else{
			// 	this.averagePrice = 0
			// }
			let annualProfits = sumProp2(Firms, "annual_income")
	 		this.arr.annualProfits.push(annualProfits)
	 		let financial_fragility = NaN
	  		if(annualProfits < this.privateDebt/100) {
	  			financial_fragility = 100
	  		}
	  		else {
	  			financial_fragility = this.privateDebt / annualProfits
	  		}
	  		this.arr.financial_fragility.push(financial_fragility)
	  		this.arr.output_capacity.push(this.nbr_machines)

			// INFLATION
			if(this.arr.averagePrice_smoothed[t-timePeriod - 12] != 0 && t > timePeriod * 3) {
	        	this.inflation = (this.arr.averagePrice_smoothed[t - 12] - this.arr.averagePrice_smoothed[t-timePeriod - 22] ) / this.arr.averagePrice_smoothed[t-timePeriod - 21]
	    
	        	if(this.arr.averagePrice_smoothed[t-12] == undefined || this.arr.averagePrice_smoothed[t-timePeriod-22] == undefined){
	        	anczi[0] = 0
	        	}
	        	}
	        else{
	        	this.inflation = 0
	        }

	        this.arr.inflation.push(this.inflation)
	        this.arr.inflation_MA = moveMean(this.arr.inflation, 5)
	        // this.arr.inflation_MA = moveMean(this.arr.inflation, 5)
	        this.arr.employment_yearly.push(yearly(this.arr.employmentRate))

	        this.arr.yearly_wage.push(this.averageWage)

			// WAGE INFLATION
			if(this.arr.yearly_wage.length > 1) {
	        	this.wageInflation = growthRate(this.arr.yearly_wage)
	        	}
	        else{
	        	this.wageInflation = 0
	        }
	        this.arr.wageInflation.push(this.wageInflation)
	    }
	}

	this.arrayConstruct = function() {
		for(var r in this.var){
			this.arr[r].push(this[r])
		}
		this.arr.averagePrice_smoothed = moveMean(this.arr.averagePrice, 11)
		//this.arr.averageWage_smoothed = moveMean(this.arr.averageWage, 11)
	}

	this.stockCalc = function () {
		for(var r in Resources) {
			this.stock[Resources[r]] = 0
		}

		for(var r in Resources) {

			for(var i in Agents) {

				this.stock[Resources[r]] += Agents[i].stock[Resources[r]]
			}
				this.stock_arr[Resources[r]].push(this.stock[Resources[r]])
		}
	}


	this.var = {
		totalFoodProd:0,
		totalFoodNeed:0,
		moneySupply:0,
		totalTraded:0,
		moneyVelocity:0,
		numberTransac:0,
		averagePrice:0,
		averagePrice_smoothed:0,
		averageWage:0,
		totalDemand:0,
		totalDebt:0,
		totalLoans:0,
		unemploymentRate:0,
		GDP:0,
		assetValueTotal:0,
		monthlyTraded:0,
		monthly_number_transac:0,
		liquidity_over_debt:0,
		assetValue_over_money:0,
		debt_to_capital:0,
		averageWage:0,
		GDP:0,
		employmentRate:0,
		GDP_growth:0,
		totalDividends:0,
		totalWages:0,
		totalIncome:0,
		Consumption:0,
		totalSavings:0,
		profitShare:0,
		wageShare:0,
		capacity_utilization:0,
		realGDP:0,
		trustLoans:0,
		doubtLoans:0,
		bankruptcies:0,
		firstDecileInc:0,
		Profits:0,
		totalSaving:0,
		bankProfits:0,
		firmsProfits:0,
		bankDividends:0,
		firmsDividends:0,
		firmsDeposits:0,
		workersDeposits:0,
		bankReserves:0,
		moneyDestruction:0,
		doubtfulRate:0,
		Consumption_v:0,
		realWage:0,
		production:0,
		unemployment:0,
		vacancies:0,
		internal_financing:0,
		accepted_wage:0,
		unsold_ratio:0,
		stock_after_prod:0,
		excess_firms:0,
		ok_firms:0,
		excess_firms_st:0,
		ok_firms_st:0,
		target_employment:0,
		offered_wage:0,
		financial_wealth:0,
		firstDecileWealth:0,
		stockMarketPrice:0,
		Investment:0,
		Leverage:0,
		profitRate:0,
		publicDebt:0,
		privateDebt:0,
		nbr_machines:0,
		labourSupply:0,
		InvestmentDemand:0,
		stateDemand:0,
		Demand:0,
		totalStock:0,
		public_debt_to_GDP:0,
		dividends_to_profits:0,
		retained_earnings:0,
		Savings:0,
		average_target_debt_ratio:0,
		investment_to_GDP:0,
		averageSavingProp:0,
		Demand_yearly:0,
		investment_yearly:0,
		stateDeposits:0,
		stockMarketCap:0,
		stockMarketCap_to_GDP:0,
		price_earnings_ratio:0,
		tobin_Q:0,
	}

	this.arr = {
		inflation:[],
		wageInflation:[],
		employment:[],
		inflation_MA:[0],
		employment_yearly:[],
		annualProfits:[],
		financial_fragility:[],
		output_capacity:[],
		averagePrice_smoothed:[],
		yearly_wage:[],
	}
	for(var i in this.var) {
		this.arr[i] = []
	}

}


function firstDecileCalc(arr, prop) {
	var arr = arr
	arr.sort(function(a, b){return b[prop] - a[prop]});

	var decile = arr.slice(0, Math.round(arr.length/10) )

	var output = sumProp(decile, prop) / sumProp(Workers, prop)

	return output
} 

function firstDecileCalc2(arr, prop) {
	var arr = arr

	arr.sort(function(a, b){return b[prop][frameCount] - a[prop][frameCount]});
	var decile = arr.slice(0, Math.round(arr.length/10) )

	var output = sumProp2(decile, prop) / sumProp2(Workers, prop)

	return output
} 

function Quantiles(arr, prop, n) {
	var arr = arr
	var output = []

	arr.sort(function(a, b){return b[prop][frameCount] - a[prop][frameCount]});
	
	for(var i = 0; i < n; i++) {
		output[i] = arr.slice(Math.floor(arr.length/n) *  i, Math.floor(arr.length/n) *  (i + 1))
	}	

	for(var i = 0; i < n; i++) {
		output[i] = sumProp2(output[i], prop)
	}	
	console.log(output)


	return output
} 



function moveMean(arr, n){
	var output = [];
	for (var i = 0; i < Math.min(arr.length, n) ; i++)
	{
		output[i] = arr.reduce((accumulator, currentValue) => accumulator + currentValue)/arr.length
	}

	for (var i = n; i < arr.length - n + 1; i++)
	{
		var values = arr.slice(i - n, i + n)
		output[i] = values.reduce((accumulator, currentValue) => accumulator + currentValue)/values.length

	}
	return output
}

function moveMean2(arr, n) {
	if(arr.length < 2*n) {
		return arr.reduce((accumulator, currentValue) => accumulator + currentValue)/arr.length
	}
	else {
		var values = arr.slice(arr.length - n, arr.length)
		return values.reduce((accumulator, currentValue) => accumulator + currentValue)/values.length
	}

}


function yearly(arr) {
	let delay = Math.min(frameCount, timePeriod)
	var values = arr.slice(-delay)
	return mean2(values)
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function count(arr, condition) {
    var count = 0;
    for(let i=0; i < arr.length; i++) {
        if (condition(arr[i])){
            count++;
        }
    }
    return count;
}

function growthRate(arr) {
	return (arr[arr.length-1] - arr[arr.length-2])  /  arr[arr.length-2]
}