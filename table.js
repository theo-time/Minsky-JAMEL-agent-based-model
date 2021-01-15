

var tradesTable = d3.select('#table')
var tableBody = document.querySelector("tbody")

var marketInfoElt = document.getElementById("marketInfos")
var column1 = document.getElementById("col1")
var column2 = document.getElementById("col2")
var column3 = document.getElementById("col3")
var column4 = document.getElementById("col4")

var totalStockElt = document.getElementById("TotalStock")

function PrintTable() {
	/*
	clearSVG();
	lastTrades = LastTradesCalc();
	table = tradesTable.selectAll('li')
			.data(lastTrades)
			.enter()
			.append('p')
				.text(function(d) {return d.buyer})
	*/
	tableBody.textContent = ""
	lastTrades = Trades.slice(-26)
	lastTrades.reverse()

	//lastTrades = invert(lastTrades)
	for(u=0; u < lastTrades.length; u++) {
		trad = lastTrades[u]
		var newTrade = document.createElement('tr')
		var buyer = document.createElement('td')
			buyer.textContent = trad.buyer.type + trad.buyer.id
			buyer.style.color = 'rgba(' + trad.buyer.clor + ")"

		var seller = document.createElement('td')
			seller.textContent = trad.seller.type + trad.seller.id
			seller.style.color = 'rgba(' + trad.seller.clor + ")"

		newTrade.insertBefore(seller,null)
		newTrade.insertBefore(buyer,seller)
        newTrade.innerHTML = newTrade.innerHTML + "</td>" +  trad.prop + "</td>" + "<td>" +  Math.floor(trad.price*100)/100 + " €" +"</td>" + "<td>" +  trad.q + "</td>";
    	tableBody.appendChild(newTrade)
	}
}

function PrintMarket(market, parent) {

	// Display the current market price -------------

	var currentPriceElt = document.createElement("div")
	var label = document.createElement("div")
	var price = document.createElement("div")

	label.textContent = "Market Price : "
	price.textContent = market.price


	currentPriceElt.appendChild(label)
	currentPriceElt.appendChild(price)
	var oldCurrentPriceElt = parent.childNodes[1] 
	parent.replaceChild(currentPriceElt, oldCurrentPriceElt)
	// Display the Orders  ----------------

	column1.innerHTML="<div>Buyer</div>"
	column2.innerHTML="<div>Price</div>"
	column3.innerHTML="<div>Seller</div>"
	column4.innerHTML="<div>Price</div>"
	for(var i=0; i < market.buyOrders.length; i++) {
		var emetterElt = document.createElement('div')
		emetterElt.textContent = market.buyOrders[i].emetter.type + market.buyOrders[i].emetter.id
		column1.appendChild(emetterElt)

		var buyElt = document.createElement('div')
		buyElt.textContent = Math.floor(market.buyOrders[i].price*1000)/1000 + " $"
		column2.appendChild(buyElt)
	}
	for(var i=0; i < market.sellOrders.length; i++) {
		var emetterElt = document.createElement('div')
		emetterElt.textContent = market.sellOrders[i].emetter.type + market.sellOrders[i].emetter.id
		column3.appendChild(emetterElt)

		var sellElt = document.createElement('div')
		sellElt.textContent = market.sellOrders[i].price
		column4.appendChild(sellElt)
	}
}

function printProperties(object, parent) {
Object.keys(object).forEach(function(key,index) {
    var newProp = document.createElement('span')
	newProp.textContent = object[key]
	parent.appendChild(newProp)
});
}


function clearSVG() {
	//console.log('hey')
	//console.log(document.getElementsByTagName('svg')[0])
	var item = document.getElementById('viz')
	item.innerHTML= ''
}

function lastCalc(arr, n) {
	var output = []; 
	for(i=0; i < n; i++) {
		if(arr[arr.length-i]) {output.push(arr[arr.length-i])} ;
	}
	return output;
}

function objectPrinter(obj, parent, label, inbox) {
	parent.innerHTML = ""
	var title = document.createElement("div")
	title.textContent = label
	title.setAttribute('class',"boxTitle")
	parent.appendChild(title)

	for(var p in obj) {
		var Div = document.createElement('div')
		var name = document.createElement('p')
		var value = document.createElement('p')
		name.textContent = p
		value.textContent =  numberWithSpaces(Math.floor(obj[p]*1000)/1000)

		Div.appendChild(name)
		Div.appendChild(value)

		if(inbox) {
		   var Box = document.createElement('div')
		   //Box.setAttribute("class","objPrinter")
		   console.log(Box)
		   Box.appendchild(Div)
		   parent.appendChild(Box)
		}

		else {
			parent.appendChild(Div)
		}
	}	

}

