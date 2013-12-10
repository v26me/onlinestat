QQ = {
    draw: function(sample) {
        this.sample = sample;
        this.history(sample.num);
        this.values = sample.sorted;
        var size = 280;
        this.g = d3.select('#svg').append('g')
                    .attr("width", size + 35)
                    .attr("height", size + 15)
                    .attr('class', 'qq');
                    
        this.g.append('line').attr('x1', 25).attr('y1', size - 5).attr('x2', size + 10).attr('y2', 10);
        var cor = [];
        var len = this.values.length;
        var q, mean = $M.mean(this.values), std = $M.std(this.values, mean);
        for (var i = 0; i < len; i++) {
            q = (i + 0.5) / len;
            cor.push([mean + std * $M.iND(q),$M.quantile(this.values, q)]);
        }
        var min = d3.min(d3.min(cor));
        var max = d3.max(d3.max(cor));
        var scale = d3.scale.linear().domain([min, max]).range([25, size + 10]);
        var scale_y = d3.scale.linear().domain([min, max]).range([size - 5, 10]);
        
        var rules = this.g.selectAll("g.rule").data(scale.ticks(10))
        .enter().append("g")
        .attr("class", "rule");

        rules.append("line")
        .attr("x1", scale)
        .attr("x2", scale)
        .attr("y1", 10)
        .attr("y2", size - 5);

        rules.append("line")
        .attr("class", function(d) { return d ? null : "axis"; })
        .attr("y1", scale_y)
        .attr("y2", scale_y)
        .attr("x1", 25)
        .attr("x2", size + 10);

        rules.append("text")
        .attr("x", scale)
        .attr("y", size)
        .attr("dy", "1.5em")
        .attr("text-anchor", "middle")
        .text(scale.tickFormat(10));

        rules.append("text")
        .attr("y", scale_y)
        .attr("x", 20)
        .attr("dy", ".35em")
        .attr('dx', '-.5em')
        .attr("text-anchor", "end")
        .text(scale.tickFormat(10));
        
        if (this.is_new) {
            this.g.selectAll('circle').data(cor).enter().append('circle').attr('r', 3)
            .attr('cx', function(d) {return Math.random() * size + 25;})
            .attr('cy', function(d) {return Math.random() * size + 10;})
            .transition()
            .duration(1500)
            .attr('cx', function(d) {return scale(d[0]);})
            .attr('cy', function(d) {return size + 20 - scale(d[1]);})
        }
        else {
            this.g.selectAll('circle').data(cor).enter().append('circle').attr('r', 3)
            .attr('cx', function(d) {return scale(d[0]);})
            .attr('cy', function(d) {return size + 20 - scale(d[1]);})
        }
        this.normalTest();
    },
    
    history: function(num) {
        if (!this.shown) this.shown = [];
        this.is_new = false;
        if (!this.shown[num]) {
            this.shown[num] = true;
            this.is_new = true;
        }
    },
    
    normalTest: function() {
        var r = $M.JBTest(this.values);
        var content = '<div class="table-wrapper"><h3><span ' + getC(r.p) + '>Hypothesis (' + r.p.p(1) + ')</span></h3>' + 
        '<p>' + this.sample.name + ' is normaly distibuted</p>' +
        '<h4>Jarque–Bera test</h4><table class="table table-bordered table-condensed"><thead><tr><th>JB</th><th>p-value</th></tr></thead><tbody><tr><td>' + r.JB.p() + '</td><td>' + r.p.p(1) + '</td></tr></tbody></table></div>';
        $('.info').html(content);
    },
    
    clear: function() {
        this.g.remove();
        $('.info').html('');
    }
}