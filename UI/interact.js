blobInfoElt = document.getElementById('blobInfos')
newPopButton = document.getElementById('newPop')
frameCountElt = document.getElementById('frame_Count')
AgentsElt = document.getElementById('AgentsTable')
GlobalsElt = document.getElementById('Globals')
MarketElt = document.getElementById("Market")
paramElt = document.getElementById("param")

VizElt = document.getElementById('viz')

tradePanelElt = document.getElementById('tablePanel')
tradeButtonElt = document.getElementById('tableButton')
tradeButtonElt.addEventListener('click', function(e){
	if(tradePanelElt.style.width == '200px') {
	tradePanelElt.style.width = '20px';
	tradePanelElt.style.visibility = 'hidden'
	}
	else {tradePanelElt.style.width = '200px'}
})

boostButtonElt = document.getElementById('boostButton')
boostButtonElt.addEventListener('click', function() {
	visual = "boost"
	clearSVG(); 
	createCanvas(800, 800);
	canvas = document.getElementById('defaultCanvas0')
	document.getElementById('viz').appendChild(canvas)
})

goodMarketButton

graphButtonElt = document.getElementById('graphButton')
graphButton.addEventListener('click', function() {
	visual = "graphics"
	clearSVG(); 
})

goodMarketButtonElt = document.getElementById('goodMarketButton')
goodMarketButtonElt.addEventListener('click', function() {
	visual = "goodMarket"
	clearSVG(); 
})


canvaButtonElt = document.getElementById('canvaButton')
canvaButton.addEventListener('click', function() {
	visual = "canva"
	clearSVG()
	createCanvas(800, 800);
  	canvas = document.getElementById('defaultCanvas0')
	document.getElementById('viz').appendChild(canvas)
})

treemapButtonElt = document.getElementById('treemapButton')
treemapButton.addEventListener('click', function() {
	visual = "treemap"
	clearSVG()
})

firmsButton.addEventListener('click', function() {
	visual = "firms"
	clearSVG()
})

workerButtonElt = document.getElementById('workersButton')
workerButtonElt.addEventListener('click', function() {
	visual = "workers"
	clearSVG()
})

workersTableButton = document.getElementById('workersTableButton')
workersTableButton.addEventListener('click', function() {
	visual = "workersTable"
	clearSVG()
})

workersGraphButton = document.getElementById('workersGraphButton')
workersGraphButton.addEventListener('click', function() {
	visual = "workersGraph"
	clearSVG()
})


speculatorButtonElt = document.getElementById('SpeculatorsButton')
speculatorButtonElt.addEventListener('click', function() {
	visual = "speculators"
	clearSVG()
})

BankButtonElt = document.getElementById('bankButton')
BankButtonElt.addEventListener('click', function() {
	visual = "bankTable"
	clearSVG()
})

BankChartElt = document.getElementById('bankChart')
BankChartElt.addEventListener('click', function() {
	visual = "bankCharts"
	clearSVG()
})

firmTableButton = document.getElementById('firmTableButton')
firmTableButton.addEventListener('click', function() {
	visual = "firmTable"
	clearSVG()
})

firmGraphButton = document.getElementById('firmGraphButton')
firmGraphButton.addEventListener('click', function() {
	visual = "firmCharts"
	clearSVG()
})

function keyPressed() {
	if(keyCode == 32) {
		play=!play;
		console.warn("SPACE BAR")
	}
}


function mouseClicked(mode) {
  if( mouseX > 0 && mouseX < width  && mouseY > 0 && mouseY < height) {
	  if(selectMode == "pads") {
		  selection = check_in2(mouseX,mouseY);
		  selection.neighbors.map(function(d) {d.clor=[0,0,0]})
		  selection.blobs_inside();
		  if(document.getElementsByTagName("p")[0]) {document.getElementsByTagName("p")[0].remove()}
		  	createP(  "x : " + selection.x 
		        + "   y : " + selection.y 
		        + "   food : " + selection.y 
		        + "   grow_chance : " + selection.grow_chance)
		  }
	  if(selectMode = "blobs") {
	  	if(check_in2(mouseX,mouseY).blobs_in.length > 0) {
	  		selectBlob();
	  		printInfos(); 
		}
	  }
	}
} 


function Mouse_check() {
  for(i=0; i < Terrain.Pads.length; i++) {
    for (j=0; j < Terrain.Pads[i].length; j++) {
      pad = Terrain.Pads[i][j];
      if(check_in(mouseX, mouseY, i, j)) {
        //pad.food = 250
        //pad.clor = [pad.food,20,0]
        show_panel(i,j)
      }
    }
  }
  fill(250)
  text(mouseX, 20, 20, 20)
  text(mouseY, 20, 40, 20)
}

function printAllBlobs_in() {
	arr = []
	for (i=0; i < nbr_rows;i++) {
      for(p=0; p < nbr_columns; p++) {
      	inside = Terrain.Pads[i][p].blobs_inside()
        if(inside.length > 0) {arr.push(Terrain.Pads[i][p]);arr.push(inside);}
      }
    }
	return arr
}


