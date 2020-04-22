

/*

function moneyData (total, arr) {
  this.name = "total"
  this.value = total

  for(var i=0; i < arr.length; i++) {
    this.children =
  }

}

var dataset = [];

d3.csv("M1.csv").then(function(dat) {
  M1 = dat;
  d3.csv("M2.csv").then(function(dat) {
    M2 = dat;
    d3.csv("M3.csv").then(function(dat) {
      M3 = dat;
      d3.csv("M4.csv").then(function(dat) {
        M4 = dat;
        pack_data();
        update(0) ;
       });
    });
  });
});

function pack_data() {
  for(i=0; i < M1.length; i++) {
      dataset[i] = new Agrr("M4", M4[i].Value, 
                      new Agrr("M3", M3[i].Value, 
                          new Agrr("M2", M2[i].Value, 
                            new Agrr("M1", M1[i].Value, null
                            ) 
                          )
                        )
                      )
  }
}

function Agrr (name,value,children) {
  this.name = name;
  this.value = value;
  this.children = [children];
  if(children==null) {delete this.children}
}

/*function update() {
for(i=0; i < M1.length; i++) {
    draw(i);
    setTimeout(go, 2000)
}
}
*/

var p = 0
function update() {
  console.log(p);
  console.log(M1[p].Date)
    draw(p);
    p=p+1;
    if (p < 10) {
      console.log("rupdate");
      p=p+1;
      window.setInterval("update()", 200);
    }
}

// var data = {
//     "name": "Total",
//     "value": moneySupply,
//     "date":"2018-06-30",
//     "children": [
//       {
//         "name": "M3",
//         "value":6009808477.0,
//         "children": [
//           {
//             "name": "M2",
//             "value": 2556074458.0,
//             "children": [
//               {
//                 "name": "M1",
//                 "value":334400842.0,
//               }
//             ]
//           }
//         ]
//       },
//     ]
//   }



function moneyData (arr, prop, total) {
  this.name = "total"
  if(total){this.value = total}
  else {
    this.value = sumProp(arr, prop)
  }
  this.children = []
  this.clor = [253,150,34]

  for(var i=0; i < arr.length; i++) {
    this.children[i] = {}
    this.children[i].name =  arr[i].id
    this.children[i].clor = arr[i].clor
    this.children[i].value = arr[i][prop]
  }
}



function treemap(Group, prop, width, height, parentId) {
  //data = dataset[p];

  document.getElementById(parentId).innerHTML = ""

  var hierarchy = new moneyData(Group, prop)

  var root = d3.hierarchy(hierarchy);

  //console.log(root.descendants())

  var treemapLayout = d3.treemap()
        .size([width, height])
        .paddingOuter(2);

  //root.sum(function(d) {return d.value})

  treemapLayout(root)

  var svg = d3.select("#" + parentId)
    .append("svg")
    .attr('width',width)
    .attr('height', height)

  svg.append("g")

  // rects
  var nodes = d3.select("#" + parentId + " svg g")
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'})


  nodes
    .append("rect")
    .attr("width", function(d) {return d.x1 - d.x0;})
    .attr("height", function(d) {return d.y1 - d.y0;})
    .attr("stroke", "rgba(250,250,250)")
    .attr("fill", function(d) {
      return ('rgba(' + d.data.clor[0] + "," + d.data.clor[1] + "," + d.data.clor[2] + ",0.8)") 
    })



  // Nodes
  nodes
    .append("text")
    .attr('dx', 4)
    .attr('dy', 50)
    .text(function(d) {
      return Math.floor(d.data.value)
    })

/*var rectangles = d3.selectAll("rect").transition()
    .duration(10000)
    .attr("fill","blue");
*/
  return svg
}
