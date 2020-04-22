const Actions = {
	eat:{
		id:"eat",
		condition: (s) => s.food > 5,
		effect: (s) => s.eat(),
		state: {
			life:100
		},
		reached: (s) => s.life == 100
	}
	,
	buyFood:{
		id:"buyFood",
		condition: (s) => s.money >= Prices.food * 10,
		effect: function(a) {a.demand = (10 - a.stock.food)
			; a.buy('food', 10)
		},
		state: {
			food:10
		},
		reached: (s) => s.stock.food > 10
	},
	buyHouse:{
		id:"buyHouse",
		condition: (s) => s.money >= localMarket.products.house.bestprice,
		effect: function(a) {
			; a.buy("house", 1)
		},
		state: {
			house : 1
		},
		reached: (s) => s.stock.house > 1
	},
	work:{
		id:"work",
		condition: (s) => s.hasEmployer == true,
		effect: function(a) {
			//do nothing
		},
		state: {
			money: 1000000000
		},
		reached: (s) => s.money >= Prices.food * 10
	},
	getJob:{
		id: "getJob",
		condition: undefined,
		effect: (a) => a.findJob(),
		state: {
			hasEmployer: true
		},
		reached: (s) => s.hasEmployer = true
	}

}

const Goals = {
	feeding:{
		id:"feeding",
		dState: (s) => s.life == 100,
		isValid: (s) => s.life < 50,
	},
	housing:{
		id:"housing",
		dState: function(s) {
			if(s.house) {
				console.log("state has house")
				return s.house == 1
			}},
		isValid: (a) => a.stock.house < 1,
	}
}

console.log(Goals,Actions)


findAction = function(condition) {
	for(var a in Actions) {
	  //console.log(condititions,Actions[a].state)
	  console.log(Actions[a])
	  if(condition(Actions[a].state)) {
	  	  console.log("good")
	      return Actions[a]
	  }
	  else{
	  	  console.log("not good")
	  }
	}
    return "error"
}