function selectBlob() {
		// undo previous selected blob style //
		if(selectedBlob != 0) {
			selectedBlob.clor = selectedBlob.DNA.clor;
			selectedBlob.stroke = 1;
		}


		selectedBlob = random(check_in2(mouseX,mouseY).blobs_in);

		// Style the new selected blob//
		selectedBlob.clor = [100,100,100];
		selectedBlob.stroke = 3;

}


function show_panel (im, jn) {
  showPad = Terrain.Pads[im][jn];
  fill(200)
  push()
  translate(mouseX, mouseY)
  rect(0, 0, 100, 100)
  fill(0)
  text("food:" + Math.round(showPad.food*100)/100, 10, 20, 20)
  text("grow_chance:" + Math.floor(showPad.grow_chance), 10, 40, 20)
  pop()
}

function printInfos() {
	blobInfos.textContent = 
	" ID  :  "+"  " + selectedBlob.id + "" +
	" Life  :  "+"" + Math.floor(selectedBlob.life) +
	" Maxlife  :  "+"" + selectedBlob.Maxlife
}

function printGlobals() {
	globalData.textContent = " Number of Blobs " + Pop.Blobs.length;
}

newPopButton.addEventListener('click', generate)

function generate() {
	console.log('check')
	Pop.generatePop(10)
}


moneySupplyH = []
function calculateGlobals() {
	totalTraded = 0;
	for(u=0; u < Trades.length; u++) {
		totalTraded = totalTraded + Trades[u].price * Trades[u].q
	}
	Globals.totalTraded = totalTraded

	fill(0,0,0)
	text("M x V " + totalTraded,width-200, 20)

	moneySupply = floor((sumProp(Agents, "money") * 100)) / 100
	moneySupplyH.push(moneySupply)
	text(" M " + moneySupply,width-200, 40)
	Globals.moneySupply = moneySupply


	moneyVelocity = (totalTraded/moneySupply)
	text(" V " + moneyVelocity,width-200, 60)
	Globals.moneyVelocity = moneyVelocity

	numberTransac = sumProp(Trades, "q")
	text(" T " + numberTransac,width-200, 80)
	Globals.numberTransac = numberTransac
	Globals.numberTransacArr.push(numberTransac)

	averagePrice = (totalTraded/numberTransac)
	text(" P " + averagePrice,width-200, 100)
	Globals.averagePrice = averagePrice
	if(Globals.averagePrice) {
		Globals.averagePriceArr.push(averagePrice)
	}

	averageWage = sumProp(Workers, "income")/Workers.length
	text(" W " + averageWage,width-200, 120)
	Globals.averageWage = averageWage
	Globals.averageWageArr.push(averageWage)

	totalDemand = sumProp(Consumers, "demand")
	text(" Demand " + totalDemand,width-200, 140)
	Globals.totalDemand = totalDemand

	goodOffer = sumProp(Industrials, "good")
	text(" Offer " + goodOffer,width-200, 160)


	totalDebt = sumProp(Agents, "debt")
	text(" totalDebt " + totalDebt, width-200, 180)
	totalDebtArr.push(totalDebt)
	Globals.totalDebt = totalDebt

	GDP = sumProp(Firms, "addedValue")
	Globals.GDPArr.push(GDP)
	Globals.GDP = GDP

	assetValueTotal = sumProp(Agents, "assetValue")
	Globals.assetValueTotalArr.push(assetValueTotal)
	Globals.assetValueTotal = assetValueTotal

	totalAssetValueTotal = sumProp(Agents, "totalAssetsValue")
	Globals.totalAssetValueTotalArr.push(totalAssetValueTotal)
	Globals.totalAssetValueTotal = totalAssetValueTotal


	totalStockCalc()

	var unemployed = 0;
	for(var i = 0; i < Workers.length; ++i){
	    if(Workers[i].employer == 0)
	        unemployed++;
	}

	unemploymentRate = unemployed / Workers.length



	text(" Food Market Price " + foodMarket.price,width-200, 200)
}

function sumProp(arr,prop) {
	output = 0;
	// console.warn("GDP CALC")
	for(u=0; u < arr.length; u++) {

		if(!(arr[u].solvability == "bankrupt")) {

			output = output + arr[u][prop]
			
		}
	}
	return output
}

function sumProp2(arr,prop) {
	if(arr == Firms) {
		output = 0;
		for(u=0; u < arr.length; u++) {
			output = output + arr[u][prop][arr[u].age]
		}
		return output
	}
	else{
		output = 0;
		for(u=0; u < arr.length; u++) {
			output = output + arr[u][prop][frameCount]
		}
		return output
	}
}

function sumProp3(arr,prop) {
	if(arr == Firms) {
		output = 0;
		for(u=0; u < arr.length; u++) {
			output = output + arr[u][prop][arr[u].age-1]
			//console.log(arr[u][prop],output)
		}
		return output
	}
	else{
		for(u=0; u < arr.length; u++) {
			output = output + arr[u][prop][frameCount-1]
			//console.log(arr[u][prop],output)
		}
		return output
	}
}

function totalStockCalc() {
	for(var r in Resources) {
		totalStock[Resources[r]]=0
	}
	for(var r in Resources) {
		var prop = Resources[r]

		for(var i in Agents) {
			totalStock[prop] += Agents[i].stock[prop] 
		}
	}
}

