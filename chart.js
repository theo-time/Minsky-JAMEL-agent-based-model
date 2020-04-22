margin= {"top": 10, "bottom": 10,"left": 10, "right":10}
    width = 1000 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;


function chartMaker() {
//canvas.style.display='none'

div = d3.select("#viz")
	.append('div')

BoxesContainer = div
	  .append('div')
	  .attr("id","Boxes")
	  
boxes  = BoxesContainer
    .selectAll('rect')
	  .data(Pop.Agents)
	    .enter()
	    .append("div")
	    	.append("p")
	    	.text(d=>(d.type + d.id))
        
}

function equilibriumViz(parent, label1, label2, value1, value2, width, height) {
  var data1 = {
    label:label1,
    value:value1,
  }
  var data2 = {
    label:label2,
    value:value2,
  }
  var data = [data1,data2]

  var bornes = Min_Max(data, "value");
  bornes[1] += 10

  var nScale = d3.scaleLinear()
    .domain([0,3]) // initial range
    .range([0, width]);  // new range

  // Creating Scales
  var yScale = d3.scaleLinear()
    .domain(bornes) // initial range
    .range([0,height]);  // new range


// step 2 : Creating Axis ----
var x_axis = d3.axisBottom()
  .scale(nScale)

var y_axis = d3.axisLeft()
  .scale(yScale)


  var svg = d3.select('#equilibrium')

  var bars = svg.append('g')
                  .selectAll('rect')
                  .data(data)
                    .enter()
                    .append('rect')
                      .attr("x",function(d,i) {return nScale((i*5 + 2))})
                      .attr("y", 0)
                      .attr("width","5")
                      .attr("height",function(d) {return yScale(d.value)})
                      .attr("fill", "green")

}


function timeSerie(arr, prop, r, width, height, parentID, nbr_ticks) {
//clearSVG()

margin = {top:"30", left: '30', right:'30', bottom:'30'}

d3.select("#labelY").remove()


var box = d3.select(parentID)
            .append('div')

box.append('p')
   .text(prop)

svg = box.append('svg')
        .attr('width', width)
        .attr("height", height)
        .style("border", "1px black solid")
        .style("top", "0px")

// new Width and Height to integrate margins
height = height - margin.bottom*2
width = width - margin.left*2
// Nmber of datapoints
var n = arr.length;
//if(n>30) {r = 0}

// Calculating bornes
var bornes = Min_Max(arr, prop);

// step 1 : Scaling ----
var xScale = d3.scaleTime()
  .domain(d3.extent(arr, function(d) { 
    return new Date(d.Date); 
  }))
  .range([60, width]);


var yScale = d3.scaleLinear()
  .domain(bornes) // initial range
  .range([height+20, 20]);  // new range

var nScale = d3.scaleLinear()
  .domain([0,n-1]) // initial range
  .range([60, width]);  // new range


// step 2 : Creating Axis ----
var x_axis = d3.axisBottom()
  .scale(xScale)


var y_axis = d3.axisLeft()
  .scale(yScale)
  .ticks(5)

svg.append("g")
  .attr("transform","translate(0," + (height + 20) + ")")
  .call(x_axis);

svg.append("g")
  .attr("transform","translate(60,0)")
  .call(y_axis);


// step 3 : Line Generator ----
var line = d3.line()
    .x(function(d,i) { return nScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d[prop]); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line


svg.append('g')
    .append("path")
    .attr("id","path")
    .datum(arr) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line) // 11. Calls the line generator 
    .attr('fill', 'rgba(250,250,250,0)')
    .attr('stroke', "green")
    .attr('stroke-width', "3")



// Step 4 : Circles ------
circleCreator(arr, r)

circles
  .attr("cx", function(d, i) { return nScale(i) })
  .attr("cy", function(d) { return yScale(d[prop]) })

circles
  .attr("fill", 'green')

circles.attr('stroke',"white")
  .attr('stroke-width',"2")

// Step 5 : Creating Infos -----
Tooltip2 = svg
      .append('text')
      .attr("id","tooltip2")
      .text("default")

// Step 6 : Labelling Axis -----
var labelY = d3.select("#viz")
        .append('input')
        .attr("id", "labelY")
        .attr('type',"text")
        .attr('value', "time")
        .style("position","relative")
        //.style("top","-530px")
        .style("font-style","italic")
        .style("font-size", "20")
        .style("background","rgba(0,0,0,0)")
        .style("border-width","0px")
        .style("width", "500px")
  

var labelX = svg.append('text')
    .text("Date")
    .attr('x', width + 3)
    .attr('y', height + 25)
    .style("font-style","italic")

}

