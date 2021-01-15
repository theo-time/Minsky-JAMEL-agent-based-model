
function histogram(arr, prop){
  	
	var histogramElt = document.createElement("div")

	var values = [];
	for (var i = 0; i < arr.length; i ++) {
		values[i] = arr[i][prop][t]
	}

	var trace = {
		x: values,
		type: 'histogram',
	};

	var data = [trace];

	Plotly.react(histogramElt, data)
  	VizElt.appendChild(histogramElt)
}