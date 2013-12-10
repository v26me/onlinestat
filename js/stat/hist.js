Hist = {
    draw: function(sample, bins) {
        this.sample = sample;
        this.history(sample.num);
        this.values = sample.sorted;
        
        this.max_bins = sample.max - sample.min;
        if (bins) {
            this.bins = bins;
        }
        else {
            this.bins = Math.ceil(Math.log(sample.len) / Math.LN2 + 1);
        }        
        this.histogram = d3.layout.histogram().bins(this.bins)(this.values);
        var y_values = this.histogram.map(function(d) { return d.y; });
        this.x_values = this.histogram.map(function(d) { return d.x; });
        this.x_values.push(sample.max);
        this.data = y_values;
        this.percent = [];
        for (var i = 0, len_d = this.data.length; i < len_d; i++) {
            this.percent[i] = d3.round(this.data[i] / sample.len * 100, 1);
        }
        
        
        this.h = 250;
        this.p = {top: 10, bottom: 30, right: 10, left: 30}
        this.p.w = this.p.right + this.p.left;
        this.p.h = this.p.bottom + this.p.top;
        //this.w = Math.min(60 * this.bins, 460 - this.p.w);
        this.w = 460 - this.p.w;
        this.x = d3.scale.ordinal().domain(this.histogram.map(function(d) { return d.x; })).rangeRoundBands([0, this.w]);
        this.y = d3.scale.linear().domain([0, d3.max(y_values)]).range([0, this.h]);

        this.addGroup();
        this.addGrid();
        this.drawBars();
        this.addRule();
        this.addLabels();
    },
    
    history: function(num) {
        if (!this.shown) this.shown = [];
        this.is_new = false;
        if (!this.shown[num]) {
            this.shown[num] = true;
            this.is_new = true;
        }
    },
    
    addGroup: function() {
        this.g = d3.select('#svg').append('g')
                    .attr('class', 'hist')
                    .attr("width", this.w + this.p.w)
                    .attr("height", this.h + this.p.h);
    },
    
    addGrid: function() {
        var $this = this;
        
        this.g.selectAll("line")
                .data(this.y.ticks(4))
                .enter().append("line")
                .attr("x1", this.p.left - this.p.right)
                .attr("x2", this.w + this.p.w)
                .attr("y1", function(d) { return $this.h + $this.p.top - $this.y(d); })
                .attr("y2", function(d) { return $this.h + $this.p.top - $this.y(d); })
                .style("stroke-opacity", "1");
    },
    
    drawBars: function() {
        var $this = this;
        
        if (this.is_new) {
            this.g.selectAll("rect")
                .data(this.histogram).enter().append("rect")
                .attr("width", $this.x.rangeBand() - 2)
                .attr("x", function(d, i) { return $this.x.rangeBand() * i + $this.p.left + 1; })
                .attr("y", $this.h + $this.p.top)
                .attr("height", 0)
                .transition()
                .duration(1000)
                .attr("y", function(d) { return $this.h + $this.p.top - $this.y(d.y); })
                .attr("height", function(d) { return $this.y(d.y); });
        }
        else {
            this.g.selectAll("rect")
                .data(this.histogram).enter().append("rect")
                .attr("width", $this.x.rangeBand() - 2)
                .attr("x", function(d, i) { return $this.x.rangeBand() * i + $this.p.left + 1; })
                .attr("y", function(d) { return $this.h + $this.p.top - $this.y(d.y); })
                .attr("height", function(d) { return $this.y(d.y); });
        }
            
        this.g.selectAll("text")
                .data(this.data)
                .enter().append("text")
                .attr("class", "value")
                .attr("x", function(d, i) { return $this.x.rangeBand() * i + $this.p.left + $this.x.rangeBand() / 2; })
                .attr("y", function(d) { return $this.h + $this.p.top - $this.y(d); })
                .attr("dy", "1.2em") 
                .attr("text-anchor", "middle");
                
        this.g.selectAll("text.value")
                .data(($('.percent-button').hasClass('active'))? this.percent : this.data)
                .text(($('.percent-button').hasClass('active'))? function(d) {return d3.round(d, ($this.bins > 12)? 0 : 1) + '%'} : String);
    },
    
    addRule: function() {
        var $this = this;

        this.g.append("line")
                .attr("x1", this.p.left + 1)
                .attr("x2", this.w + this.p.left - 1)
                .attr("y1", this.h + this.p.top)
                .attr("y2", this.h + $this.p.top)
                .style("stroke", "#000");

        this.g.selectAll(".rule")
                .data(this.y.ticks(4))
                .enter().append("text")
                .attr("class", "rule")
                .attr("x", this.p.left - this.p.right - 3)
                .attr("y", function(d) { return $this.h  + $this.p.top - $this.y(d); })
                .attr("dy", "0.4em")
                .attr("text-anchor", "end")
                .text(String);
    },
    
    addLabels: function() {
        var $this = this;
        this.g.selectAll('.name')
                .data(this.x_values)
                .enter().append('text')
                .attr('class', 'name')
                .attr('x', function(d, i) {return $this.x.rangeBand() * i + $this.p.left})
                .attr('y', this.h + this.p.top)         
                .attr("dy", "1.2em")
                .text(function(d){return d3.round(d).toString()});
    },
    
    showInfo: function() {
        var q1 = $M.quantile(this.values, 0.25), q2 = $M.quantile(this.values, 0.5), q3 = $M.quantile(this.values, 0.75), mean = $M.mean(this.values);
        var std = $M.std(this.values, mean); 
        $('.info').html('<div class="table-wrapper sample-stat"><h3>Sample statistics</h3><table class="table table-bordered table-condensed"><thead><tr><th>Mean</th><th>SD</th><th>Q1</th><th>Median</th><th>Q3</th></tr></thead><tbody><tr><td>' + mean.toPrecision(4) + '</td><td>' + std.toPrecision(4) + '</td><td>'+q1+'</td><td>'+q2+'</td><td>'+q3+'</td></tr></tbody></table></div>');
    },
    
    control: function() {        
        $('#slider').show().slider({min: 2, max: Math.min(20, this.max_bins), value: this.bins, slide: $.proxy(this.onChangeBin, this)});        
    },
    
    onChangeBin: function(e, ui) {
        this.g.remove();
        this.draw(this.sample, ui.value);            
    },
    
    clear: function() {
        this.g.remove();
        if (this.gmean) {
            this.gmean.remove();
        }
        $('.percent-button').hide();
        $('#slider').slider( "destroy" );
        $('#slider').hide();
        $('.info').html('');
    },
    
    tTest: function() {
        var mean = $M.mean(this.values);
        var q2 = $M.quantile(this.values, 0.5);
    
        var $this = this;
        var min = d3.min(this.values);
        var max = d3.max(this.values);
        var scale = d3.scale.linear().domain([min, max]).range([0, this.w]);
        var m0 = (min + max) / 2;
        this.m0 = m0;
        this.gmean = d3.select('#svg').append('g').attr("width", this.w + this.p.w).attr("height", this.h + this.p.h);
        this.gmean.selectAll('circle.mean').data([m0]).enter().append('circle').attr('class', 'mean')
                .attr('cx', function(d){return scale(d) + $this.p.left})
                .attr('r', '4')
                .attr('cy', this.h + this.p.top + 24)
                .call(d3.behavior.drag()
                .on("dragstart", function(d) {this.__origin__ = scale(d) + $this.p.left;})
                .on("drag", function(d) {
                        this.__origin__ += d3.event.dx;
                        d = scale.invert(this.__origin__ - $this.p.left);
                        if (d < min || d > max) {                            
                            this.__origin__ -= d3.event.dy;
                        }
                        else {
                            update(d); $this.updateStatistics();
                        }
                        })
                     .on("dragend", function(d) {
                            delete this.__origin__;
                        }));
                        
        var update = function(d) {
            $this.m0 = d; 
            $this.gmean.selectAll('circle.mean').data([d]).attr('cx', function(d){return scale(d) + $this.p.left});
            $this.gmean.selectAll('text.mean').data([d])
            .attr('x', function(d){return scale(d) + $this.p.left + 10;})
            .text(function(d) {return 'μ = ' + d3.round(d, 1);});
        }
                
        this.gmean.selectAll('text.mean').data([m0]).enter().append('text').attr('class', 'mean')
                .attr('x', function(d){return scale(d) + $this.p.left + 10;})
                .attr('y', this.h + this.p.top + 27)
                .text(function(d) {return 'μ = ' + d3.round(d, 1);});                
                
        this.updateStatistics();       
    },
    
     updateStatistics: function() {
        var mean = $M.mean(this.values);
        var q2 = $M.quantile(this.values, 0.5);
     
        var r = $M.tTest(this.values, this.m0);
        var r2 = $M.WTest(this.values, this.m0);
        $('.info').html(
            '<div class="table-wrapper">'+
            '<h3><span ' + getC(r.p) + '>Hypothesis (' + r.p.p(1) + ')</span></h3>'+
            '<p>mean = ' + this.m0.toPrecision(4) + '</p>' +
            '<h4>Student\'s t-test</h4><table class="table table-bordered table-condensed">' +
            '<thead><tr><th>mean</th><th>mean<sub>0</sub></th><th>t</th><th>df</th><th>p-value</th></tr></thead><tbody>'+
            '<tr><td>'+mean.toPrecision(4)+'</td><td id="t-m0">' + this.m0.toPrecision(4) + '</td><td id="t-s">' + r.t.toPrecision(4) + '</td><td>' + r.df + '</td><td id="t-p">' + d3.round(r.p, 4) + '</td></tr></tbody></table></div>'+
            '<hr /><div class="table-wrapper"><h3><span ' + getC(r2.p) + '>Hypothesis (' + r2.p.p(1) + ')</span></h3>'+
            '<p>median = ' + this.m0.toPrecision(4) + '</p>' +
            '<h4>Wilcoxon signed rank test</h4><table class="table table-bordered table-condensed">'+
            '<thead><tr><th>median</th><th>median<sub>0</sub></th><th>W</th><th>E(W)</th><th>p-value</th></tr></thead><tbody>'+
            '<tr><td>'+q2+'</td><td id="w-m0">' + this.m0.toPrecision(4) + '</td><td id="w-w">' + r2.w.toPrecision(4) + '</td><td id="w-e">' + r2.e.toPrecision(4) + '</td><td id="w-p">' + d3.round(r2.p, 4) + '</td></tr></tbody></table></div>'
            );
        /*$('#t-m0').html(this.m0.toPrecision(4));
        $('#t-s').html(r.t.toPrecision(4));
        $('#t-p').html(d3.round(r.p, 4));
        $('#w-m0').html(this.m0.toPrecision(4));
        $('#w-w').html(r2.w.toPrecision(4));
        $('#w-e').html(r2.e.toPrecision(4));
        $('#w-p').html(d3.round(r2.p, 4));*/
    }   
}