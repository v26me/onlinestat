Bar = {
    draw: function(sample) {
        this.history(sample.num);
        this.prepareData(sample);
        this.w = Math.min(60 * this.data.length, 460);
        this.range = this.w / this.data.length;
        this.h = 250;
        this.p = {top: 10, bottom: 20, right: 10, left: 30}
        this.p.w = this.p.right + this.p.left;
        this.p.h = this.p.bottom + this.p.top;
        this.y = d3.scale.linear().domain([0, d3.sum(this.data)]).range([0, this.h]);
        this.addGroup();
        this.addGrid();
        this.drawBars();
        this.addRule();
        this.addLabels();
        
        this.is_distr = false;     
    },
    
    history: function(num) {
        if (!this.shown) this.shown = [];
        this.is_new = false;
        if (!this.shown[num]) {
            this.shown[num] = true;
            this.is_new = true;
        }
    },
    
    prepareData: function(sample) {
        this.data = [];
        for (var i = 0; i < sample.card; i++) {
            this.data[i] = 0;
        }
        var values = sample.values;
        for (var i=0; i < sample.len; i++) {
            this.data[values[i]]++;
        }

        this.percent = [];

        for (var i = 0, len = this.data.length; i < len; i++) {
            this.percent[i] = this.data[i] / sample.len;
        }
        this.labels = [];
        for (key in sample.units) {
            this.labels.push(sample.units[key]);
        }
    },
    
    addGroup: function() {
        this.g = d3.select('#svg').append('g').attr('class', 'bar').attr('width', this.w + this.p.w).attr('height', this.h + this.p.h);
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

        this.g.selectAll("rect")
                .data(this.data)
                .enter().append("rect")
                .attr("x", function(d, i) {return $this.range * i + $this.p.left + 1;})
                .attr("width", this.range - 2);
                
        if (this.is_new) {
            this.g.selectAll("rect").attr("y", $this.h + $this.p.top)
                                    .attr("height", 0)
                                    .transition()
                                    .duration(1000)
                                    .attr("y", function(d) { return $this.h + $this.p.top - $this.y(d); })
                                    .attr("height", function(d) { return $this.y(d); });
        }
        else {
            this.g.selectAll("rect").attr("y", function(d) { return $this.h + $this.p.top - $this.y(d); })
                                    .attr("height", function(d) { return $this.y(d); });
        }
                
        this.g.selectAll("text")
                .data(this.data)
                .enter().append("text")
                .attr("class", "value")
                .attr("x", function(d, i) { return $this.range * i + $this.p.left + $this.range / 2; })
                .attr("y", function(d) { return $this.h + $this.p.top - $this.y(d); })
                .attr("dy", "1.2em") 
                .attr("text-anchor", "middle");
                
        this.g.selectAll("text.value")
                .data(($('.percent-button').hasClass('active'))? this.percent : this.data)
                .text(($('.percent-button').hasClass('active'))? function(d) {return d3.round(d * 100, 1) + '%'} : String);

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
                .data(this.labels)
                .enter().append('text')
                .attr('class', 'name')
                .attr('x', function(d, i) {return $this.range * i + $this.p.left + $this.range / 2})
                .attr('y', this.h + this.p.top)         
                .attr("dy", "1.2em")
                .text(String);
    },
    
    control: function() {
        var $this = this;
        $('.percent-button').show();       
        $('.percent-button').click(function(){
            $this.g.selectAll("text.value")
                   .data(($(this).hasClass('active'))? $this.data : $this.percent)
                   .text(($(this).hasClass('active'))? String : function(d) {return d3.round(d * 100, 1) + '%'});
        });
    },
    
    drawDistribution: function() {
        var len = this.data.length, va = 1 / len;
        this.distr = [];
        for (var i=0; i< len; i++) {
           this.distr.push(va);
        }

        this.computeStatistics();
        var circle_data = this.distr.slice(0);
        circle_data.pop();    
        
        var $this = this;

        this.distry = d3.scale.linear().domain([0, 1]).range([0, this.h]);

        this.d_group = d3.select('svg#svg').append('g').attr("class", "dist");   

        this.d_group.selectAll("rect.dist")
                .data(this.distr)
                .enter().append("rect")
                .attr("x", function(d, i) { return i * $this.range + $this.p.left + 1; })
                .attr("y", function(d) { return $this.h + $this.p.top - $this.distry(d); })
                .attr("width", this.range - 2)
                .attr("height", function(d) { return $this.distry(d); });

        this.d_group.selectAll("text.d-value")
                .data(this.distr)
                .enter().append("text")
                .attr("class", "d-value")
                .attr("x", function(d, i) { return (i + 0.5) * $this.range + $this.p.left + 1; })
                .attr("y", function(d) { return $this.h + $this.p.top - 20; })
                .attr("dy", "1.2em") 
                .attr("text-anchor", "middle");
                
        this.d_group.selectAll("text.d-value")
                .data(this.distr)
                .text(function(d) {return d3.round(d * 100, 1) + '%'});
                

        this.d_group.selectAll("circle")
                 .data(circle_data)
                 .enter().append("circle")
                 .attr("r", 3)
                 .call(d3.behavior.drag()
                     .on("dragstart", function(d) {
                            this.__origin__ = $this.h + $this.p.top - $this.distry(d);
                        })
                     .on("drag", function(d, i) {
                            this.__origin__ += d3.event.dy;
                            d = $this.distry.invert(-(this.__origin__ - $this.h - $this.p.top));
                            
                            var new_last = $this.distr[$this.distr.length - 1] + $this.distr[i] - d;
                            if (new_last < 0 || new_last > 1 || d < 0 || d > 1) {                            
                                this.__origin__ -= d3.event.dy;
                            }
                            else {
                                update(d, i); $this.computeStatistics();
                            }
                        })
                     .on("dragend", function() {
                            delete this.__origin__;
                            
                        }))
                     .attr("cx", function(d, i) { return (i + 0.5) * $this.range + $this.p.left + 1; })
                     .attr("cy", function(d) { return $this.h + $this.p.top - $this.distry(d); });
        
        var update = function(v, i) {
            var dif = $this.distr[i] - v;
            $this.distr[i] = v;
            $this.distr[$this.distr.length - 1] = $this.distr[$this.distr.length - 1] + dif;
            var circle_data = $this.distr.slice(0);
            circle_data.pop();            
            $this.d_group.selectAll("rect")
                .data($this.distr)
                .attr("y", function(d) { return $this.h + $this.p.top - $this.distry(d); })
                .attr("height", function(d) { return $this.distry(d); });
        
        
            $this.d_group.selectAll("circle")
                     .data(circle_data)                     
                     .attr("cy", function(d) { return $this.h + $this.p.top - $this.distry(d); });
            
            $this.d_group.selectAll("text.d-value")
                .data($this.distr)
                .text(function(d) {return d3.round(d * 100, 1) + '%'});
         }
         update(va, 0);
    },
    
    computeStatistics: function() {
        var r = $M.chisquareTest(this.percent, this.distr);
        var content = '<div class="table-wrapper"><h3><span ' + getC(r.p) + '">Hypothesis (' + r.p.p(1) + ')</span></h3><table class="table table-bordered table-condensed"><thead><tr>';
        for (var i = 0; i < this.labels.length; i++) {
            content += '<th>' + this.labels[i] + '</th>';
        }
        content += '</tr><tr>';
        for (var i = 0; i < this.distr.length; i++) {
            content += '<td>' + this.distr[i].p(2) + '</td>';
        }
        content += '</tr></table></div>';       
        
        content += '<div class="table-wrapper"><h4>Pearson\'s χ test<sup>2</sup></h4><table class="table table-bordered table-condensed"><thead><tr><th>χ<sup>2</sup></th><th>df</th><th>p-value</th></tr></thead><tbody><tr><td>' + r.chi.p() + '</td><td>' + r.df + '</td><td>' + r.p.p(1) + '</td></tr></tbody></table></div>';
        
        $('.info').html(content);
    },
    
    clear: function() {
        this.g.remove();
        if (this.d_group) {
            this.d_group.remove();
        }
        $('.percent-button').hide();
        $('.info').html('');    
    }
}