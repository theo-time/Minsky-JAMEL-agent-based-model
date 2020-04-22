function userInterface() {

    // Basics GUI 

    // PrintMarket(foodMarket.Markets["food"],MarketElt)
    // objectPrinter(Globals.stock, totalStockElt, "Total Stock")
    // objectPrinter(Globals, GlobalsElt, "Macro Variables")
        // PrintTable();
    // -------- Treemap Viz ----------
    // if(frameCount > 1 && frameCount%10 == 0) {
    //   // var hierarchy = new moneyData(Agents, "money", Globals.moneySupply)
    //   //  treemap(Agents, "money", 200, 100, "treemap1");

    //   // // var hierarchy = new moneyData(Workers, "assetValue", Globals.assetValueTotal)
    //   // treemap(Workers, "money", 200, 100, "treemap2");

    // //   // var hierarchy = new moneyData(Agents, "totalAssetsValue", Globals.totalAssetValueTotal)
    // //   // treemap(hierarchy, 200, 100, "treemap3");
    // }


    switch(visual) {

      case "boost" :
        background(30,30,50)
        printTime()   
        break

      case "canva" :
        background(30,30,50)
        scale(scaleValue)
        Bank.show();
        for(i=0; i < Agents.length; i++){
          Agents[i].show();
        };

        showContracts()
        printTime()
        // Link between employers and Workers
        for(var i=0; i < Workers.length; i++){
            if(Workers[i].employer) {
              push()
              stroke(255,0,0);
              line(Workers[i].pos.x, Workers[i].pos.y, Workers[i].employer.pos.x, Workers[i].employer.pos.y)
              pop()
            }
        }

        tradePanelElt.style.display = "block"
        paramElt.style.display = "block"
        break

      case "graphics" : 
      tradePanelElt.style.display = "none"
      paramElt.style.display = "none"
        clearSVG()
        var col1 = document.createElement('div')
        var col2 = document.createElement('div')
        var col3 = document.createElement('div')
        VizElt.appendChild(col1)
        VizElt.appendChild(col2)

        multigraph(["production", "Consumption_v"], "Commodities Market")
        // printGlobal("GDP")
        // printGlobal("GDP_growth")
        compositionGraph(["totalIncome","totalSavings"], "Income & Savings" )

        // printGlobal("bankProfits")
        // printGlobal("firmsProfits")
        // printGlobal("Profits")
        // stackedAreasNorm(["bankProfits", "firmsProfits"], "Profits Repartition", "norm")

        stackedAreas(["trustLoans","doubtLoans"], "Debt")

        compositionGraph(["moneySupply","firmsDeposits", "workersDeposits", "bankReserves"], "Income & Savings" )

        stackedAreasNorm(["totalWages","totalDividends"],"Income Share" ,"norm")
        stackedAreasNorm(["bankDividends","firmsDividends"],"Dividends Repartition" ,"norm")
        printGlobal("bankruptcies")
        printGlobal("averagePrice")
        // printGlobal("averagePrice_smoothed")
        printGlobal("averageWage")
        printGlobal("realWage")
        printGlobal("accepted_wage")  
        printGlobal("moneySupply")     
        printGlobal("totalDebt")
        printGlobal("moneyVelocity")
        printGlobal("totalLoans")
        printGlobal("internal_financing")
        printGlobal("doubtfulRate")
        printGlobal("monthly_number_transac")
        // printGlobal("debt_to_capital")
        printGlobal("totalSaving")  
        printGlobal("unsold_ratio")
        printGlobal("stock_after_prod")
        multigraph(["excess_firms", "ok_firms"], "Stocks (Price Calc)")
        multigraph(["excess_firms_st", "ok_firms_st"], "Stocks (Prod Calc)")

        print(Globals.stock_arr["food"], col1, "food")
        printGlobal("totalDividends")
        printGlobal("employmentRate")
        multigraph(["vacancies", "unemployment"], "Work Market")
        printGlobal("inflation")
        printGlobal("inflation_MA")
        printGlobal("profitShare")
        printGlobal("firstDecile")


        // printGlobal("deadWorkers")

        // var capaUti = new trace(Time,Globals.arr.capacity_utilization,"lines")
        // var layout = {
        //     title:'Line and Scatter Plot'
        // };
        // Plotly.newPlot('viz', [capaUti], layout);

        // var Phillips = new trace(Globals.arr.inflation,Globals.arr.employment,"lines")
        // var layout = {
        //     title:'Phillips Curve',
        //     width: 500,
        //     height: 500,
        // };
        // Plotly.newPlot('viz', [Phillips], layout);
        phillipsCurve = newGraph(Globals.arr.employment_yearly, Globals.arr.inflation_MA,'Phillips Curve', "scatter", "text+markers+lines")
        newGraph(Time,Globals.arr.capacity_utilization, "Capacity utilisation", "lines")
        goodwinCycle = newGraph(Globals.arr.wageShare, Globals.arr.employmentRate, "Goodwin Cycles", "lines")

        // for(var r in Globals.stock) {
        //   print(Globals.stock_arr[r], col2, r)
        //   print(Globals.price_arr[r], col3, r)
        // }
        // printGlobal(Globals.averageWageArr,'Wage')
        // printGlobal(Globals.numberTransacArr,'Transactions')


        //timeSerie(GDPArr,'GDP', 1, 250, 150, '#viz');

        break

      case "goodMarket" : 
        tradePanelElt.style.display = "none"
        paramElt.style.display = "none" 
        clearSVG()
        createTables(localMarket)
        agentGraph(localMarket)
        break

      case "treemap" : 
        clearSVG()
        sankeyDiagram()

        break

      case "firms" : 
        clearSVG()
        printFirms()

        break

      case "workers" : 
        clearSVG()
        displayAgents(Agents)

        break

      case "workersTable" : 
        clearSVG()
        createTables(Workers[0])
        agentTable(Workers[0])

        break


      case "workersGraph" : 
        tradePanelElt.style.display = "none"
        paramElt.style.display = "none" 
        console.log("WORJKNEGOJ")
        clearSVG()
        createTables(Workers[0])
        agentGraph(Workers[0])

        break

      case "speculators" : 
        clearSVG()
        printSpeculators()
        break

        case "bankTable" : 
        clearSVG()
        createTables(Bank)
        agentTable(Bank)
        break

        case "bankCharts" : 
        clearSVG()
        createTables(Bank)
        agentGraph(Bank)
        break

        case "firmTable" : 
        clearSVG()
        tradePanelElt.style.display = "none"
        paramElt.style.display = "none" 
        createTables(Firms[0])
        agentTable(Firms[0])
        // printTables(Firms[0].balanceSheet.Assets)
        // printTables(Firms[0].balanceSheet.Liabilities)
        break

        case "firmCharts" :
        tradePanelElt.style.display = "none"
        paramElt.style.display = "none" 
        clearSVG()
        createTables(Firms[0])
        agentGraph(Firms[0])

        // printTables(Firms[0].balanceSheet.Assets)
        // printTables(Firms[0].balanceSheet.Liabilities)
        break

    }

}