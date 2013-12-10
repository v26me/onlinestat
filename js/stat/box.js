Box = {
    draw: function(sample1, sample2) {
        this.history(sample1.num, sample2.num);
        this.h = 250;
        this.bw = 30;
        this.p = {top: 10, bottom: 10, right: 10, left: 10}
        this.p.w = this.p.right + this.p.left;
        this.p.h = this.p.bottom + this.p.top;
        this.w = 460 - this.p.w;
        this.chart = this.boxChart().whiskers(this.iqr(1.5))
                              .width(this.bw).height(this.h)
                              .domain([sample1.min, sample1.max]);
        this.computeGroups(sample1, sample2);
        this.addGroup();
        this.addLabels();
        this.showInfo();
    },
    
    history: function(num1, num2) {
        if (!this.shown) this.shown = [];
        this.is_new = false;
        if (!this.shown[num1 + '#' + num2]) {
            this.shown[num1 + '#' + num2] = true;
            this.is_new = true;
        }
    },

    computeGroups: function(sample1, sample2) {
        this.groups = [];
        var val1 = sample1.values, val2 = sample2.values;
        for (var i = 0; i < sample1.len; i++) {
            if (!this.groups[val2[i]]) {
                this.groups[val2[i]] = [];
            }
            this.groups[val2[i]].push(val1[i]);
        }
        for (var i = 0; i < this.groups.length; i++) {
            this.groups[i].sort(function(a,b){return a*1-b*1});
        }
        this.labels = [];
        this.card = sample2.card;
        for (key in sample2.units) {
            this.labels.push(sample2.units[key]);
        }
    },
    
    addLabels: function() {
        var $this = this;
        d3.select("#svg").selectAll("text.name")
                .data(this.labels)
                .enter().append('text')
                .attr('class', 'name')
                .attr("text-anchor", 'middle')
                .attr('x', function(d, i) {return 26 + $this.bw / 2 + i * ($this.bw + 60)})
                .attr('y', this.h + this.p.top)         
                .attr("dy", "1.2em")
                .text(String);
    },
    
    addGroup: function() {
        var $this = this;
        d3.select("#svg").selectAll("g.box")
          .data(this.groups)
          .enter().append("g")
          .attr("transform", function(d,i){return "translate(" + (20 + i * ($this.bw + 60)) + "," + 10 + ")"})
          .attr("class", "box")
          .attr("width", this.bw)
          .attr("height", this.h)
          .call(this.chart);
    },
    
    iqr: function(k) {
        return function(d, i) {
            var q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            i = -1,
            j = d.length;
            while (d[++i] < q1 - iqr);
            while (d[--j] > q3 + iqr);
            return [i, j];
        };
    },
    
    boxChart: function() {
      var width = 1,
          height = 1;
      var duration = (this.is_new)? 1000 : 0;
      var domain = null,
          value = Number,
          whiskers = this.boxWhiskers,
          quartiles = this.boxQuartiles,
          tickFormat = null;
    
      // For each small multiple
      function box(g) {
        g.each(function(d, i) {
          d = d.map(value).sort(d3.ascending);
          var g = d3.select(this),
              n = d.length,
              min = d[0],
              max = d[n - 1];
    
          // Compute quartiles. Must return exactly 3 elements.
          var quartileData = d.quartiles = quartiles(d);
    
          // Compute whiskers. Must return exactly 2 elements, or null.
          var whiskerIndices = whiskers && whiskers.call(this, d, i),
              whiskerData = whiskerIndices && whiskerIndices.map(function(i) { return d[i]; });
    
          // Compute outliers. If no whiskers are specified, all data are "outliers".
          // We compute the outliers as indices, so that we can join across transitions!
          var outlierIndices = whiskerIndices
              ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
              : d3.range(n);
    
          // Compute the new x-scale.
          var x1 = d3.scale.linear()
              .domain(domain && domain.call(this, d, i) || [min, max])
              .range([height, 0]);
    
          // Retrieve the old x-scale, if this is an update.
          var x0 = this.__chart__ || d3.scale.linear()
              .domain([0, Infinity])
              .range(x1.range());
    
          // Stash the new scale.
          this.__chart__ = x1;
    
          // Note: the box, median, and box tick elements are fixed in number,
          // so we only have to handle enter and update. In contrast, the outliers
          // and other elements are variable, so we need to exit them! Variable
          // elements also fade in and out.
    
          // Update center line: the vertical line spanning the whiskers.
          var center = g.selectAll("line.center")
              .data(whiskerData ? [whiskerData] : []);
    
          center.enter().insert("svg:line", "rect")
              .attr("class", "center")
              .attr("x1", width / 2 + 6)
              .attr("y1", function(d) { return x0(d[0]); })
              .attr("x2", width / 2 + 6)
              .attr("y2", function(d) { return x0(d[1]); })
              .style("opacity", 1e-6)
            .transition()
              .duration(duration)
              .style("opacity", 1)
              .attr("y1", function(d) { return x1(d[0]); })
              .attr("y2", function(d) { return x1(d[1]); });
    
          center.transition()
              .duration(duration)
              .style("opacity", 1)
              .attr("y1", function(d) { return x1(d[0]); })
              .attr("y2", function(d) { return x1(d[1]); });
    
          center.exit().transition()
              .duration(duration)
              .style("opacity", 1e-6)
              .attr("y1", function(d) { return x1(d[0]); })
              .attr("y2", function(d) { return x1(d[1]); })
              .remove();
    
          // Update innerquartile box.
          var box = g.selectAll("rect.box")
              .data([quartileData]);
    
          box.enter().append("svg:rect")
              .attr("class", "box")
              .attr("x", 6)
              .attr("y", function(d) { return x0(d[2]); })
              .attr("width", width)
              .attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
            .transition()
              .duration(duration)
              .attr("y", function(d) { return x1(d[2]); })
              .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });
    
          box.transition()
              .duration(duration)
              .attr("y", function(d) { return x1(d[2]); })
              .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });
    
          // Update median line.
          var medianLine = g.selectAll("line.median")
              .data([quartileData[1]]);
    
          medianLine.enter().append("svg:line")
              .attr("class", "median")
              .attr("x1", 6)
              .attr("y1", x0)
              .attr("x2", width + 6)
              .attr("y2", x0)
            .transition()
              .duration(duration)
              .attr("y1", x1)
              .attr("y2", x1);
    
          medianLine.transition()
              .duration(duration)
              .attr("y1", x1)
              .attr("y2", x1);
    
          // Update whiskers.
          var whisker = g.selectAll("line.whisker")
              .data(whiskerData || []);
    
          whisker.enter().insert("svg:line", "circle, text")
              .attr("class", "whisker")
              .attr("x1", 6)
              .attr("y1", x0)
              .attr("x2", width + 6)
              .attr("y2", x0)
              .style("opacity", 1e-6)
            .transition()
              .duration(duration)
              .attr("y1", x1)
              .attr("y2", x1)
              .style("opacity", 1);
    
          whisker.transition()
              .duration(duration)
              .attr("y1", x1)
              .attr("y2", x1)
              .style("opacity", 1);
    
          whisker.exit().transition()
              .duration(duration)
              .attr("y1", x1)
              .attr("y2", x1)
              .style("opacity", 1e-6)
              .remove();
    
          // Update outliers.
          var outlier = g.selectAll("circle.outlier")
              .data(outlierIndices, Number);
    
          outlier.enter().insert("svg:circle", "text")
              .attr("class", "outlier")
              .attr("r", 3)
              .attr("cx", width / 2 + 6)
              .attr("cy", function(i) { return x0(d[i]); })
              .style("opacity", 1e-6)
            .transition()
              .duration(duration)
              .attr("cy", function(i) { return x1(d[i]); })
              .style("opacity", 1);
    
          outlier.transition()
              .duration(duration)
              .attr("cy", function(i) { return x1(d[i]); })
              .style("opacity", 1);
    
          outlier.exit().transition()
              .duration(duration)
              .attr("cy", function(i) { return x1(d[i]); })
              .style("opacity", 1e-6)
              .remove();
    
          // Compute the tick format.
          var format = tickFormat || x1.tickFormat(8);
    
          // Update box ticks.
          var boxTick = g.selectAll("text.box")
              .data(quartileData);
    
          boxTick.enter().append("svg:text")
              .attr("class", "box")
              .attr("dy", ".3em")
              .attr("dx", function(d, i) { return i & 1 ? 12 : -6 })
              .attr("x", function(d, i) { return i & 1 ? width : 0 })
              .attr("y", x0)
              .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
              .text(format)
            .transition()
              .duration(duration)
              .attr("y", x1);
    
          boxTick.transition()
              .duration(duration)
              .text(format)
              .attr("y", x1);
    
          // Update whisker ticks. These are handled separately from the box
          // ticks because they may or may not exist, and we want don't want
          // to join box ticks pre-transition with whisker ticks post-.
          var whiskerTick = g.selectAll("text.whisker")
              .data(whiskerData || []);
    
          whiskerTick.enter().append("svg:text")
              .attr("class", "whisker")
              .attr("dy", ".3em")
              .attr("dx", 12)
              .attr("x", width)
              .attr("y", x0)
              .text(format)
              .style("opacity", 1e-6)
            .transition()
              .duration(duration)
              .attr("y", x1)
              .style("opacity", 1);
    
          whiskerTick.transition()
              .duration(duration)
              .text(format)
              .attr("y", x1)
              .style("opacity", 1);
    
          whiskerTick.exit().transition()
              .duration(duration)
              .attr("y", x1)
              .style("opacity", 1e-6)
              .remove();
        });
        d3.timer.flush();
      }
    
      box.width = function(x) {
        if (!arguments.length) return width;
        width = x;
        return box;
      };
    
      box.height = function(x) {
        if (!arguments.length) return height;
        height = x;
        return box;
      };
    
      box.tickFormat = function(x) {
        if (!arguments.length) return tickFormat;
        tickFormat = x;
        return box;
      };
    
      box.duration = function(x) {
        if (!arguments.length) return duration;
        duration = x;
        return box;
      };
    
      box.domain = function(x) {
        if (!arguments.length) return domain;
        domain = x == null ? x : d3.functor(x);
        return box;
      };
    
      box.value = function(x) {
        if (!arguments.length) return value;
        value = x;
        return box;
      };
    
      box.whiskers = function(x) {
        if (!arguments.length) return whiskers;
        whiskers = x;
        return box;
      };
    
      box.quartiles = function(x) {
        if (!arguments.length) return quartiles;
        quartiles = x;
        return box;
      };
    
      return box;
    },
    
    boxWhiskers: function(d) {
      return [0, d.length - 1];
    },
    
    boxQuartiles: function(d) {
      return [
        d3.quantile(d, .25),
        d3.quantile(d, .5),
        d3.quantile(d, .75)
      ];
    },   
       
    tTest: function() {
        if (this.card == 2) {
            var r = $M.tTest2(this.groups[0], this.groups[1]);
            var r2 = $M.UTest(this.groups[0], this.groups[1]);
              $('.info').html(
                '<div class="table-wrapper"><h3><span ' + getC(r.p) + '>Hypothesis (' + r.p.p(1) + ')</span></h3>'+
                '<p>Means for all groups are equal</p>'+
                '<h4>Student\'s t-test</h4>'+
                '<table class="table table-bordered table-condensed">' +
                '<thead><tr><th>t</th><th>df</th><th>p-value</th></tr></thead><tbody>'+
                '<tr><td>' + r.t.toPrecision(4) + '</td><td>' + r.df + '</td><td>' + d3.round(r.p, 4) + '</td></tr></tbody></table></div>'+
                '<hr /><div class="table-wrapper"><h3><span ' + getC(r2.p) + '>Hypothesis (' + r2.p.p(1) + ')</span></h3>' +
                '<p>Medians for all groups are equal</p>'+
                '<h4>Mann — Whitney U-test</h4><div class="table-wrapper">'+
                '<table class="table table-bordered table-condensed">' +
                '<thead><tr><th>U</th><th>E(U)</th><th>p-value</th></tr></thead><tbody>'+
                '<tr><td>' + r2.u.toPrecision(4) + '</td><td>' + r2.e.toPrecision(4) + '</td><td>' + d3.round(r2.p, 4) + '</td></tr></tbody></table></div>'
                );
        }
        else {
           var r = $M.ANOVA(this.groups);
           $('.info').html(
                '<div class="table-wrapper"><h3><span ' + getC(r.p) + '>Hypothesis (' + r.p.p(1) + ')</span></h3>'+
                '<p>Means for all groups are equal</p>'+
                '<h4>One-way ANOVA</h4>'+
                '<table class="table table-bordered table-condensed">' +
                '<thead><tr><th>SS groups</th><th>df groups</th><th>SS error</th><th>df error</th><th>F</th><th>p-value</th></tr></thead><tbody>'+
                '<tr><td>' + p(r.SSb) + '</td><td>' + r.dfb + '</td><td>' + p(r.SSw) + '</td><td>' + r.dfw + '</td><td>'+r.F.toPrecision(4)+'</td><td>' + d3.round(r.p, 4) + '</td></tr></tbody></table></div>'
                );
        }
    },    
       
    showInfo: function() {
        var q1 = [], q2 = [], q3 = [], mean = [], size = [], std = [];
        len = this.groups.length;
        for (var i = 0; i < len; i++) {
            q1.push($M.quantile(this.groups[i], 0.25));
            q2.push($M.quantile(this.groups[i], 0.5));
            q3.push($M.quantile(this.groups[i], 0.75)); 
            mean.push($M.mean(this.groups[i]));
            size.push(this.groups[i].length);
            std.push($M.std(this.groups[i], mean[i]));
        }
        var content = '<div class="table-wrapper sample-stat"><table class="table table-bordered table-condensed"><thead>'+
                      '<tr><th></th><th>Size</th><th>Mean</th><th>SD</th><th>Q1</th><th>Median</th><th>Q3</th></tr></thead><tbody>'
             
        for (var i = 0; i < len; i++) {        
            content += '<tr><td>'+this.labels[i]+'</td><td>' + size[i] + '</td><td>' + mean[i].toPrecision(4) + '</td><td>' + std[i].toPrecision(4) + '</td><td>'+q1[i]+'</td><td>'+q2[i]+'</td><td>'+q3[i]+'</td></tr>';
        }
        content += '</tbody></table></div>';
        $('.info').html(content);
    
    },    
       
    clear: function() {
        $('#svg g.box').remove();
        $('#svg text.name').remove();
        $('.info').html('');
    }
}