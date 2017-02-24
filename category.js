/**
 * Created by Yang on 11/11/2016.
 */

function category(data) {
  var svg = d3.select('#bar')
    .append('svg')
    .attr('width', width + margin.right)
    .attr('height', height / 2);

  var tooltip_bar = d3.select("#bar")
    .append("div")
    .attr("class", "tooltip_bar")
    .style("opacity", 0);

  var g = svg.append('g')
    .attr('id', 'category');

  g.append("g")
    .attr('class', 'yaxis');

  //    g.append('text')
//            .attr('class', 'tx')
//            .attr('text-anchor', 'middle')
//            .attr('dy', '.35em')
//            .attr('transform', function(d){
//              return 'translate(' + (x(d.Category)+ x.rangeBand() / 2) + ',' + (height - 20) + ')';
//            })
//            .style('fill', 'White')
//            .style('font-size', '10px')
//            .text(function (d) {
//              return d.Fruit;
//            });

  var legend = svg.selectAll(".legend")
    .data(data)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + (i % 10) * 15 + ")"; });

  legend.append("rect")
    .attr("x", function (d, i) {
      return width - Math.floor(i / 10) * 110 + 1;
    })
    .attr("width", 9)
    .attr("height", 9)
    .style("fill", function(d) {
      return color(d.key)
    });

  legend.append("text")
    .attr("x", function (d, i) {
      return width - Math.floor(i / 10) * 110;
    })
    .attr("y", 9)
  //  .attr("dy", ".36em")
    .style("text-anchor", "end")
    .style("font-size", "7px")
    .text(function(d) { return d.key; });

  animateBar(data);
  animateBar(data);
}

function animateBar(data) {
  var x = d3.scaleBand().rangeRound([0, width], .1);
  var y = d3.scaleLinear().rangeRound([height / 2, 0]);

  x.domain(data.map(function (d) {
    return d.key
  }));
  y.domain([0, d3.max(data, function (d) {
    return d.value;
  })]);

  var g = d3.select('#category')
    .attr("transform", "translate(" + margin.left + "," +  0+ ")");
  var bar = g.selectAll('.category')
    .data(data);
  var tooltip_bar = d3.select('.tooltip_bar');
  bar.enter()
    .append('rect')
    .attr('class', function (d) {
      return "bar" + d.key.replace(/\s/g, "").replace(/\//g, "")
          .replace(/\-/g, "").replace(/\,/g, "")+" "+"category";
    })
    .attr("fill", function (d) {
      return color(d.key)
    })
    .attr('width', x.bandwidth() - 1);
  bar.on('mouseover', function (d) {
    d3.select(this)
      .attr("fill", "red");
    tooltip_bar.transition()
      .duration(200)
      .style("opacity", .9);

    tooltip_bar.html("Category: " + d.key)
      .style("left", (d3.mouse(this)[0] - 20) + "px")
      .style("top", (d3.mouse(this)[1] - 20) + "px");

    notify("bar" + d.key.replace(/\s/g, "").replace(/\//g, "")
        .replace(/\-/g, "").replace(/\,/g, ""), "showDot", "555555");
    notify('.' + 'time', 'Category', d.key);
  })
    .on('mouseout', function (d) {
      d3.select(this)
        .attr("fill", "black");
      var bar = d;
      d3.select(this)
        .attr("fill", function (d) {
          return color(bar.key)
        });

      tooltip_bar.transition()
        .duration(500)
        .style("opacity", 0);

      notify("bar" + d.key.replace(/\s/g, "").replace(/\//g, "")
          .replace(/\-/g, "").replace(/\,/g, ""), "hideDot", d.key);
      notify('.' + 'time', 'Category', null);
    })
    .transition()
    .duration(100)
    .attr('x', function (d) {
      return x(d.key);
    })
    .attr('y', function (d) {
      return y(d.value);
    })
    .attr('height', function (d) {

      return height / 2 - y(d.value);
    });

  bar.exit()
    .transition()
    .duration(100)
    .attr('width', 0)
    .remove();

  d3.selectAll('.yaxis')
    .call(d3.axisLeft(y));
}

