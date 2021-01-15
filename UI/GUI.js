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
        stackedAreas(["Consumption", "stateDemand", "InvestmentDemand"], "Aggregate Demand")
        printGlobal("Investment")
        printGlobal("investment_to_GDP")
        printGlobal("Savings")
        printGlobal("averageSavingProp")
        printGlobal("Leverage")
        printGlobal("average_target_debt_ratio")
        multigraph(["target_employment", "nbr_machines","labourSupply"], "Target Employment and Capital")
        printGlobal("public_debt_to_GDP")
        printGlobal('dividends_to_profits')
        printGlobal('retained_earnings')
        // printGlobal("GDP")
        // printGlobal("GDP_growth")
        compositionGraph(["totalIncome","Savings"], "Income & Savings" )

        // printGlobal("bankProfits")
        // printGlobal("firmsProfits")
        // printGlobal("Profits")
        // stackedAreasNorm(["bankProfits", "firmsProfits"], "Profits Repartition", "norm")

        stackedAreas(["trustLoans","doubtLoans"], "Debt")

        compositionGraph(["moneySupply","firmsDeposits", "workersDeposits", "bankReserves", "stateDeposits"], "Income & Savings" )

        stackedAreasNorm(["totalWages","totalDividends"],"Income Share" ,"norm")
        stackedAreasNorm(["bankDividends","firmsDividends"],"Dividends Repartition" ,"norm")
        printGlobal("bankruptcies")
        printGlobal("averagePrice")
        // printGlobal("averagePrice_smoothed")
        printGlobal("averageWage")
        printGlobal("yearly_wage")
        printGlobal("realWage")
        multigraph(["accepted_wage", "offered_wage"], "Labour Market")  
        printGlobal("moneySupply")     
        printGlobal("totalDebt")
        stackedAreas(["privateDebt","publicDebt"], "Debt")
        printGlobal("moneyVelocity")
        printGlobal("totalLoans")
        printGlobal("internal_financing")
        printGlobal("doubtfulRate")
        printGlobal("monthly_number_transac")
        // printGlobal("debt_to_capital")
        printGlobal("totalSaving")  
        printGlobal("totalStock")
        printGlobal("unsold_ratio")
        printGlobal("stock_after_prod")
        multigraph(["excess_firms", "ok_firms"], "Stocks (Price Calc)")
        printGlobal("wageInflation")
        multigraph(["excess_firms_st", "ok_firms_st"], "Stocks (Prod Calc)")

        print(Globals.stock_arr["food"], col1, "food")
        printGlobal("totalDividends")
        printGlobal("employmentRate")
        multigraph(["vacancies", "unemployment"], "Work Market")
        printGlobal("inflation")
        printGlobal("inflation_MA")
        printGlobal("profitRate")
        printGlobal("profitShare")
        printGlobal("firstDecileInc")
        printGlobal("firstDecileWealth")
        printGlobal("stockMarketPrice")
        printGlobal("stockMarketCap")
        printGlobal("stockMarketCap_to_GDP")
        printGlobal("price_earnings_ratio")
        printGlobal("tobin_Q")

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
        phillipsCurve = newGraph(Globals.arr.employment_yearly, Globals.arr.inflation,'Phillips Curve', "scatter", "text+markers+lines")
        phillipsCurve = newGraph(Globals.arr.employment_yearly, Globals.arr.wageInflation,'Phillips Curve', "scatter", "text+markers+lines")
        newGraph(Time,Globals.arr.capacity_utilization, "Capacity utilisation", "lines")
        goodwinCycle = newGraph(Globals.arr.wageShare, Globals.arr.employmentRate, "Goodwin Cycles", "lines")
        printGlobal("annualProfits")
        printGlobal("financial_fragility")
        financialCycle = newGraph(Globals.arr.output_capacity, Globals.arr.financial_fragility, "Financial Cycles", "lines")
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

      case "State" : 
        clearSVG()
        createTables(state)
        agentGraph(state)
        break

      case "firms" : 
        clearSVG()
        minskyPlot(Firms, "debt_ratio", "Production", "Debt ratio")
        minskyPlot(Firms, "target_debt_ratio_arr", "Production", "Target Debt Ratio" )
        // minskyPlot(Firms, "wage", "Production", "Wages")
        // minskyPlot(Firms, "price", "Production", "Prices")
        minskyPlot(Firms, "Production", "dividends", "Profit Rate")
        minskyPlot(Firms, "Production", "annual_income", "Profit Rate")  
        // minskyPlot(Firms, "target_debt_ratio_arr", "profit_rate", "Profit Rate")

        break

      case "workers" : 
        clearSVG()
        scatterPlot(Workers, "wealth", "income", "Wealth")
        scatterPlot(Workers, "financial_wealth", "income", "Wealth")
        scatterPlot(Workers, "wealth", "risky_ratio", "Wealth")
        scatterPlot(Workers, "real_income", "savePropensity_arr" , "Wealth")
        scatterPlot(Workers, "real_income", "target_risky_ratio_arr" , "Target Financial Ratio")
        barChart(["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"], Globals.wealthQuantiles,"wealth")

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
        createBankTables(Bank)
        agentGraph(Bank)
        break

        case "firmTable" : 
        clearSVG()
        tradePanelElt.style.display = "none"
        paramElt.style.display = "none" 
        selected_firm = Firms.filter((e) => e.id == firmSelector.value)[0]
        createTables(selected_firm)
        agentTable(selected_firm)
        // printTables(Firms[0].balanceSheet.Assets)
        // printTables(Firms[0].balanceSheet.Liabilities)
        break

        case "firmCharts" :
        tradePanelElt.style.display = "none"
        paramElt.style.display = "none" 
        renderFirm();

        // printTables(Firms[0].balanceSheet.Assets)
        // printTables(Firms[0].balanceSheet.Liabilities)
        break

    }

}

function renderFirm() {
    clearSVG()
    selected_firm = Firms.filter((e) => e.id == firmSelector.value)[0]
    createTables(selected_firm)
    agentGraph(selected_firm)
}