function lineChart(arr, prop, r, width, height, parentID) {
//clearSVG()

margin = {top:"30", left: '30', right:'30', bottom:'30'}

d3.select("#labelY").remove()


var box = d3.select(parentID)
            .append('div')

box.append('p')
   .text(prop)

svg = box.append('svg')
        .attr('width', width)
        .attr("height", height)
        .style("border", "1px black solid")
        .style("top", "0px")

// new Width and Height to integrate margins
height = height - margin.bottom*2
width = width - margin.left*2
// Nmber of datapoints
var n = arr.length;
//if(n>30) {r = 0}

// Calculating bornes
var bornes = Min_Max(arr, prop);

// step 1 : Scaling ----
var xScale = d3.scaleTime()
  .domain(d3.extent(arr, function(d) { 
    return new Date(d.Date); 
  }))
  .range([60, width]);


var yScale = d3.scaleLinear()
  .domain(bornes) // initial range
  .range([height+20, 20]);  // new range

var nScale = d3.scaleLinear()
  .domain([0,n-1]) // initial range
  .range([60, width]);  // new range


// step 2 : Creating Axis ----
var x_axis = d3.axisBottom()
  .scale(xScale)

var y_axis = d3.axisLeft()
  .scale(yScale)

svg.append("g")
  .attr("transform","translate(0," + (height + 20) + ")")
  .call(x_axis);

svg.append("g")
  .attr("transform","translate(60,0)")
  .call(y_axis);


// step 3 : Line Generator ----
var line = d3.line()
    .x(function(d,i) { return nScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d[prop]); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line


svg.append('g')
    .append("path")
    .attr("id","path")
    .datum(arr) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line) // 11. Calls the line generator 
    .attr('fill', 'rgba(250,250,250,0)')
    .attr('stroke', "green")
    .attr('stroke-width', "3")



// Step 4 : Circles ------
circleCreator(arr, r)

circles
  .attr("cx", function(d, i) { return nScale(i) })
  .attr("cy", function(d) { return yScale(d[prop]) })

circles
  .attr("fill", 'green')

circles.attr('stroke',"white")
  .attr('stroke-width',"2")

// Step 5 : Creating Infos -----
Tooltip2 = svg
      .append('text')
      .attr("id","tooltip2")
      .text("default")

// Step 6 : Labelling Axis -----
var labelY = d3.select("#viz")
        .append('input')
        .attr("id", "labelY")
        .attr('type',"text")
        .attr('value', "time")
        .style("position","relative")
        //.style("top","-530px")
        .style("font-style","italic")
        .style("font-size", "20")
        .style("background","rgba(0,0,0,0)")
        .style("border-width","0px")
        .style("width", "500px")
  

var labelX = svg.append('text')
    .text("Date")
    .attr('x', width + 3)
    .attr('y', height + 25)
    .style("font-style","italic")

}

function circleCreator(arr, r) {
circles = svg
  .append('g')
  .attr("id","circles")
  .selectAll('circles')
  .data(arr)
    .enter()
    .append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("r", r)
      .on("mouseover", function(d) { 
          var elm = d3.select(this);
          elm.attr('class', 'focus');
          displayInfos(d, xScale, yScale);
          tooltip.text(d.Date); 
          return tooltip.style("visibility", "visible");
      })
      .on("mouseout", function() {
        var elm = d3.select(this);
        elm.attr('class', 'normal');  
        Tooltip2.style('visibility', 'hidden')
      })
}

function invert(arr) {
  var new_arr = [];
  for(i=0; i<arr.length + 1; i++) {
    new_arr[arr.length- 1 -i] = arr[i]
  }
  return new_arr
}

function Min_Max(obj, prop) {
  Arr = [];
  obj.map(function(d) {Arr.push(d[prop])})
  var min = d3.min(Arr)
  var max = d3.max(Arr)
  return [min,max]
}

function numberize(arr, prop) {
  arr.map( function(d) {d[prop] = +d[prop]})
}

function indexize(arr) {
  for(i=0; i<arr.length; i++) {
    arr[i].id =i
  }
}

function convertRatio(arr) {
  outputArr = arr
  outputArr.splice(1,1)
  for(u=0; u<arr.length -1; u++) {
    outputArr[u+1].Value = (arr[u+1].Value - arr[u].Value)/arr[u].Value
  }
  return outputArr
}

function jsonBinder(arr1, arr2, arr3) {
    output = arr1
    for(a=0; a < arr1.length; a++) {
      output[a]['xValue'] = arr1[a].Value
      output[a]['yValue'] = arr2[a].Value
      output[a]['zValue'] = arr3[a].Value
    }
    //console.log("binded Array", output)
    return output
}

function nexted(arr) {
  for(l = 0; l < arr.length - 1; l++) {
    arr[l].nextX = arr[l+1].xValue
    arr[l].nextY = arr[l+1].yValue
    arr[l].nextZ = arr[l+1].zValue
  }
  return arr 
}



function displayInfos(d, xScale, yScale) {
  if(mode == "chain") {
  Tooltip2
    .attr("x", xScale(d.xValue) + 10)
    .attr("y", yScale(d.yValue) - 10)
    .text(d.Date)
    .style('visibility', 'visible')
  }
  if(mode == "time") {
  Tooltip2
    .attr("x", xScale(d.id) + 10)
    .attr("y", yScale(d.yValue) - 10)
    .text(d.Date)
    .style('visibility', 'visible')
  }
}


function animatedGraph() {
    Binded = nexted(Binded);
    var circle = svg.append("circle")
      .attr("r", 13)
    path = d3.select("#path")
    transition(circle);
  }

  function transition(circle) {
    circle.transition()
        .duration(20000)
        .attrTween("transform", translateAlong(path.node()))
        .each("end", transition);
  }

  function translateAlong(path) {
    var l = path.getTotalLength();
    return function(d, i, a) {
      return function(t) {
        var p = path.getPointAtLength(t * l);
        return "translate(" + p.x + "," + p.y + ")";
      };
    };
  }


function buildArray(arr, name) {
  output = [];
  arr.map(function(d,i){
    output[i]= new data(d,i)
  })
  return output;

function data(d,i) {
  this.time = i;
  this[name] = d;
}

}

