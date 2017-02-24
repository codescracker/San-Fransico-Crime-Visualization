/**
 * Created by Yang on 11/11/2016.
 */
function drawMap(data) {
  var x = d3.scaleLinear()
    .range([0, width])
    .domain([d3.min(data, function (d) {
      return d.X;
    }), d3.max(data, function (d) {
      return d.X;
    })]);


  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([d3.min(data, function (d) {
      return d.Y;
    }), d3.max(data, function (d) {
      return d.Y;
    })]);


  var reverse_x = d3.scaleLinear()
      .range([d3.min(data, function (d) {
        return d.X;
      }), d3.max(data, function (d) {
        return d.X;
      })])
      .domain([0, width]);

  var reverse_y = d3.scaleLinear()
      .range([d3.min(data, function (d) {
        return d.Y;
      }), d3.max(data, function (d) {
        return d.Y;
      })])
      .domain([height, 0]);

  // console.log("left boundry: "+reverse_x(-margin.left));
  // console.log("right boundry: "+reverse_x(width+margin.right));
  // console.log("top boundry: "+reverse_y(-margin.top));
  // console.log("bonttom boundry: "+reverse_y(height+margin.bottom));
  //
  //

  var svg = d3.select("#map").append("svg")
    .attr("width", width+margin.left+margin.right )
    .attr("height", height+margin.top+margin.bottom)
    .append("g")
    .attr("class", "SF_Map")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var tooltip_SG = d3.select("#map").append("div")
    .attr("class", "tooltip_SG")
    .style("opacity", 0);


  // draw dots
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", function (d) {
      return "dot" + d.Category.replace(/\s/g, "").replace(/\//g, "")
          .replace(/\-/g, "").replace(/\,/g, "")+" "+"dot"+d.int_time;
    })
    .attr("r", 1.2)
    .attr("cx", function (d) {
      return x(d.X)
    })
    .attr("cy", function (d) {
      return y(d.Y)
    })
    .style("fill", function (d) {
      return color(d.Category)
    })
    .on("mouseover", function (d) {
      d3.select(this)
        .style("fill", "red")
        .attr("r", 4);

      tooltip_SG.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip_SG.html("Category: " + d.Category + "<br/> " + "Time period: " + d.int_time)
        .style("left", (x(d.X) + 65) + "px")
        .style("top", (y(d.Y) - 45) + "px");

      tooltip_SG.append("div")
        .attr("class", "tip_color")
        .style("background-color", color(d.Category));

      notify("dot" + d.Category.replace(/\s/g, "").replace(/\//g, "")
          .replace(/\-/g, "").replace(/\,/g, ""), "showBar", "haha");

      notify(d.int_time,"showRadar","ooo");

    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("fill", color(d.Category))
        .attr("r", 1.5);

      tooltip_SG.transition()
        .duration(500)
        .style("opacity", 0);

      d3.select(".tip_color").remove();

      notify("dot" + d.Category.replace(/\s/g, "").replace(/\//g, "")
          .replace(/\-/g, "").replace(/\,/g, ""), "hideBar", d.Category);

      notify(d.int_time,"hideRadar",d.int_time);

    });
}
