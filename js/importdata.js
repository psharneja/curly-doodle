/*function importData (){
    d3.json("../output_files/age_wise_data.json", function (data){
        var canvas = d3.select(".import-data").append("svg").attr("width", 1000).attr("height", 700);
        
        canvas.selectAll("rect")
        .data(data).enter().append("rect").attr("height", function(d){
            return d._all;
        })
        .attr("width", 50).attr("x", function (d, i){
            return i * 80;
        }).attr("fill", "red");
        
        canvas.selectAll("text").data(data).enter().append("text").attr("fill","#fff").attr("y", function(d, i){
            return i * 80 + 25;
        }).attr("x", 5).text(function(d){
            return d._all + " all: " + d._all;
        })
    })
}*/

function firstGraph(){
    
        
var margin = { top: 20, right: 10, bottom: 100, left: 40},
    width = 1000 - margin.right - margin.left, 
    height = 500 - margin.top - margin.bottom;


var svg = d3.select('#first-graph')
        .append('svg')
        .attr({
            "width" : width + margin.right + margin.left + 100,
            "height" : height + margin.top + margin.bottom
        })
        .append("g")
        .attr("transform", "translate(" + (margin.left+50) + ',' + margin.right + ')');


var xScale = d3.scale.ordinal()
            .rangeRoundBands([0,width], 0.2, 0.2);


var yScale = d3.scale.linear()
            .range([height, 0]);



var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");


var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");
 



d3.json("output_files/age_wise_data.json", function(error, data){
    if(error) console.log("Error: data not loaded");
    console.log(data);
    
    data.sort(function(a,b){
        return b._all - a._all;
    })
    
    xScale.domain(data.map(function(d) { return d._age; }) );
    yScale.domain([0, d3.max(data, function(d){ return d._all; }) ] );
    
    // draw the bars
    svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr("height", 0)
    .attr("y", height)
    .transition().duration(3000)
    .delay(function(d,i){ return i* 200;})
    .attr ({
        'x': function(d){ return xScale(d._age);},
        'y': function(d){ return yScale(d._all);},
        "width": xScale.rangeBand(),
        "height": function(d){ return height - yScale(d._all);}
        
    })
    
    .style("fill", function(d,i) { return 'rgb(59,89,' + (( i * 30) + 90) +')'});
    
    
   
    
    
    //draw  the xAxis
    svg.append("g")
        .attr("class","x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-15")
        .attr("dy", "11")
        .style("text-anchor", "end")
        .style("font-size", "14px");
    
    /* svg.selectAll('rect.text')
        .data(data)
        .enter()
        .append('text')
        .text(function(d) {return d._all;})
        .attr('x', function(d){ return xScale(d._age) + xScale.rangeBand()/2; })
        .attr('y', function(d){ return yScale(d._all) + 22; })
        .style("fill", "white")
        .style("text-anchor", "middle");
    */
    
    svg.append("g")
        .attr("class","y axis")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "10px");
   

   
})
    
}//closing function
//function for second graph
function secondGraph(){
    var margin = { top: 20, right: 10, bottom: 200, left: 40},
    width = 1000 - margin.right - margin.left, 
    height = 700 - margin.top - margin.bottom;


var svg = d3.select('#second-graph')
        .append('svg')
        .attr({
            "width" : width + margin.right + margin.left + 100,
            "height" : height + margin.top + margin.bottom
        })
        .append("g")
        .attr("transform", "translate(" + (margin.left + 50) + ',' + margin.right + ')');


var xScale = d3.scale.ordinal()
            .rangeRoundBands([0,width], 0.2, 0.2);


var yScale = d3.scale.linear()
            .range([height, 0]);



var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");


var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");
 


    d3.json("output_files/graduates_data.json", function(error, data){
    if(error) console.log("Error: data not loaded");
    console.log(data);
    
   ////// data.sort(function(a,b){
        //return b._grad_all - a._grad_all;
    //})
        
    // Transpose the data into layers
    var dataset = d3.layout.stack()([ "_grad_males", "_grad_females"].map(function(genders) {
        return data.map(function(d) {
        return {x: d._state_name, y: +d[genders]};
        });
    }));   
        
        // Set x, y and colors
var x = d3.scale.ordinal()
  .domain(dataset[0].map(function(d) { return d.x; }))
  .rangeRoundBands([10, width-10], 0.02);

var y = d3.scale.linear()
  .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
  .range([height, 0]);

var colors = ["#b33040",  "#f2b447"];

    // Define and draw axes   
    var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(20)
  .tickSize(-width, 0, 0)
  .tickFormat( function(d) { return d } );

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickFormat( function(d) { return d });
        
    svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
    .selectAll("text")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-15")
        .attr("dy", "11")
        .style("text-anchor", "end")
        .style("font-size", "14px");;    
    
          // Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", null);
         tooltip.append("rect")
  .attr("width", 50)
  .attr("height", 20)
  .attr("fill", "white")
.style("z-index", 999)
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 20)
  .attr("dy", "1.4em")
  .style("text-anchor", "middle")
  .attr("font-size", "14px")
  .attr("font-weight", "bold");
    

        
    // Create groups for each series, rects for each segment 
    var groups = svg.selectAll("g.grads")
  .data(dataset)
  .enter().append("g")
  .attr("class", "grads")
  .style("fill", function(d, i) { return colors[i]; });
        
    var rect = groups.selectAll("rect")
  .data(function(d) { return d; })
  .enter()
  .append("rect")
  .attr("x", function(d) { return x(d.x); })
  .attr("y", function(d) { return y(d.y0 + d.y); })
  .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
  .attr("width", x.rangeBand())
  .on("mouseover", function() { tooltip.style("display", null); })
  .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 25;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")"),
    tooltip.select("text").text(d.y);
  });
        
   
        
    // Draw legend
var legend = svg.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(-100," + (i * 19) + ")"; });
 
legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors.slice().reverse()[i];});
 
legend.append("text")
  .attr("x", width + 5)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d, i) { 
    switch (i) {
      case 0: return "Female Graduates";
      case 1: return "Male Graduates";
            
    }
    
    
  

    
  });    
        
        
        
    });//closing of data loading
}//closing function
//function for third graph, donut
function thirdGraph(){
     var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;



var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","b33040", "#d25c4d", "#f2b447"]);
    var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","b33040", "#d25c4d", "#f2b447"];
    var arc = d3.svg.arc()
    .outerRadius(radius - 10 )
    .innerRadius(radius - 100);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d._all; });

var svg = d3.select("#third-graph").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height /2 + ")");

        //getting data loaded
    d3.json("output_files/literate.json",function(error, data) {
  if (error) throw error;
        var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data._all); });
        
/*    g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data._all; });*/
        
   var legend = svg.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(-650," + + (i * 20) + ")"; });
 
legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors.slice()[i];});
 
legend.append("text")
  .attr("x", width + 10)
  .attr("y", 10)
  .attr("dy", ".25em")
  .style("text-anchor", "start")
  .text(function(d, i) { 
    switch (i) {
      case 0: return "Literate w/o Education";
      case 1: return "Below Primary";
      case 2: return "Primary";
        case 3: return "Middle";
        case 4: return "Matric";
        case 5: return "Pre-University";
        case 6: return "Non-Technical Diploma";
        case 7: return "Technical Diploma";
        case 8: return "Graduate & Above";
        case 9: return "Unclassified";
            
    }
})
    });//ending of function data call

}//ending third function

