/**
 * Created by Yang on 11/11/2016.
 */


function time(data) {

  var svg = d3.select('#radar')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', (height + margin.top + margin.bottom) / 2 * 1.2);
  var cfg = {
    w: width,				//Width of the circle
    h: height,				//Height of the circle
    margin: margin, //The margins of the SVG
    levels: 5,				//How many levels or inner circles should there be drawn
    maxValue: 0, 			//What is the value that the biggest circle will represent
    labelFactor: 1.1, 	//How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
    opacityArea: 0.1, 	//The opacity of the area of the blob
    dotRadius: 4, 			//The size of the colored circles of each blog
    opacityCircles: 0.1, 	//The opacity of the circles of each blob
    strokeWidth: 2 		//The width of the stroke around each blob
  };

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) {
    return i.value;
  }));

  var allAxis = (data.map(function (i, j) {
      return i.key
    })),	//Names of each axis
    total = allAxis.length,					//The number of different axes
    radius = Math.min(cfg.w / 4, cfg.h / 4), 	//Radius of the outermost circle
    angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

  //Append a g element
  var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," +  radius * 1.3 + ")");

  svg.append('text')
    .attr('x', 25)
    .attr('y', 25)
    .style("font-size", "20px")
    .attr('fill', 'Black')
    .text('TIME:');

//            .startAngle(function (d, i) {
//              return i * angle;
//            })
//            .endAngle(function (d, i) {
//              return (i + 1) * angle;
//            });


  var axisGrid = g.append("g").attr("class", "axisWrapper");
  //Draw the background circles
  axisGrid.selectAll(".levels")
    .data(d3.range(1, (cfg.levels + 1)).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function (d, i) {
      return radius / cfg.levels * d;
    })
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles);
  //.style("filter", "url(#glow)");
  //Create the straight lines radiating outward from the center
  var axis = axisGrid.selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis.append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function (d, i) {
      return radius * cfg.labelFactor * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y", function (d, i) {
      return radius * cfg.labelFactor * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .text(function (d) {
      return d
    })
    .call(wrap, cfg.wrapWidth);
  //Append the lines
  axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function (d, i) {
      return radius * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y2", function (d, i) {
      return radius * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  //Text indicating at what % each level is


  //Append the labels at each axis

  //Create a wrapper for the blobs
  g.append("g")
    .attr("id", "radarWrapper");
  var circles = g.append('circle')
    .attr('class','radarCircle');

//            .data([data])
//            .enter().append("g")
  var pie = d3.pie()
    .sort(null)
    .value(function (d) {
      return 1;
    }).padAngle(.02);

  //Wrapper for the grid & axes



  var wrapper = axisGrid.selectAll('.background')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('class', function (d,i) {
        return "radar"+i;
    })
    .attr('d', arc)
    .attr('fill', '#CDCDCD')
    .attr('stroke', null)
    .style("fill-opacity", 0.8)
    .on('mouseover', function (d, i) {
      // console.log(d3.select(this));
      d3.select(this).attr('fill', 'Red');
      notify('', 'Time', i.toString());
      notify(i,"showTimeDot","666");

    })
    .on('mouseout', function (d,i) {
      d3.select(this)
        .attr("fill", "#CDCDCD");
      notify('', 'Time', null);
      notify(i,"hideTimeDot","66666");
    });

  axisGrid.selectAll(".axisLabel")
    .data(d3.range(1, (cfg.levels + 1)).reverse())
    .enter().append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function (d) {
      return -d * radius / cfg.levels;
    })
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "#737373");

  animateRadar(data);
  animateRadar(data);
}

function animateRadar(data) {
  var cfg = {
      w: width,				//Width of the circle
      h: height,				//Height of the circle
      margin: margin, //The margins of the SVG
      levels: 5,				//How many levels or inner circles should there be drawn
      maxValue: 0, 			//What is the value that the biggest circle will represent
      labelFactor: 1.1, 	//How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
      opacityArea: 0.1, 	//The opacity of the area of the blob
      dotRadius: 4, 			//The size of the colored circles of each blog
      opacityCircles: 0.1, 	//The opacity of the circles of each blob
      strokeWidth: 2 		//The width of the stroke around each blob
    },
    total = 24,					//The number of different axes
    radius = Math.min(cfg.w / 4, cfg.h / 4),
    angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
  var maxValue = d3.max(data, function (i) {
    return i.value;
  });

  var rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, maxValue]);

  var axisLabel = d3.selectAll('.axisLabel')
  // .data(d3.range(1, (cfg.levels + 1)).reverse())
    .text(function(d, i) {
      return Math.floor(maxValue * d / cfg.levels);
    });

  var blobWrapper = d3.selectAll("#radarWrapper");
  //The radial line function
  var radarLine = d3.radialLine()
    .curve(d3.curveLinearClosed)
    .radius(function (d) {
      return rScale(d.value);
    })
    .angle(function (d, i) {
      return i * angleSlice;
    });

  var line = blobWrapper.selectAll('.radarLine');

  line.data([data])
    .enter()
    .append('path')
    .attr("class", "radarLine")
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("fill", "none")
    .style('stroke', 'black');


  line.transition()
    .duration(100)
    .attr("d", radarLine);


  var circles = blobWrapper.selectAll('.radarCircle');


  circles.data(data)
    .enter()
    .append('circle')
    .attr("class", "radarCircle")
    .style("fill-opacity", 0.8);

  circles
    .transition()
    .duration(100)
    .attr("r", cfg.dotRadius)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    });


}
