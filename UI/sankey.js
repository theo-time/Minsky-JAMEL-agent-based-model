function sankeyDiagram() {
  var sankey = document.createElement("div")

  var dataSank = {
    type: "sankey",
    orientation: "h",
    node: {
      pad: 15,
      thickness: 30,
      line: {
        color: "black",
        width: 0.5
      },
     label: ["Firms", "Bank", "Households", "Firms t-1", "Bank t-1", "Households t-1", "Firms t+1", "Bank t+1", "Households t+1", "Destruction", "Creation", ],
     color: ["blue", "blue", "blue", "black", "black"]
        },

    link: {
      source: [3, 10 , 4, 5 , 1 , 3 , 4 , 0 , 2, 0, 0],
      target: [0, 1 , 1, 2 , 0 , 2 , 2 , 2 , 0, 7, 9 ],
      value:  [
                Globals.arr.bankReserves[frameCount-2],  
                Globals.arr.totalLoans[frameCount-1], 
                Globals.arr.firmsDeposits[frameCount-2],
                Globals.arr.workersDeposits[frameCount-2],
                Globals.arr.totalLoans[frameCount-1], 
                Globals.arr.firmsDividends[frameCount-1],
                Globals.arr.bankDividends[frameCount-1],
                Globals.arr.totalWages[frameCount-1],
                Globals.arr.Consumption[frameCount-1],
                Globals.arr.bankProfits[frameCount-1],
                Globals.arr.moneyDestruction[frameCount-1],
                ],
      label:["Bank Reserves", "Money creation", "firmsDeposits", "workersDeposits", "totalLoans", "firmsDividends", "bankDividends", "totalWages"],
      color:["gray", "gray", "gray", "gray", "blue", "red", "red", "green"]
    }
  }

  var dataSank = [dataSank]

  var layoutSank = {
    title: "Basic Sankey",
    font: {
      size: 10
    }
  }

  Plotly.react(sankey, dataSank, layoutSank)

  VizElt.appendChild(sankey)
}