function printProperties(object, parent, GoodProps) {
	var Box = document.createElement('div')
	Box.setAttribute('class', "Box")
	Box.style.background = 'rgba(' + object.clor + ')'	

	var title = document.createElement('div')
	title.style["text-align"] = "center"
	title.textContent = object.type + "  " + object.id
	title.style.background = 'rgba(' + object.clor + ')'
	title.setAttribute('class', "boxTitle")
	Box.appendChild(title)

	Object.keys(object).forEach(function(key,index) {
		if(typeof object[key] == "number") {
			var value = object[key] 
		}
		else if(typeof object[key] == "object"){
			var value = object[key][object[key].length - 1]
		}

		if(GoodProps) {
			if(GoodProps.includes(key)){
				var name = document.createElement('p')
				var valueElt = document.createElement('p')
				var newProp = document.createElement('div')

				name.textContent = key
				valueElt.textContent = Math.floor(value*100)/100

				newProp.appendChild(name);
				newProp.appendChild(valueElt);
				newProp.setAttribute('class', "prop")
				Box.appendChild(newProp)
			}
		}
		else {
			var name = document.createElement('p')
			var valueElt = document.createElement('p')
			var newProp = document.createElement('div')

			name.textContent = key
			valueElt.textContent = Math.floor(value*100)/100

			newProp.appendChild(name);
			newProp.appendChild(valueElt);
			newProp.setAttribute('class', "prop")
			Box.appendChild(newProp)
		}

	});

	objectPrinter(object.stock, Box, "Stock")

	parent.appendChild(Box)
}

function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

function createTables(agent) {
	var Tables = {}

	for(var i in agent.Tables) {
		Tables[i] = agent[i] 
			for(var u = 0; u < Tables[i].length; u++){
				Tables[i][u] = Math.round(Tables[i][u] * 100) / 100
			}
	}

	agent.Tables = Tables
	return Tables
}

function createBankTables(agent) {
	var Tables = {}

	for(var i in agent.Tables) {
		Tables[i] = agent[i] 
			for(var u = 0; u < Tables[i].length; u++){
				Tables[i][u] = Tables[i][u] 
			}
	}

	agent.Tables = Tables
	return Tables
}




function agentTable(agent) {
	var table = document.createElement("div")
	table.style.width = "100%"

	var values = []
	var headers = []

	for (var i in agent.Tables){
		headers.push(i)
		values.push(agent.Tables[i])
	}

	var data = [{
	  type: 'table',
	  header: {
	    values: headers ,
	    align: "center",
	    line: {width: 1, color: 'black'},
	    fill: {color: "grey"},
	    font: {family: "Arial", size: 12, color: "white"}
	  },
	  cells: {
	    values: values,
	    align: "center",
	    line: {color: "black", width: 1},
	    font: {family: "Arial", size: 11, color: ["black"]}
	  }
	}]

	var layout = {
	  title: title,
	  width:"1500",
	  font: {
	    size: 18,
	    color: '#7f7f7f'
	  }
	};

	Plotly.react(table, data, layout);

	VizElt.appendChild(table)

}

function agentGraph(agent) {
	for (var prop in agent.Tables){
		newGraph(Time, agent.Tables[prop], prop, "scatter", "lines")
	}	
}

function printTables(obj) {
	var box = document.createElement('div')

	var values = []
	var headers = []

	for (var i in obj){
		headers.push(i)
		values.push(obj[i])
	}

	console.log(headers, values)
	var data = [{
	  type: 'table',
	  header: {
	    values: headers ,
	    align: "center",
	    line: {width: 1, color: 'black'},
	    fill: {color: "grey"},
	    font: {family: "Arial", size: 12, color: "white"}
	  },
	  cells: {
	    values: values,
	    align: "center",
	    line: {color: "black", width: 1},
	    font: {family: "Arial", size: 11, color: ["black"]}
	  }
	}]

	var box = document.createElement('div')

	Plotly.react(box, data);

	VizElt.appendChild(box)
}