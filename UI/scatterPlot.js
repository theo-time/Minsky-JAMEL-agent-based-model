function minskyPlot(arr, prop1, prop2, title) {
  var scatter = document.createElement("div")
  var hedgeX = [];
  var hedgeY = [];
  var hedgeLabel = [];
  var specuX = [];
  var specuY = [];
  var specuLabel = [];
  var ponziX = [];
  var ponziY = [];
  var ponziLabel = [];

  for(var i = 0; i < arr.length; i++) {
    if(arr[i].minsky_type == "hedge"){
        hedgeX.push(arr[i][prop1][t])
        hedgeY.push(arr[i][prop2][t])
        hedgeLabel.push(arr[i].id)
    }
    if(arr[i].minsky_type == "speculative"){
        specuX.push(arr[i][prop1][t])
        specuY.push(arr[i][prop2][t])
        specuLabel.push(arr[i].id)
    }
    if(arr[i].minsky_type == "ponzi"){
        ponziX.push(arr[i][prop1][t])
        ponziY.push(arr[i][prop2][t])
        ponziLabel.push(arr[i].id)
    }
  }
  console.log(hedgeLabel)

  var trace1 = {
    x: hedgeX,
    y: hedgeY,
    mode: 'markers+text',
    type: 'scatter',
    name: 'Hedge',
    marker: { size: 12 },
    text:hedgeLabel,
    textfont : {
      family:'Times New Roman'
    },
    textposition: 'bottom center',
  };

  var trace2 = {
    x: specuX,
    y: specuY,
    mode: 'markers+text',
    type: 'scatter',
    name: 'Speculative',
    marker: {
      color: 'rgb(255, 231, 50)',
      size: 12,
    },
    text:specuLabel,
    textfont : {
      family:'Times New Roman'
    },
    textposition: 'bottom center',
  };

  var trace3 = {
    x: ponziX,
    y: ponziY,
    mode: 'markers+text',
    type: 'scatter',
    name: 'Ponzi',
    marker: { 
      size: 12,
      color: 'rgb(255, 142, 50)',
    },
    text:ponziLabel,
    textfont : {
      family:'Times New Roman'
    },
    textposition: 'bottom center',
  };


  var data = [trace1, trace2, trace3];

  var layout = {
    title: title,
    xaxis: {
      title: {
        text: prop1,
      },
    },
    yaxis: {
      title: {
        text: prop2,
      }
    }
  };


  Plotly.react(scatter, data, layout)
  VizElt.appendChild(scatter)

}

function scatterPlot(arr, prop1, prop2, title) {
  var scatter = document.createElement("div")
  var x = [];
  var y = [];
  var label = []

  for(var i = 0; i < arr.length; i++) {
    x[i] = arr[i][prop1][t];
    y[i] = arr[i][prop2][t];
    label[i] = arr[i].id
  }

  var trace1 = {
    x: x,
    y: y,
    mode: 'markers',
    type: 'scatter',
    name: 'Households',
    text: label,
    marker: { size: 12 }
  };

  var data = [trace1];

  var layout = {
    title:title,
    xaxis: {
      title: {
        text: prop1,
      },
    },
    yaxis: {
      title: {
        text: prop2,
      }
    }
  };


  Plotly.react(scatter, data, layout)
  VizElt.appendChild(scatter)

}


function barChart(labels, values, title) {
  var barchart = document.createElement("div")


  var trace1 = {
    x: labels,
    y: values,
    type: 'bar',
  };

  var data = [trace1];

  var layout = {
    title:title,
  };


  Plotly.react(barchart, data, layout)
  VizElt.appendChild(barchart)

}