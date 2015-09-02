angular.module('myApp').directive('graphDirective',
  function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, element) {
        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
          },
          width = 480 - margin.left - margin.right,
          height = 360 - margin.top - margin.bottom;
        var svg = d3.select(element[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10);

        //Render graph based on 'data'
        scope.render = function(data) {
          //Set our scale's domains
          x.domain(data.map(function(d) {
            return d.dayOfWeek;
          }));
          y.domain([d3.min(data, function(d) {
            return d.minTemp;
          }) - 5, d3.max(data, function(d) {
            return d.maxTemp;
          }) + 5]);

          //Redraw the axes
          svg.selectAll('g.axis').remove();
          //X axis
          svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          //Y axis
          svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Temperature (F)");

          var maxTempFunc = d3.svg.line()
            .x(function(d) {
              return x(d.dayOfWeek) + x.rangeBand() / 2;
            })
            .y(function(d) {
              return y(d.maxTemp);
            })
            .interpolate('cardinal');

          var minTempFunc = d3.svg.line()
            .x(function(d) {
              return x(d.dayOfWeek) + x.rangeBand() / 2;
            })
            .y(function(d) {
              return y(d.minTemp);
            })
            .interpolate('cardinal');

          svg.append('svg:path')
            .attr('d', maxTempFunc(data))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr("data-legend", 'High');

          svg.append('svg:path')
            .attr('d', minTempFunc(data))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr("data-legend", 'High');

          svg.append("text")
            .attr("transform", function(d) {
              return "translate(" + (x(data[data.length - 1].dayOfWeek) + x.rangeBand() / 2) + "," + y(data[data.length - 1].maxTemp) + ")";
            })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) {
              return "High";
            });

          svg.append("text")
            .attr("transform", function(d) {
              return "translate(" + (x(data[data.length - 1].dayOfWeek) + x.rangeBand() / 2) + "," + y(data[data.length - 1].minTemp) + ")";
            })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) {
              return "Low";
            });

        };

        //Watch 'data' and run scope.render(newVal) whenever it changes
        //Use true for 'objectEquality' property so comparisons are done on equality and not reference
        scope.$watch('data', function() {
          scope.render(scope.data);
        }, true);
      }
    };
  }
);
