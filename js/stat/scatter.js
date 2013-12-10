Scatter = {
    draw: function(sample1, sample2) {
        this.history(sample1.num, sample2.num);
        this.w = 250;
        this.h = 250;
        this.p = {top: 0, bottom: 20, right: 0, left: 20}
        this.p.w = this.p.right + this.p.left;
        this.p.h = this.p.bottom + this.p.top;
        this.prepareData(sample1, sample2);
        this.x = d3.scale.linear().range([0, this.w]).domain([sample1.min, sample1.max]);
        this.y = d3.scale.linear().range([this.h, 0]).domain([sample2.min, sample2.max]);
        this.addGroup();
        this.addAxis();
        this.drawCircles();
    },
    
    history: function(num1, num2) {
        if (!this.shown) this.shown = [];
        this.is_new = false;
        if (!this.shown[num1 + '#' + num2]) {
            this.shown[num1 + '#' + num2] = true;
            this.is_new = true;
        }
    },
    
    prepareData: function (sample1, sample2) {
        this.sample1 = sample1;
        this.sample2 = sample2;
        this.data = [];
        for (var i = 0; i < sample1.len; i++) {
            this.data.push([sample1.values[i], sample2.values[i]]);
        }
    },
    
    addGroup: function() {
        this.g = d3.select('#svg').append('g').attr('class', 'scatter').attr('width', this.w + this.p.w).attr('height', this.h + this.p.h).attr("transform", "translate(30,20)");
    },
    
    addAxis: function() {
        this.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(5, " + (this.h + 5) + ")")
        .call(d3.svg.axis().scale(this.x).orient("bottom").tickSize(-255).tickSubdivide(false));
        this.g.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(this.y).orient("left").tickSize(-255).tickSubdivide(false));
    },
    
    drawCircles: function() {
        var $this = this;
        if (!this.is_new) {
            this.circles = this.g.append("g").selectAll("circle")
            .data(this.data)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d) { return $this.x(d[0]) + 5;})
            .attr("cy", function(d) { return $this.y(d[1]); });
        }
        else {
            this.circles = this.g.append("g").selectAll("circle")
            .data(this.data)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d) { return 130;})
            .attr("cy", function(d) { return 125;})
            .transition()
            .duration(1000)            
            .attr("cx", function(d) { return $this.x(d[0]) + 5;})
            .attr("cy", function(d) { return $this.y(d[1]); });            
        }
    },
    
    corr: function() {
        var r = $M.pearsonCorr(this.sample1.values, this.sample2.values);
        var content = '<div class="table-wrapper">' +
        '<h3><span ' + getC(r.p) + '>Hypothesis (' + r.p.p(1) + ')</span></h3>'+
        '<p>r ≠ 0</p>' +
        '<h4>Pearson correlation coefficient</h4><table class="table table-bordered table-condensed"><thead><tr><th>r</th><th>p-value</th></tr></thead><tbody><tr><td>' + r.corr.p() + '</td><td>' + r.p.p(1) + '</td></tr></tbody></table></div>';
        r = $M.spearmanCorr(this.sample1.values, this.sample2.values);
        content += '<div class="table-wrapper">' + 
        '<h3><span ' + getC(r.p) + '>Hypothesis (' + r.p.p(1) + ')</span></h3>'+
        '<p>ρ ≠ 0</p>' +
        '<h4>Spearman\'s rank correlation coefficient</h4><table class="table table-bordered table-condensed"><thead><tr><th>ρ</th><th>p-value</th></tr></thead><tbody><tr><td>' + r.corr.p() + '</td><td>' + r.p.p(1) + '</td></tr></tbody></table></div>';
        var r = $M.regression(this.sample1.values, this.sample2.values);
        content += '<div class="table-wrapper">'+
        '<h3><span ' + getC(r.p) + '>Hypothesis (' + r.p.p(1) + ')</span></h3>'+
        '<p>R<sup>2</sup> ≠ 0</p>' +
        '<h4>Linear regression</h4><table class="table table-bordered table-condensed"><thead><tr><th>β</th><th>α</th><th>R<sup>2</sup></th><th>p-value</th></tr></thead><tbody><tr><td>' + r.beta.p() + '</td><td>' + r.alpha.p() + '</td><td>' + r.r2.p() + '</td><td>' + r.p.p(1) + '</td></tr></tbody></table></div>';
        this.drawLine(r);
        $('.info').html(content);  
    },

    drawLine: function(r) {
        var x_min = this.sample1.min, 
            x_max = this.sample1.max,
            y_min = x_min * r.beta + r.alpha,
            y_max = x_max * r.beta + r.alpha;
        this.g.append('line').attr('class', 'regr')
              .attr('x1', this.x(x_min) + 5)
              .attr('y1', this.y(y_min))
              .attr('x2', this.x(x_max) + 5)
              .attr('y2', this.y(y_max));
    },
    
    clear: function() {
        this.g.remove();
        $('.info').html('');  
    }
}