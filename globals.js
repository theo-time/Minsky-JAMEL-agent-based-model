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


	for(var r in Resources) {
		this.stock_arr[Resources[r]] = []
	}

	for(var r in Resources) {
		this.price_arr[Resources[r]] = []
	}


	this.dailyCalc = function() {
		this.moneySupply = floor((sumProp(Agents, "money") * 100)) / 100
	}

	this.monthlyCalc = function() {
		// --- Money ----
		var t = frameCount
		this.lastTrades = Trades.filter(trade => 1 > frameCount - trade.date)
		this.monthlyTraded = this.lastTrades.reduce((acc, trade, i) => {return acc + trade.price * trade.q} , 0)
		this.totalTraded = Trades.reduce((acc, currentValue, i) => {return acc + Trades[i].price * Trades[i].q}, 0)
		this.moneySupply = floor((sumProp(Agents, "money") * 100)) / 100
		this.moneyVelocity = this.monthlyTraded / this.moneySupply
		this.moneyDestruction = Bank.moneyDestruction
		this.numberTransac = sumProp(Trades, "q")
		this.Consumption_v = sumProp(this.lastTrades, "q")
		this.monthly_number_transac = this.lastTrades.length
		this.arr.monthly_number_transac.push(this.monthly_number_transac)
		console.log(this.lastTrades)

		this.firmsProfits = sumProp2(Firms, "income") 
		this.bankProfits = Bank.Profits[t]
	 	this.Profits = 0 
	 	if(this.firmsProfits>0) {this.Profits += this.firmsProfits}
	 	if(this.bankProfits>0) {this.Profits += this.bankProfits}

	 	this.bankDividends = Bank.dividends[t-1]
	 	this.firmsDividends = sumProp2(Firms, "dividends")

		this.GDP = sumProp2(Firms, "sales") + this.bankProfits
		this.averagePrice = this.monthlyTraded / this.Consumption_v

		this.GDP_growth =  ( this.GDP - this.arr.GDP[frameCount-2] )  / this.arr.GDP[frameCount-2] 
		if(frameCount < 3 || this.arr.GDP[frameCount-2] == 0) {
			this.GDP_growth = 0
		}

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

		this.averageWage = sumProp(Workers, "income") / Workers.length
		// this.assetValueTotal = sumProp(Agents, "assetValue")

		this.totalDividends = this.bankDividends + this.firmsDividends

        // EMPLOYMENT
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
	 	this.averageWage = mean2(Wages)
	 	this.realWage = mean2(Wages)/ this.averagePrice 
	 	this.accepted_wage = sumProp2(Workers, "accepted_wage") / Workers.length
	 	this.employmentRate = this.employment / Workers.length
	 	// console.log(Wages, this.averageWage)

	 	this.production_capacity = sumProp(Firms, "production_capacity")
	 	this.totalWorkForce = Workers.length
	 	this.capacity_utilization = sumProp2(Firms, "capacity_utilization") / Firms.length
	 	this.production = sumProp2(Firms, "Production")
	 	this.vacancies = sumProp2(Firms, "vacancies")
	 	this.internal_financing = sumProp2(Firms, "internal_financing")

	 	this.Consumption = sumProp2(Workers, "consumption")
	 	this.totalSavings = sumProp2(Workers, "saving")
	 	this.totalIncome = sumProp2(Workers, "income") //this.totalWages + this.totalDividends


	 	this.profitShare = this.totalDividends / this.totalIncome
	 	this.wageShare =  1 - this.profitShare

	 	this.totalSaving = sumProp2(Workers, "Saving")

	 	this.unsold_ratio = sumProp2(Firms, "unsold_ratio")/Firms.length
	 	this.stock_after_prod = sumProp2(Firms, "stock_ratio_after_prod")/Firms.length
	 	this.excess_firms = count(Firms, (e) => e.stock_ratio_after_prod[frameCount] > 2)
	 	this.ok_firms = count(Firms, (e) => e.stock_ratio_after_prod[frameCount] <= 2)
	 	this.excess_firms_st = count(Firms, (e) => e.unsold_ratio[frameCount] > 4)
	 	this.ok_firms_st = count(Firms, (e) => e.unsold_ratio[frameCount] < 1)

	 	this.Production_capacity = sumProp(Firms, "nbr_machines")
  		//  | -- MONETARY & FINANCIAL DATA -- |


		this.firmsDeposits = sumProp2(Firms, "cash")
		this.workersDeposits = sumProp2(Workers, "cash")
		this.bankReserves = Bank.money
  		this.bankruptcies = Bank.bankruptcies
		this.totalDebt = sumProp2(Firms, "debt") + sumProp(Workers, "debt") 
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
		this.firstDecile = firstDecileCalc(Workers, "money")

		// Production
		this.unemployment = Workers.length - this.employment
		// this.GDP = sumProp(Firms, "addedValue")

		// Life 
		this.deadWorkers = Workers.filter(worker => worker.alive == false)
		this.deadWorkers = this.deadWorkers.length 
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


			// INFLATION
			if(this.arr.averagePrice_smoothed[t-timePeriod - 12] != 0 && t > timePeriod * 3) {
	        	this.inflation = (this.arr.averagePrice_smoothed[t - 12] - this.arr.averagePrice_smoothed[t-timePeriod - 22] ) / this.arr.averagePrice_smoothed[t-timePeriod - 21]
	        	console.log(this.arr.averagePrice_smoothed[t - 12],this.arr.averagePrice_smoothed[t-timePeriod - 22], t, timePeriod )
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
	    }
	}

	this.arrayConstruct = function() {
		for(var r in this.var){
			this.arr[r].push(this[r])
		}
		this.arr.averagePrice_smoothed = moveMean(this.arr.averagePrice, 11)
	}

	this.stockCalc = function () {
		for(var r in Resources) {
			this.stock[Resources[r]] = 0
		}

		for(var r in Resources) {
			// console.warn(Resources[r],frameCount)
			for(var i in Agents) {
				// console.log(this.stock[Resources[r]])
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
		firstDecile:0,
		deadWorkers:0,
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
	}

	this.arr = {
		inflation:[],
		employment:[],
		inflation_MA:[0],
		employment_yearly:[0],
	}
	for(var i in this.var) {
		this.arr[i] = []
	}

}
// Globals should be an object, keeping track of variables and storing them in arrays
// it should be composed of objects containing 2 properties : "value" and "key"

function firstDecileCalc(arr, prop) {
	var arr = arr
	arr.sort(function(a, b){return b[prop] - a[prop]});

	var decile = arr.slice(0, Math.round(arr.length/100) )

	var output = sumProp(decile, "money") / sumProp(Workers, "money")

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
	console.log(arr)
	var values = arr.slice(arr.length - 1 - timePeriod, arr.length - 1)
	var output = values.reduce((accumulator, currentValue) => accumulator + currentValue)/values.length
	console.log('Yearly ', arr, output)
	return output
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