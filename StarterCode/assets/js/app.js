var svgWidth = 1000;
var svgHeight = 550;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#f7f7f7");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
d3.csv("assets/data/data.csv").then(function(csvData) {
    csvData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });


    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(csvData, d => d.poverty)])
      .range([0, width]);
    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(csvData, d => d.healthcare)+2])
      .range([height, 0]);


    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    chartGroup.append("g")
      .call(yAxis);


    var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("fill", "#9DA5F0")
    .attr("opacity", ".6")
    .style("stroke", "black");


    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .selectAll("tspan")
        .data(csvData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare);
            })
            .text(function(data) {
                return data.abbr
            });

            
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lack Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.1}, ${height + margin.top+30})`)
      .attr("class", "aText")
      .text("In Poverty (%)");
  });