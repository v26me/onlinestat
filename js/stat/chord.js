Chord = {
    draw: function(sample1, sample2) {
        this.prepareData(sample1, sample2);
        this.chord = d3.layout.chord().padding(.05).sortSubgroups(d3.descending).matrix(this.matrix); 
        this.addGroup();        
    },

    prepareData: function(sample1, sample2) {
        this.units = [];
        this.sample1 = sample1;
        this.sample2 = sample2;
        this.card1 = sample1.card;
        this.card2 = sample2.card;
        for (var key in sample1.units) {
            this.units.push(sample1.units[key]);
        }
        for (var key in sample2.units) {
            this.units.push(sample2.units[key]);
        }
        this.table = [];
        for (var i = 0; i < sample1.units.length; i++) {
            this.table[i] = [];
            for (var j = 0; j < sample2.units.length; j++) {
                this.table[i][j] = 0;
            }
        }
        var val1, val2;
        for (var i = 0; i < sample1.len; i++) {
            val1 = sample1.values[i]; val2 = sample2.values[i];
            this.table[val1][val2]++;
        }
        
        
        this.matrix = [];
        for (var i = 0; i < sample1.card; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < sample1.card; j++) {
                this.matrix[i][j] = 0;
            }
            for (var j = 0; j < sample2.card; j++) {
                this.matrix[i][j + sample1.card] = this.table[i][j];
            }
        }
        for (var i = 0; i < sample2.card; i++) {
            this.matrix[i + sample1.card] = [];
            for (var j = 0; j < sample1.card; j++) {
                this.matrix[i + sample1.card][j] = this.table[j][i];
            }
            for (var j = 0; j < sample2.card; j++) {
                this.matrix[i + sample1.card][j + sample1.card] = 0;
            }
        }
    },
    
    addGroup: function() {
        var w = 300,
        h = 300,
        r0 = 100,
        r1 = r0 * 1.1;
    
        var fill = d3.scale.category10();
        var $this = this;
        this.g = d3.select("#svg")
        .append("g").attr('class', 'chord')
        .attr("width", w)
        .attr("height", h)
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
    
        this.g.append("g")
        .selectAll("path")
        .data(this.chord.groups)
          .enter().append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .style("opacity", 0.5)
        .attr("d", d3.svg.arc().innerRadius(r0).outerRadius(r1))
    
        this.g.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(this.chord.chords)
        .enter().append("path")
        .style("fill", function(d) { return fill(d.target.index); })
        .attr("d", d3.svg.chord().radius(r0))
        .style("opacity", 0.5);
        
        this.g.append('g')
        .selectAll("text")
        .data(this.chord.groups)
        .enter().append("text").attr('class', 'name')
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { var angle = (d.startAngle + d.endAngle) / 2; return (angle > Math.PI) ? "end" : 'start'; })
        .attr("transform", function(d) {
            var angle = Math.PI - (d.startAngle + d.endAngle) / 2;
            var x = (r0 + 15) * Math.sin(angle);
            var y = (r0 + 15) * Math.cos(angle);
             return ""
                + "translate(" + x + ', ' + y + ")"
            })
        .text(function(d) { return $this.units[d.index]; });
    },
    
    showInfo: function() {
        var content = '<div class="table-wrapper"><table class="table table-bordered"><thead><tr><th></th>';
        for (var i = 0; i < this.card2; i++) {
            content += '<th>' + this.units[i + this.card1] + '</th>';
        }
        content += '</tr></thead><tbody>';
        for (var i = 0; i < this.card1; i++) {
            content += '<tr><th>' + this.units[i] + '</th>';
            for (var j = 0; j < this.card2; j++) {
                content += '<td>'+this.table[i][j]+'</td>';
            }
            content += '</tr>';
        }
        content += '</tbody></table></div>';
        $('.info').html(content);
    },
    
    cross: function() {    
        var r = $M.cross(this.table);
        var s, c = 1/3;
        s = 'style="color: rgb(' + (182 - Math.floor((182 - 70) * Math.pow(r.p, c))) + ', ' + (74 + Math.floor((136 - 74) * Math.pow(r.p, c))) + ', ' + (72) + ')"';
        var content = '<div class="table-wrapper"><h3><span ' + s + '>Hypothesis (' + r.p.p(1) + ')</span></h3><p>' + this.sample1.name + ' and ' + this.sample2.name + ' are independent</p>';
        
        content += '<h4>Pearson\'s χ test<sup>2</sup></h4><table class=" table-condensed table table-bordered"><thead><tr><th>χ<sup>2</sup></th><th>df</th><th>p-value</th></tr></thead><tbody><tr><td>' + r.chi.p() + '</td><td>' + r.df + '</td><td>' + r.p.p(1) + '</td></tr></tbody></table>'; 
        if (this.table.length == 2 && this.table[0].length == 2) {
            r = $M.FicherExact(this.table);
            content += '<h4>Fisher\'s exact test</h4><table class="table-condensed table table-bordered"><thead><tr><th>p-value</th></tr></thead><tbody><tr><td>' + r.p.p(1) + '</td></tr></tbody></table>';                        
        }
        r = $M.uncertaintyC(this.table);
        content += '<h4>Uncerainty coefficient</h4><table class="table-condensed table table-bordered"><thead><tr><th>'+this.sample1.name+'</th><th>'+this.sample2.name+'</th><th>Both</th></tr></thead><tbody><tr><td>' + r.first.p(2) + '</td><td>' + r.second.p(2) + '</td><td>' + r.both.p(2) + '</td></tr></tbody></table></div>';
        $('.info').html(content);
    },
    
    clear: function() {
        this.g.remove();
        $('.info').html('');
    }    
}